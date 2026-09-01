import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { ManualUpiProvider } from '../services/payment/ManualUpiProvider.js';

const router = Router();
const manualUpiProvider = new ManualUpiProvider();

// 1. Create Checkout Session (Server-Validated)
router.post('/donations/create', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, amount, purpose, paymentMethod } = req.body;

    // Server-side validation
    if (!firstName || typeof firstName !== 'string' || firstName.trim().length < 2 || firstName.trim().length > 50) {
      return sendError(res, 'First Name must be between 2 and 50 characters', 400);
    }
    if (!lastName || typeof lastName !== 'string' || lastName.trim().length < 1 || lastName.trim().length > 50) {
      return sendError(res, 'Last Name must be between 1 and 50 characters', 400);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || email.length > 254 || !emailRegex.test(email.trim())) {
      return sendError(res, 'A valid email address (max 254 characters) is required', 400);
    }
    const cleanPhone = String(phone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      return sendError(res, 'Mobile number must be exactly 10 Indian digits', 400);
    }
    const numAmount = Number(amount);
    if (isNaN(numAmount) || !isFinite(numAmount) || numAmount < 100 || numAmount > 100000) {
      return sendError(res, 'Donation amount must be between ₹100 and ₹1,00,000', 400);
    }

    const donorName = `${firstName.trim()} ${lastName.trim()}`;
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
    const publicDonationId = `DON-${dateStr}-${randomHex}`;

    const count = await prisma.donation.count();
    const receiptNo = `LFR-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    // Calculate 5-minute session expiration
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const donation = await prisma.donation.create({
      data: {
        publicDonationId,
        donorName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        amount: numAmount,
        currency: 'INR',
        paymentMethod: paymentMethod || 'UPI_QR',
        provider: 'MANUAL_UPI',
        receiptNo,
        purpose: purpose || 'General Foundation Fund',
        status: 'CREATED',
        expiresAt,
      },
    });

    const sessionPayload = await manualUpiProvider.createCheckoutSession(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: cleanPhone,
        amount: numAmount,
        purpose,
        paymentMethod: paymentMethod || 'UPI_QR',
      },
      publicDonationId,
      receiptNo
    );

    return sendSuccess(res, 'Donation checkout session created', {
      ...sessionPayload,
      donationId: donation.id,
    }, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create donation session', 500);
  }
});

// 2. Verified Status Check (Server-Side Authority)
router.get('/donations/status/:publicDonationId', async (req: Request, res: Response) => {
  try {
    const { publicDonationId } = req.params;

    const donation = await prisma.donation.findUnique({
      where: { publicDonationId },
    });

    if (!donation) {
      return sendError(res, 'Donation record not found', 404);
    }

    // Check expiration
    if (
      donation.expiresAt &&
      new Date() > new Date(donation.expiresAt) &&
      (donation.status === 'CREATED' || donation.status === 'PENDING')
    ) {
      const updated = await prisma.donation.update({
        where: { id: donation.id },
        data: { status: 'EXPIRED' },
      });
      return sendSuccess(res, 'Donation session status checked', {
        publicDonationId: updated.publicDonationId,
        receiptNo: updated.receiptNo,
        status: updated.status,
        amount: updated.amount,
        currency: updated.currency,
        donorName: updated.donorName,
        createdAt: updated.createdAt,
      });
    }

    return sendSuccess(res, 'Donation status retrieved', {
      publicDonationId: donation.publicDonationId,
      receiptNo: donation.receiptNo,
      status: donation.status,
      amount: donation.amount,
      currency: donation.currency,
      donorName: donation.donorName,
      paidAt: donation.paidAt,
      createdAt: donation.createdAt,
      transactionId: donation.transactionId,
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to retrieve donation status', 500);
  }
});

// 3. Request Manual Status Verification Check
router.post('/donations/check-manual-payment', async (req: Request, res: Response) => {
  try {
    const { publicDonationId, transactionId } = req.body;

    if (!publicDonationId) {
      return sendError(res, 'Public Donation ID is required', 400);
    }

    const donation = await prisma.donation.findUnique({
      where: { publicDonationId },
    });

    if (!donation) {
      return sendError(res, 'Donation session not found', 404);
    }

    // Update to PENDING with optional transaction reference
    const updated = await prisma.donation.update({
      where: { id: donation.id },
      data: {
        status: 'PENDING',
        transactionId: transactionId || donation.transactionId,
      },
    });

    return sendSuccess(res, 'Payment status updated to pending bank verification', {
      publicDonationId: updated.publicDonationId,
      status: updated.status,
      receiptNo: updated.receiptNo,
      message: 'Payment verification is pending bank reconciliation.',
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update payment status', 500);
  }
});

// 4. Webhook Endpoint for Provider Payment Verification
router.post('/payments/webhook', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] || req.headers['x-webhook-signature'];
    const { event, payload } = req.body;

    if (event === 'payment.captured' && payload?.payment?.entity) {
      const entity = payload.payment.entity;
      const publicDonationId = entity.notes?.publicDonationId || entity.description;

      if (publicDonationId) {
        await prisma.donation.updateMany({
          where: { publicDonationId },
          data: {
            status: 'SUCCESS',
            paidAt: new Date(),
            providerPaymentId: entity.id,
            transactionId: entity.acquirer_data?.rrn || entity.id,
          },
        });
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

// 5. Admin List & Metrics Endpoint
router.get('/donations/admin/all', authenticateToken, requireRole(['ADMIN', 'TRUSTEE', 'STAFF']), async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;

    const whereClause: any = {};
    if (status && typeof status === 'string' && status !== 'ALL') {
      whereClause.status = status;
    }
    if (search && typeof search === 'string') {
      whereClause.OR = [
        { donorName: { contains: search } },
        { email: { contains: search } },
        { publicDonationId: { contains: search } },
        { receiptNo: { contains: search } },
      ];
    }

    const donations = await prisma.donation.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true, membershipNo: true },
        },
      },
    });

    const totalCount = await prisma.donation.count();
    const successAgg = await prisma.donation.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true },
      _count: { id: true },
    });
    const pendingAgg = await prisma.donation.aggregate({
      where: { status: 'PENDING' },
      _sum: { amount: true },
      _count: { id: true },
    });
    const failedAgg = await prisma.donation.aggregate({
      where: { status: 'FAILED' },
      _count: { id: true },
    });

    return sendSuccess(res, 'Donation records retrieved', {
      donations,
      metrics: {
        totalCount,
        totalSuccessAmount: successAgg._sum.amount || 0,
        successCount: successAgg._count.id || 0,
        pendingCount: pendingAgg._count.id || 0,
        pendingAmount: pendingAgg._sum.amount || 0,
        failedCount: failedAgg._count.id || 0,
      },
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch admin donations', 500);
  }
});

// 6. Admin Update Status (Manual Verification)
router.patch('/donations/admin/:id/status', authenticateToken, requireRole(['ADMIN', 'TRUSTEE']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, transactionId } = req.body;

    if (!['SUCCESS', 'FAILED', 'CANCELLED', 'PENDING'].includes(status)) {
      return sendError(res, 'Invalid status update', 400);
    }

    const updated = await prisma.donation.update({
      where: { id },
      data: {
        status,
        transactionId: transactionId || undefined,
        paidAt: status === 'SUCCESS' ? new Date() : undefined,
      },
    });

    return sendSuccess(res, `Donation status updated to ${status}`, updated);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update donation status', 500);
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Create donation record / receipt
router.post('/donations', async (req: Request, res: Response) => {
  try {
    const { donorName, email, phone, amount, currency, paymentMethod, transactionId, purpose, userId } = req.body;

    if (!donorName || !email || !amount) {
      return sendError(res, 'Donor name, email, and amount are required', 400);
    }

    const count = await prisma.donation.count();
    const receiptNo = `LFR-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    const donation = await prisma.donation.create({
      data: {
        donorName,
        email,
        phone,
        amount: Number(amount),
        currency: currency || 'INR',
        paymentMethod: paymentMethod || 'UPI',
        transactionId,
        receiptNo,
        purpose: purpose || 'General Foundation Fund',
        userId,
      },
    });

    return sendSuccess(res, 'Donation recorded successfully', donation, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to record donation', 500);
  }
});

// List all donations
router.get('/donations', authenticateToken, requireRole(['ADMIN', 'TRUSTEE', 'STAFF']), async (req: Request, res: Response) => {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true, membershipNo: true },
        },
      },
    });

    return sendSuccess(res, 'Donations list retrieved', donations);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch donations', 500);
  }
});

// Financial summary dashboard metrics
router.get('/summary', authenticateToken, requireRole(['ADMIN', 'TRUSTEE', 'STAFF']), async (req: Request, res: Response) => {
  try {
    const totalDonationsCount = await prisma.donation.count();
    const totalAmount = await prisma.donation.aggregate({
      _sum: { amount: true },
    });

    const recentDonations = await prisma.donation.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return sendSuccess(res, 'Financial summary calculated', {
      totalDonationsCount,
      totalAmountRaised: totalAmount._sum.amount || 0,
      recentDonations,
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to calculate financial summary', 500);
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ─── Submit Contact/Feedback Message (public) ─────────────────────────────────
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return sendError(res, 'Name, email, and message are required', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return sendError(res, 'Please provide a valid email address', 400);
    }

    if (message.trim().length < 10) {
      return sendError(res, 'Message must be at least 10 characters long', 400);
    }

    const msg = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone || null,
        subject: subject || null,
        message: message.trim(),
      },
    });

    return sendSuccess(res, 'Thank you for reaching out! We will get back to you soon.', { id: msg.id }, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to submit message', 500);
  }
});

// ─── List Contact Messages (ADMIN only) ───────────────────────────────────────
router.get('/', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'STAFF']), async (req: Request, res: Response) => {
  try {
    const { status, page, limit } = req.query;
    const pageNum = Math.max(1, parseInt(String(page || '1'), 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(String(limit || '20'), 10)));

    const where: any = {};
    if (status) where.status = String(status);

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.contactMessage.count({ where }),
    ]);

    return sendSuccess(res, 'Contact messages retrieved', {
      messages,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch messages', 500);
  }
});

// ─── Mark Message as Read / Reply ────────────────────────────────────────────
router.patch('/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'STAFF']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminReply } = req.body;

    const updated = await prisma.contactMessage.update({
      where: { id: String(id) },
      data: {
        status: status || 'READ',
        adminReply: adminReply || undefined,
        repliedAt: adminReply ? new Date() : undefined,
      },
    });

    return sendSuccess(res, 'Message updated', updated);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update message', 500);
  }
});

export default router;

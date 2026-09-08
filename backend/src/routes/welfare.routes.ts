import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.js';
import { logAudit } from '../middleware/audit.js';

const router = Router();

// ─── Submit Welfare Request (any authenticated user) ──────────────────────────
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { type, description, amountRequested, requesterName, requesterPhone, requesterEmail } = req.body;

    if (!type || !description || !requesterName) {
      return sendError(res, 'Type, description, and requester name are required', 400);
    }

    const validTypes = ['MEDICAL', 'FINANCIAL', 'EDUCATION', 'FOOD', 'EMERGENCY', 'OTHER'];
    if (!validTypes.includes(type)) {
      return sendError(res, `Invalid request type. Must be one of: ${validTypes.join(', ')}`, 400);
    }

    const request = await prisma.welfareRequest.create({
      data: {
        requesterId: req.user?.id || null,
        requesterName: requesterName.trim(),
        requesterPhone: requesterPhone || null,
        requesterEmail: requesterEmail || null,
        type,
        description,
        amountRequested: amountRequested ? Number(amountRequested) : null,
        status: 'SUBMITTED',
        priority: type === 'EMERGENCY' ? 'URGENT' : 'NORMAL',
      },
    });

    await logAudit({
      actorId: req.user?.id || null,
      action: 'WELFARE_REQUEST_SUBMITTED',
      resource: 'WelfareRequest',
      resourceId: request.id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      success: true,
      metadata: JSON.stringify({ type, priority: request.priority }),
    });

    return sendSuccess(res, 'Welfare request submitted. The Foundation team will review your request.', {
      id: request.id,
      status: request.status,
      priority: request.priority,
    }, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to submit welfare request', 500);
  }
});

// ─── Get Current User's Own Welfare Requests (Any Authenticated User) ─────────
router.get('/my-requests', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return sendError(res, 'Authentication required', 401);
    }

    const requests = await prisma.welfareRequest.findMany({
      where: {
        requesterId: req.user.id,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        description: true,
        amountRequested: true,
        amountApproved: true,
        status: true,
        priority: true,
        adminNotes: true,
        createdAt: true,
        approvedAt: true,
        disbursedAt: true,
      },
    });

    return sendSuccess(res, 'Personal welfare requests retrieved', { requests });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch welfare requests', 500);
  }
});

// ─── List All Welfare Requests (ADMIN/CORE_MEMBER/TRUSTEE only) ───────────────
router.get('/', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'TRUSTEE', 'CORE_MEMBER']), async (req: Request, res: Response) => {
  try {
    const { status, priority, type, page, limit } = req.query;
    const pageNum = Math.max(1, parseInt(String(page || '1'), 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(String(limit || '20'), 10)));

    const where: any = { deletedAt: null };
    if (status) where.status = String(status);
    if (priority) where.priority = String(priority);
    if (type) where.type = String(type);

    const [requests, total] = await Promise.all([
      prisma.welfareRequest.findMany({
        where,
        orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
          requester: { select: { name: true, membershipNo: true } },
        },
      }),
      prisma.welfareRequest.count({ where }),
    ]);

    return sendSuccess(res, 'Welfare requests retrieved', {
      requests,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch welfare requests', 500);
  }
});

// ─── Update Welfare Request Status (ADMIN/TRUSTEE only) ──────────────────────
router.patch('/:id/status', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'TRUSTEE']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, amountApproved, adminNotes } = req.body;

    const validStatuses = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'DISBURSED', 'REJECTED', 'CLOSED'];
    if (!validStatuses.includes(status)) {
      return sendError(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const existing = await prisma.welfareRequest.findUnique({ where: { id: String(id), deletedAt: null } });
    if (!existing) return sendError(res, 'Welfare request not found', 404);

    const updated = await prisma.welfareRequest.update({
      where: { id: String(id) },
      data: {
        status,
        amountApproved: amountApproved ? Number(amountApproved) : existing.amountApproved,
        adminNotes: adminNotes || existing.adminNotes,
        reviewedById: req.user?.id,
        approvedAt: status === 'APPROVED' ? new Date() : existing.approvedAt,
        disbursedAt: status === 'DISBURSED' ? new Date() : existing.disbursedAt,
      },
    });

    await logAudit({
      actorId: req.user?.id || null,
      action: 'WELFARE_REQUEST_STATUS_CHANGED',
      resource: 'WelfareRequest',
      resourceId: String(id),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      success: true,
      metadata: JSON.stringify({ newStatus: status, amountApproved }),
    });

    return sendSuccess(res, `Welfare request status updated to ${status}`, updated);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update welfare request', 500);
  }
});

export default router;

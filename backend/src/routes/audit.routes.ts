import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ─── List Audit Logs (SUPER_ADMIN only) ───────────────────────────────────────
router.get('/', authenticateToken, requireRole(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { actorId, action, resource, success, page, limit } = req.query;
    const pageNum = Math.max(1, parseInt(String(page || '1'), 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit || '20'), 10)));

    const where: any = {};
    if (actorId) where.actorId = String(actorId);
    if (action) where.action = { contains: String(action) };
    if (resource) where.resource = String(resource);
    if (success !== undefined) where.success = success === 'true';

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
          actor: { select: { name: true, email: true, role: true } },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return sendSuccess(res, 'Audit logs retrieved', {
      logs,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch audit logs', 500);
  }
});

// ─── List Actions Performed by a Specific User ────────────────────────────────
router.get('/user/:userId', authenticateToken, requireRole(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '20'), 10)));

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: { actorId: String(userId) },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where: { actorId: String(userId) } }),
    ]);

    return sendSuccess(res, 'User audit trail retrieved', {
      logs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch user audit trail', 500);
  }
});

export default router;


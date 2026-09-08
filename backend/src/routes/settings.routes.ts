import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.js';
import { logAudit } from '../middleware/audit.js';

const router = Router();

// ─── Get All Settings (public-safe subset for website config) ─────────────────
router.get('/', async (req: Request, res: Response) => {
  try {
    const settings = await prisma.foundationSetting.findMany({
      where: {
        // Only expose public-safe settings (exclude security-sensitive ones)
        key: {
          notIn: ['upi.vpa', 'jwt.secret', 'webhook.secret'],
        },
      },
    });

    // Convert array to key-value map for easy frontend consumption
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => { settingsMap[s.key] = s.value; });

    return sendSuccess(res, 'Foundation settings retrieved', settingsMap);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch settings', 500);
  }
});

// ─── Get Single Setting ───────────────────────────────────────────────────────
router.get('/:key', async (req: Request, res: Response) => {
  try {
    const keyStr = String(req.params.key);
    const sensitiveKeys = ['upi.vpa', 'jwt.secret', 'webhook.secret'];
    if (sensitiveKeys.includes(keyStr)) {
      return sendError(res, 'Access denied', 403);
    }

    const setting = await prisma.foundationSetting.findUnique({ where: { key: keyStr } });
    if (!setting) return sendError(res, 'Setting not found', 404);

    return sendSuccess(res, 'Setting retrieved', setting);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch setting', 500);
  }
});

// ─── Get Admin Settings (includes sensitive config) ───────────────────────────
router.get('/admin/all', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const settings = await prisma.foundationSetting.findMany({ orderBy: { key: 'asc' } });
    return sendSuccess(res, 'All foundation settings retrieved', settings);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch settings', 500);
  }
});

// ─── Update Setting (SUPER_ADMIN only) ───────────────────────────────────────
router.put('/:key', authenticateToken, requireRole(['SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const keyStr = String(req.params.key);
    const { value, description } = req.body;

    if (value === undefined || value === null) {
      return sendError(res, 'Value is required', 400);
    }

    const updated = await prisma.foundationSetting.upsert({
      where: { key: keyStr },
      update: { value: String(value), description, updatedById: req.user?.id },
      create: { key: keyStr, value: String(value), description, updatedById: req.user?.id },
    });

    await logAudit({
      actorId: req.user?.id || null,
      action: 'SETTING_UPDATED',
      resource: 'FoundationSetting',
      resourceId: keyStr,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      success: true,
      metadata: JSON.stringify({ key: keyStr, newValue: String(value) }),
    });

    return sendSuccess(res, 'Setting updated', updated);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update setting', 500);
  }
});

export default router;

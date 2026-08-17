import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Get all government grants and scheme applications
router.get('/', authenticateToken, requireRole(['ADMIN', 'TRUSTEE', 'STAFF']), async (req: Request, res: Response) => {
  try {
    const grants = await prisma.grant.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, 'Government grants list retrieved', grants);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch grants', 500);
  }
});

// Submit/Create new grant application record
router.post('/', authenticateToken, requireRole(['ADMIN', 'TRUSTEE', 'STAFF']), async (req: Request, res: Response) => {
  try {
    const { title, schemeName, department, amountRequested, pfmsReference } = req.body;

    if (!title || !schemeName || !department || !amountRequested) {
      return sendError(res, 'Title, schemeName, department, and amountRequested are required', 400);
    }

    const grant = await prisma.grant.create({
      data: {
        title,
        schemeName,
        department,
        amountRequested: Number(amountRequested),
        pfmsReference,
      },
    });

    return sendSuccess(res, 'Government grant record created', grant, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to record grant', 500);
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Get meetings
router.get('/', authenticateToken, requireRole(['ADMIN', 'TRUSTEE', 'STAFF']), async (req: Request, res: Response) => {
  try {
    const meetings = await prisma.meeting.findMany({
      orderBy: { date: 'desc' },
    });
    return sendSuccess(res, 'Meetings list retrieved', meetings);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch meetings', 500);
  }
});

// Create meeting notice
router.post('/', authenticateToken, requireRole(['ADMIN', 'TRUSTEE', 'STAFF']), async (req: Request, res: Response) => {
  try {
    const { title, type, date, location, agenda } = req.body;

    if (!title || !date || !location || !agenda) {
      return sendError(res, 'Title, date, location, and agenda are required', 400);
    }

    const meeting = await prisma.meeting.create({
      data: {
        title,
        type: type || 'GENERAL',
        date: new Date(date),
        location,
        agenda,
      },
    });

    return sendSuccess(res, 'Meeting notice created successfully', meeting, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create meeting notice', 500);
  }
});

export default router;

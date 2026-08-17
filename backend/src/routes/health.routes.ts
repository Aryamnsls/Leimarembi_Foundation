import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// List health checkup camps & records
router.get('/', async (req: Request, res: Response) => {
  try {
    const records = await prisma.healthRecord.findMany({
      orderBy: { date: 'desc' },
    });
    return sendSuccess(res, 'Health camp records retrieved', records);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch health records', 500);
  }
});

// Create new health camp record
router.post('/', authenticateToken, requireRole(['ADMIN', 'TRUSTEE', 'STAFF']), async (req: Request, res: Response) => {
  try {
    const { campName, location, date, patientsServed, doctorsCount, details } = req.body;

    if (!campName || !location || !date || !details) {
      return sendError(res, 'campName, location, date, and details are required', 400);
    }

    const record = await prisma.healthRecord.create({
      data: {
        campName,
        location,
        date: new Date(date),
        patientsServed: Number(patientsServed) || 0,
        doctorsCount: Number(doctorsCount) || 1,
        details,
      },
    });

    return sendSuccess(res, 'Health camp record created', record, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create health record', 500);
  }
});

export default router;

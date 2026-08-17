import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Get cultural heritage archive items
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const where: any = {};
    if (category) where.category = String(category);

    const items = await prisma.culturalItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, 'Cultural archive items retrieved', items);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch cultural items', 500);
  }
});

// Add new cultural item to archive
router.post('/', authenticateToken, requireRole(['ADMIN', 'TRUSTEE', 'STAFF']), async (req: Request, res: Response) => {
  try {
    const { title, category, description, mediaUrl, archiveType, region, language } = req.body;

    if (!title || !description) {
      return sendError(res, 'Title and description are required', 400);
    }

    const item = await prisma.culturalItem.create({
      data: {
        title,
        category: category || 'HERITAGE',
        description,
        mediaUrl,
        archiveType: archiveType || 'DOCUMENT',
        region: region || 'Manipur',
        language: language || 'Manipuri / Meiteilon',
      },
    });

    return sendSuccess(res, 'Cultural item archived successfully', item, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to add cultural item', 500);
  }
});

export default router;

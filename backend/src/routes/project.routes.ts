import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Get all projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, 'Projects list retrieved', projects);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch projects', 500);
  }
});

// Create project
router.post('/', authenticateToken, requireRole(['ADMIN', 'TRUSTEE', 'STAFF']), async (req: Request, res: Response) => {
  try {
    const { title, category, description, budget, startDate, endDate, location, beneficiariesCount } = req.body;

    if (!title || !description || !startDate || !location) {
      return sendError(res, 'Title, description, startDate, and location are required', 400);
    }

    const project = await prisma.project.create({
      data: {
        title,
        category: category || 'Community Development',
        description,
        budget: Number(budget) || 0,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        beneficiariesCount: Number(beneficiariesCount) || 0,
      },
    });

    return sendSuccess(res, 'Project created successfully', project, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create project', 500);
  }
});

export default router;

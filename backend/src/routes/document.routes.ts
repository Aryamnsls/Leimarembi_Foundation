import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Get digital library documents
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, type } = req.query;
    const where: any = { isPublic: true };
    if (category) where.category = String(category);
    if (type) where.documentType = String(type);

    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, 'Digital library documents retrieved', documents);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch documents', 500);
  }
});

// Create document record
router.post('/', authenticateToken, requireRole(['ADMIN', 'TRUSTEE', 'STAFF']), async (req: Request, res: Response) => {
  try {
    const { title, documentType, category, fileUrl, fileSize, description, isPublic } = req.body;

    if (!title || !fileUrl || !description) {
      return sendError(res, 'Title, fileUrl, and description are required', 400);
    }

    const doc = await prisma.document.create({
      data: {
        title,
        documentType: documentType || 'TRUST_DEED',
        category: category || 'GOVERNANCE',
        fileUrl,
        fileSize: fileSize || '1.2 MB',
        description,
        isPublic: isPublic !== undefined ? Boolean(isPublic) : true,
      },
    });

    return sendSuccess(res, 'Document added to digital library', doc, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create document', 500);
  }
});

export default router;

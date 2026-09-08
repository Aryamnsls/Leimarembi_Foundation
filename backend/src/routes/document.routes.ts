import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.js';
import { logAudit } from '../middleware/audit.js';

const router = Router();

const ROLE_HIERARCHY: Record<string, number> = {
  PUBLIC: 0,
  REGISTERED_USER: 1,
  MEMBER: 2,
  VOLUNTEER: 2,
  CORE_MEMBER: 3,
  STAFF: 4,
  TRUSTEE: 5,
  ADMIN: 6,
  SUPER_ADMIN: 7,
};

// ─── Get Public / Accessible Digital Library Documents ───────────────────────
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, type, accessLevel } = req.query;
    const where: any = { isPublic: true, deletedAt: null };
    if (category) where.category = String(category);
    if (type) where.documentType = String(type);
    if (accessLevel) where.accessLevel = String(accessLevel);

    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        documentType: true,
        category: true,
        description: true,
        fileSize: true,
        isPublic: true,
        accessLevel: true,
        downloadCount: true,
        createdAt: true,
      },
    });

    return sendSuccess(res, 'Digital library documents retrieved', documents);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch documents', 500);
  }
});

// ─── Serve / Access Private Document File (P0.6 & P1B.3 Protection) ─────────
router.get('/:id/serve', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await prisma.document.findUnique({
      where: { id: String(id), deletedAt: null },
    });

    if (!doc) {
      return sendError(res, 'Document not found or has been archived', 404);
    }

    const requiredLevel = ROLE_HIERARCHY[doc.accessLevel] || 0;

    // If document is PUBLIC, allow direct access
    if (requiredLevel === 0) {
      await prisma.document.update({
        where: { id: doc.id },
        data: { downloadCount: { increment: 1 } },
      });
      return sendSuccess(res, 'Document access granted', { fileUrl: doc.fileUrl, accessLevel: doc.accessLevel });
    }

    // Require authentication for non-public documents
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return sendError(res, `Authentication required to access '${doc.accessLevel}' document`, 401);
    }

    // Wrap token check
    return authenticateToken(req as AuthRequest, res, async () => {
      const authReq = req as AuthRequest;
      const userRole = authReq.user?.role || 'PUBLIC';
      const userLevel = ROLE_HIERARCHY[userRole] || 0;

      if (userLevel < requiredLevel) {
        await logAudit({
          actorId: authReq.user?.id || null,
          action: 'DOCUMENT_ACCESS_DENIED',
          resource: 'Document',
          resourceId: doc.id,
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          success: false,
          metadata: JSON.stringify({ requiredLevel: doc.accessLevel, userRole }),
        });
        return sendError(res, `Access denied: requires ${doc.accessLevel} clearance`, 403);
      }

      await prisma.document.update({
        where: { id: doc.id },
        data: { downloadCount: { increment: 1 } },
      });

      await logAudit({
        actorId: authReq.user?.id || null,
        action: 'DOCUMENT_ACCESSED',
        resource: 'Document',
        resourceId: doc.id,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        success: true,
      });

      return sendSuccess(res, 'Document access granted', { fileUrl: doc.fileUrl, accessLevel: doc.accessLevel });
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to serve document', 500);
  }
});

// ─── Upload / Create Document Record (ADMIN/TRUSTEE/STAFF) ────────────────────
router.post('/', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'TRUSTEE', 'STAFF']), async (req: AuthRequest, res: Response) => {
  try {
    const { title, documentType, category, fileUrl, fileSize, description, isPublic, accessLevel } = req.body;

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
        accessLevel: accessLevel || 'PUBLIC',
        uploadedById: req.user?.id,
      },
    });

    await logAudit({
      actorId: req.user?.id || null,
      action: 'DOCUMENT_UPLOADED',
      resource: 'Document',
      resourceId: doc.id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      success: true,
    });

    return sendSuccess(res, 'Document added to digital library', doc, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create document', 500);
  }
});

export default router;

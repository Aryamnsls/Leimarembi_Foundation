import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ─── Get Published News (public, paginated) ───────────────────────────────────
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, page, limit } = req.query;
    const pageNum = Math.max(1, parseInt(String(page || '1'), 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(String(limit || '10'), 10)));

    const where: any = { isPublic: true, status: 'PUBLISHED', deletedAt: null };
    if (category) where.category = String(category);

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        select: { id: true, title: true, slug: true, excerpt: true, imageUrl: true, category: true, publishedAt: true, viewCount: true },
      }),
      prisma.news.count({ where }),
    ]);

    return sendSuccess(res, 'News retrieved', { news, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch news', 500);
  }
});

// ─── Get Single Article by Slug ───────────────────────────────────────────────
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const article = await prisma.news.findUnique({ where: { slug: String(slug), isPublic: true, deletedAt: null } });
    if (!article) return sendError(res, 'Article not found', 404);

    // Increment view count
    await prisma.news.update({ where: { slug: String(slug) }, data: { viewCount: { increment: 1 } } });

    return sendSuccess(res, 'Article retrieved', article);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch article', 500);
  }
});

// ─── Create News Article (ADMIN/STAFF/SUPER_ADMIN) ────────────────────────────
router.post('/', authenticateToken, requireRole(['ADMIN', 'STAFF']), async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, excerpt, imageUrl, category, status, isPublic } = req.body;
    if (!title || !content) return sendError(res, 'Title and content are required', 400);

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();
    const publishedAt = status === 'PUBLISHED' ? new Date() : null;

    const article = await prisma.news.create({
      data: {
        title, slug, content,
        excerpt: excerpt || content.substring(0, 200) + '...',
        imageUrl, category: category || 'GENERAL',
        status: status || 'DRAFT',
        isPublic: isPublic !== undefined ? Boolean(isPublic) : true,
        publishedAt,
        authorId: req.user?.id,
      },
    });

    return sendSuccess(res, 'News article created', article, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create article', 500);
  }
});

// ─── Update News Article ──────────────────────────────────────────────────────
router.put('/:id', authenticateToken, requireRole(['ADMIN', 'STAFF']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, imageUrl, category, status, isPublic } = req.body;

    const existing = await prisma.news.findUnique({ where: { id: String(id), deletedAt: null } });
    if (!existing) return sendError(res, 'Article not found', 404);

    const publishedAt = status === 'PUBLISHED' && !existing.publishedAt ? new Date() : existing.publishedAt;

    const updated = await prisma.news.update({
      where: { id: String(id) },
      data: { title, content, excerpt, imageUrl, category, status, isPublic, publishedAt },
    });

    return sendSuccess(res, 'Article updated', updated);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update article', 500);
  }
});

// ─── Soft-Delete News Article ─────────────────────────────────────────────────
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), async (req: Request, res: Response) => {
  try {
    await prisma.news.update({ where: { id: String(req.params.id) }, data: { deletedAt: new Date() } });
    return sendSuccess(res, 'Article archived (soft deleted)');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete article', 500);
  }
});

export default router;


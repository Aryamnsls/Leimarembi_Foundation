import { Router } from 'express';
import authRoutes from './auth.routes.js';
import memberRoutes from './member.routes.js';
import financeRoutes from './finance.routes.js';
import projectRoutes from './project.routes.js';
import meetingRoutes from './meeting.routes.js';
import grantRoutes from './grant.routes.js';
import cultureRoutes from './culture.routes.js';
import healthRoutes from './health.routes.js';
import documentRoutes from './document.routes.js';
import newsRoutes from './news.routes.js';
import settingsRoutes from './settings.routes.js';
import welfareRoutes from './welfare.routes.js';
import contactRoutes from './contact.routes.js';
import auditRoutes from './audit.routes.js';

const router = Router();

// ─── Core Auth ────────────────────────────────────────────────────────────────
router.use('/auth', authRoutes);

// ─── Member Management ───────────────────────────────────────────────────────
router.use('/members', memberRoutes);

// ─── Finance & Donations ─────────────────────────────────────────────────────
router.use('/finance', financeRoutes);

// ─── Governance ──────────────────────────────────────────────────────────────
router.use('/projects', projectRoutes);
router.use('/meetings', meetingRoutes);
router.use('/grants', grantRoutes);

// ─── Content ─────────────────────────────────────────────────────────────────
router.use('/culture', cultureRoutes);
router.use('/health', healthRoutes);
router.use('/documents', documentRoutes);
router.use('/news', newsRoutes);

// ─── Welfare & Social ─────────────────────────────────────────────────────────
router.use('/welfare', welfareRoutes);
router.use('/contact', contactRoutes);

// ─── Admin/System ────────────────────────────────────────────────────────────
router.use('/settings', settingsRoutes);
router.use('/audit', auditRoutes);

export default router;



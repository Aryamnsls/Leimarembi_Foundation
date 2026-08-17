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

const router = Router();

router.use('/auth', authRoutes);
router.use('/members', memberRoutes);
router.use('/finance', financeRoutes);
router.use('/projects', projectRoutes);
router.use('/meetings', meetingRoutes);
router.use('/grants', grantRoutes);
router.use('/culture', cultureRoutes);
router.use('/health', healthRoutes);
router.use('/documents', documentRoutes);

export default router;

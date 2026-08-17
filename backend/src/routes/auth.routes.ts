import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';
import { env } from '../config/env.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Register new member / user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, address, bloodGroup, isSeniorCitizen, familyMembersCount } = req.body;

    if (!email || !password || !name) {
      return sendError(res, 'Email, password, and name are required', 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return sendError(res, 'User with this email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const count = await prisma.user.count();
    const membershipNo = `LF-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        address,
        bloodGroup,
        isSeniorCitizen: Boolean(isSeniorCitizen),
        familyMembersCount: Number(familyMembersCount) || 1,
        membershipNo,
        role: 'MEMBER',
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    const { password: _, ...userWithoutPassword } = user;
    return sendSuccess(res, 'Registration successful', { user: userWithoutPassword, token }, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Registration failed', 500);
  }
});

// User login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendError(res, 'Invalid credentials', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return sendError(res, 'Invalid credentials', 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    const { password: _, ...userWithoutPassword } = user;
    return sendSuccess(res, 'Login successful', { user: userWithoutPassword, token });
  } catch (error: any) {
    return sendError(res, error.message || 'Login failed', 500);
  }
});

// Current user profile
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        membershipNo: true,
        phone: true,
        address: true,
        bloodGroup: true,
        isSeniorCitizen: true,
        familyMembersCount: true,
        createdAt: true,
      },
    });

    if (!user) {
      return sendError(res, 'User profile not found', 404);
    }

    return sendSuccess(res, 'User profile retrieved', user);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch user profile', 500);
  }
});

export default router;

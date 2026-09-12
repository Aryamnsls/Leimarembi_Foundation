import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';
import { env } from '../config/env.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

function isSuperAdminEmailOrPhone(eMail?: string, pHone?: string): boolean {
  const e = (eMail || '').toLowerCase().trim();
  const p = (pHone || '').replace(/[^0-9]/g, '');
  return (
    e === 'aryamansingha60@gmail.com' ||
    e === 'aryamansingha60@gail.com' ||
    e === 'binababu.singha@yahoo.com' ||
    p === '7099659804' ||
    p === '7637087931' ||
    p.endsWith('7099659804') ||
    p.endsWith('7637087931')
  );
}

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

    const assignedRole = isSuperAdminEmailOrPhone(email, phone) ? 'ADMIN' : 'MEMBER';

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
        role: assignedRole,
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

    if (!user.password) {
      return sendError(res, 'Invalid credentials. Please login with your Google account.', 401);
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

// Update user profile (Blood group, Senior status, Phone, etc.)
router.put('/update-profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { bloodGroup, isSeniorCitizen, phone, address } = req.body;
    const updateData: any = {};
    if (bloodGroup !== undefined) updateData.bloodGroup = bloodGroup;
    if (isSeniorCitizen !== undefined) updateData.isSeniorCitizen = Boolean(isSeniorCitizen);
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    const user = await prisma.user.update({
      where: { id: req.user?.id },
      data: updateData,
    });

    const { password: _, ...userWithoutPassword } = user;
    return sendSuccess(res, 'Profile updated successfully', userWithoutPassword);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update profile', 500);
  }
});

import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Sign-In / Register
router.post('/google', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return sendError(res, 'Google token is required', 400);
    }

    // Verify token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return sendError(res, 'Invalid Google token', 400);
    }

    const { email, name, sub: googleId } = payload;

    // Find existing user
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create new user via Google
      const count = await prisma.user.count();
      const membershipNo = `LF-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

      const assignedRole = isSuperAdminEmailOrPhone(email) ? 'ADMIN' : 'MEMBER';
      user = await prisma.user.create({
        data: {
          email,
          name: name || 'Google User',
          authProvider: 'GOOGLE',
          googleId,
          membershipNo,
          role: assignedRole,
          password: null, // No password for Google auth
        },
      });
    } else {
      // Update existing user to link Google account and ensure ADMIN role if Super Admin
      const updateData: any = {};
      if (!user.googleId) updateData.googleId = googleId;
      if (!user.authProvider || user.authProvider === 'LOCAL') updateData.authProvider = 'GOOGLE';
      if (isSuperAdminEmailOrPhone(user.email, user.phone) && user.role !== 'ADMIN') {
        updateData.role = 'ADMIN';
      }

      if (Object.keys(updateData).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
      }
    }

    const jwtToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    const { password: _, ...userWithoutPassword } = user;
    return sendSuccess(res, 'Google authentication successful', { user: userWithoutPassword, token: jwtToken }, 200);
  } catch (error: any) {
    return sendError(res, error.message || 'Google authentication failed', 500);
  }
});

export default router;

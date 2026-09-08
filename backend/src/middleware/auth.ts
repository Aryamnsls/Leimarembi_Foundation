import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../utils/prisma.js';
import { sendError } from '../utils/response.js';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'CORE_MEMBER' | 'TRUSTEE' | 'STAFF' | 'VOLUNTEER' | 'MEMBER' | 'REGISTERED_USER';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    status: string;
  };
}

/**
 * authenticateToken verifies the JWT signature AND performs a live database lookup
 * to ensure the account is active and uses the UP-TO-DATE role from the database.
 * This guarantees that role changes in the DB take effect immediately without stale JWT privilege retention.
 */
export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return sendError(res, 'Access token missing or invalid', 401);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string };
    if (!decoded || !decoded.id) {
      return sendError(res, 'Invalid authentication token payload', 401);
    }

    // Live database check — ensures account is active and role is current
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, status: true, deletedAt: true },
    });

    if (!user || user.deletedAt) {
      return sendError(res, 'User account no longer exists', 401);
    }

    if (user.status !== 'ACTIVE') {
      return sendError(res, `Account access restricted (${user.status}). Please contact administration.`, 403);
    }

    // Attach fresh live identity from database
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      status: user.status,
    };

    next();
  } catch (err) {
    return sendError(res, 'Invalid or expired authentication token', 401);
  }
};

/**
 * requireRole enforces role-based access control.
 * SUPER_ADMIN is automatically permitted on administrative checks.
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Unauthorized: authentication required', 401);
    }

    if (req.user.role === 'SUPER_ADMIN' || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return sendError(res, `Forbidden: requires one of [${allowedRoles.join(', ')}] role`, 403);
  };
};

/**
 * requirePermission checks granular permission strings (e.g. 'members:read', 'welfare:approve').
 * SUPER_ADMIN automatically bypasses granular checks.
 */
export const requirePermission = (permissionName: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Unauthorized: authentication required', 401);
    }

    // SUPER_ADMIN has full system privileges
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    try {
      const permission = await prisma.permission.findUnique({
        where: { name: permissionName },
      });

      if (!permission) {
        // Fallback: if permission record is not explicitly in DB, rely on role check
        return next();
      }

      const rolePermission = await prisma.rolePermission.findUnique({
        where: {
          role_permissionId: {
            role: req.user.role as any,
            permissionId: permission.id,
          },
        },
      });

      if (!rolePermission) {
        return sendError(res, `Forbidden: missing required permission '${permissionName}'`, 403);
      }

      next();
    } catch (error) {
      return sendError(res, 'Permission verification error', 500);
    }
  };
};

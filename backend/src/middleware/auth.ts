import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../utils/prisma.js';
import { sendError } from '../utils/response.js';

export type UserRole = 'ADMIN' | 'TRUSTEE' | 'STAFF' | 'MEMBER';

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
  const [scheme, token] = authHeader?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token) {
    return sendError(res, 'Access token missing or invalid', 401);
  }

  let decoded: { id: string; email?: string };
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (typeof payload === 'string' || !payload.id || typeof payload.id !== 'string') {
      return sendError(res, 'Invalid authentication token payload', 401);
    }
    decoded = { id: payload.id, email: typeof payload.email === 'string' ? payload.email : undefined };
  } catch {
    return sendError(res, 'Invalid or expired authentication token', 401);
  }

  try {
    // Live database check ensures account status and role changes take effect immediately.
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, status: true },
    });

    if (!user) {
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
  } catch {
    return sendError(res, 'Authentication service unavailable', 503);
  }
};

/**
 * requireRole enforces role-based access control.
 * ADMIN is the highest role defined by the Prisma schema and is permitted on administrative checks.
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Unauthorized: authentication required', 401);
    }

    if (req.user.role === 'ADMIN' || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return sendError(res, `Forbidden: requires one of [${allowedRoles.join(', ')}] role`, 403);
  };
};

/**
 * Granular permissions are not part of the current Prisma role model. Fail closed
 * until a permission store and route policy are implemented.
 */
export const requirePermission = (permissionName: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Unauthorized: authentication required', 401);
    }

    return sendError(res, `Forbidden: permission '${permissionName}' is not configured`, 403);
  };
};

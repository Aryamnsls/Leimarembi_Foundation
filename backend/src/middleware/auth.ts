import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { sendError } from '../utils/response.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'ADMIN' | 'TRUSTEE' | 'STAFF' | 'MEMBER';
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return sendError(res, 'Access token missing or invalid', 401);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthRequest['user'];
    req.user = decoded;
    next();
  } catch (err) {
    return sendError(res, 'Invalid or expired authentication token', 403);
  }
};

export const requireRole = (allowedRoles: Array<'ADMIN' | 'TRUSTEE' | 'STAFF' | 'MEMBER'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Unauthorized authentication required', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, `Forbidden: requires one of [${allowedRoles.join(', ')}] role`, 403);
    }

    next();
  };
};

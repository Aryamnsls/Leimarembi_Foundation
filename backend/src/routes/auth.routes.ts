import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma.js";
import { env } from "../config/env.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimit.js";
import { logAudit } from "../middleware/audit.js";

const router = Router();

// Register new member / user
router.post("/register", authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, address, bloodGroup, isSeniorCitizen, familyMembersCount } = req.body;

    if (!email || !password || !name) {
      return sendError(res, "Email, password, and name are required", 400);
    }
    if (typeof password !== "string" || password.length < 8) {
      return sendError(res, "Password must be at least 8 characters long", 400);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return sendError(res, "Please provide a valid email address", 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (existingUser) {
      return sendError(res, "An account with this email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const count = await prisma.user.count();
    const membershipNo = `LF-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        name: name.trim(),
        phone,
        address,
        bloodGroup,
        isSeniorCitizen: Boolean(isSeniorCitizen),
        familyMembersCount: Number(familyMembersCount) || 1,
        membershipNo,
        role: "MEMBER",
        status: "ACTIVE",
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    await logAudit({
      actorId: user.id,
      action: "USER_REGISTERED",
      resource: "User",
      resourceId: user.id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      success: true,
    });

    const { password: _, ...userWithoutPassword } = user;
    return sendSuccess(res, "Registration successful! Welcome to Leimarembi Foundation.", { user: userWithoutPassword, token }, 201);
  } catch (error: any) {
    return sendError(res, "Registration failed. Please try again.", 500);
  }
});

// Login
router.post("/login", authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, "Email and password are required", 400);
    }

    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });

    // Constant-time response to prevent user enumeration
    if (!user) {
      await bcrypt.hash("dummy_constant_time_hash", 12);
      await logAudit({ actorId: null, action: "LOGIN_FAILED_UNKNOWN_EMAIL", resource: "User", resourceId: null, ip: req.ip, userAgent: req.headers["user-agent"], success: false, metadata: JSON.stringify({ email }) });
      return sendError(res, "Invalid email or password", 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      await logAudit({ actorId: user.id, action: "LOGIN_FAILED_WRONG_PASSWORD", resource: "User", resourceId: user.id, ip: req.ip, userAgent: req.headers["user-agent"], success: false });
      return sendError(res, "Invalid email or password", 401);
    }

    // CRITICAL: Check account status before issuing token
    if (user.status !== "ACTIVE") {
      await logAudit({ actorId: user.id, action: "LOGIN_FAILED_INACTIVE_ACCOUNT", resource: "User", resourceId: user.id, ip: req.ip, userAgent: req.headers["user-agent"], success: false, metadata: JSON.stringify({ status: user.status }) });
      const statusMessages: Record<string, string> = {
        INACTIVE: "This account has been deactivated. Please contact the Foundation.",
        SUSPENDED: "This account has been suspended. Please contact the Foundation administrator.",
        PENDING: "This account is pending approval. Please wait for confirmation.",
      };
      return sendError(res, statusMessages[user.status] || "Account access is restricted.", 403);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    await logAudit({ actorId: user.id, action: "LOGIN_SUCCESS", resource: "User", resourceId: user.id, ip: req.ip, userAgent: req.headers["user-agent"], success: true });

    const { password: _, ...userWithoutPassword } = user;
    return sendSuccess(res, "Login successful", { user: userWithoutPassword, token });
  } catch (error: any) {
    return sendError(res, "Login failed. Please try again.", 500);
  }
});

// Current user profile
router.get("/me", authenticateToken, async (req: AuthRequest, res: Response) => {
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
      return sendError(res, "User profile not found", 404);
    }

    if (user.status !== "ACTIVE") {
      return sendError(res, "Account access is restricted.", 403);
    }

    return sendSuccess(res, "User profile retrieved", user);
  } catch (error: any) {
    return sendError(res, "Failed to fetch user profile", 500);
  }
});

export default router;

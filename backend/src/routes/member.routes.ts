import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.js';
import { logAudit } from '../middleware/audit.js';

const router = Router();

// ─── Get All Members (staff/admin/trustee/core_member/super_admin only) ───────
router.get('/', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN', 'TRUSTEE', 'CORE_MEMBER', 'STAFF']), async (req: Request, res: Response) => {
  try {
    const { status, search, page, limit } = req.query;

    const pageNum = Math.max(1, parseInt(String(page || '1'), 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit || '20'), 10)));
    const skip = (pageNum - 1) * limitNum;

    const where: any = { deletedAt: null };
    if (status) where.status = String(status);
    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { email: { contains: String(search) } },
        { membershipNo: { contains: String(search) } },
        { phone: { contains: String(search) } },
      ];
    }

    const [members, total] = await Promise.all([
      prisma.user.findMany({
        where,
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
          designation: true,
          profilePhoto: true,
          bio: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.user.count({ where }),
    ]);

    return sendSuccess(res, 'Members list retrieved successfully', {
      members,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch members', 500);
  }
});

// ─── Create New Member (SUPER_ADMIN / ADMIN only) ────────────────────────────
router.post('/', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name, phone, address, bloodGroup, isSeniorCitizen, familyMembersCount, designation, profilePhoto, bio, role, status } = req.body;

    if (!email || !name) {
      return sendError(res, 'Email and name are required', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return sendError(res, 'Please provide a valid email address', 400);
    }

    const existing = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (existing) {
      return sendError(res, 'A user with this email already exists', 409);
    }

    const initialPassword = password || process.env.DEFAULT_MEMBER_PASSWORD || `Lf#${crypto.randomBytes(4).toString('hex')}!`;
    const hashedPassword = await bcrypt.hash(initialPassword, 12);
    const count = await prisma.user.count();
    const membershipNo = `LF-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    // Security: Only SUPER_ADMIN can assign privileged roles
    const requestedRole = (req.user?.role === 'SUPER_ADMIN' && role) ? role : (role === 'SUPER_ADMIN' ? 'MEMBER' : role || 'MEMBER');

    const newMember = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        name: name.trim(),
        phone: phone || null,
        address: address || null,
        bloodGroup: bloodGroup || null,
        isSeniorCitizen: Boolean(isSeniorCitizen),
        familyMembersCount: Number(familyMembersCount) || 1,
        designation: designation || null,
        profilePhoto: profilePhoto || null,
        bio: bio || null,
        membershipNo,
        role: requestedRole,
        status: status || 'ACTIVE',
      },
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
        designation: true,
        profilePhoto: true,
        bio: true,
        createdAt: true,
      },
    });

    await logAudit({
      actorId: req.user?.id || null,
      action: 'MEMBER_CREATED_BY_ADMIN',
      resource: 'User',
      resourceId: newMember.id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      success: true,
      metadata: JSON.stringify({ membershipNo, role: requestedRole }),
    });

    return sendSuccess(res, 'Member created successfully', newMember, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create member', 500);
  }
});

// ─── Digital Membership Card — WITH OWNERSHIP CHECK (P0.6 IDOR Fix) ──────────
router.get('/:id/card', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const requestedId = String(req.params.id);
    const requestingUserId = req.user?.id;
    const requestingRole = req.user?.role;

    // Privileged roles can view any card; regular members can only view their own
    const privilegedRoles = ['SUPER_ADMIN', 'ADMIN', 'TRUSTEE', 'CORE_MEMBER', 'STAFF'];
    const isPrivileged = privilegedRoles.includes(requestingRole || '');

    if (!isPrivileged && requestedId !== requestingUserId) {
      await logAudit({
        actorId: requestingUserId || null,
        action: 'IDOR_ATTEMPT_MEMBER_CARD',
        resource: 'User',
        resourceId: requestedId,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        success: false,
        metadata: JSON.stringify({ requestingRole }),
      });
      return sendError(res, 'Access denied. You can only view your own membership card.', 403);
    }

    const member = await prisma.user.findUnique({
      where: { id: requestedId, deletedAt: null },
      select: {
        id: true,
        name: true,
        membershipNo: true,
        email: true,
        phone: true,
        bloodGroup: true,
        isSeniorCitizen: true,
        status: true,
        designation: true,
        profilePhoto: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!member) {
      return sendError(res, 'Member record not found', 404);
    }

    if (member.status !== 'ACTIVE') {
      return sendError(res, 'Membership card is not available for inactive accounts', 403);
    }

    const verificationBaseUrl = process.env.FRONTEND_URL || process.env.APP_URL || 'https://leimarembifoundation.org';
    const cardPayload = {
      ...member,
      cardType: member.isSeniorCitizen ? 'Senior Citizen Privilege Membership' : 'Standard Life Membership',
      issuedBy: 'Leimarembi Foundation Digital Governance Portal',
      validity: 'Permanent / Lifetime',
      qrCodeData: JSON.stringify({
        membershipNo: member.membershipNo,
        name: member.name,
        verificationUrl: `${verificationBaseUrl.replace(/\/$/, '')}/verify/${member.membershipNo}`,
      }),
    };

    return sendSuccess(res, 'Digital membership card generated', cardPayload);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to generate membership card', 500);
  }
});

// ─── Update Member Details (ADMIN/SUPER_ADMIN only) ───────────────────────────
router.patch('/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, address, bloodGroup, isSeniorCitizen, familyMembersCount, designation, profilePhoto, bio } = req.body;

    const existing = await prisma.user.findUnique({ where: { id: String(id), deletedAt: null } });
    if (!existing) {
      return sendError(res, 'Member not found', 404);
    }

    const updated = await prisma.user.update({
      where: { id: String(id) },
      data: {
        name: name !== undefined ? String(name).trim() : undefined,
        phone: phone !== undefined ? String(phone).trim() : undefined,
        address: address !== undefined ? String(address).trim() : undefined,
        bloodGroup: bloodGroup !== undefined ? String(bloodGroup).trim() : undefined,
        isSeniorCitizen: isSeniorCitizen !== undefined ? Boolean(isSeniorCitizen) : undefined,
        familyMembersCount: familyMembersCount !== undefined ? Number(familyMembersCount) : undefined,
        designation: designation !== undefined ? String(designation).trim() : undefined,
        profilePhoto: profilePhoto !== undefined ? String(profilePhoto).trim() || null : undefined,
        bio: bio !== undefined ? String(bio).trim() || null : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        bloodGroup: true,
        isSeniorCitizen: true,
        familyMembersCount: true,
        designation: true,
        profilePhoto: true,
        bio: true,
        role: true,
        status: true,
        membershipNo: true,
      },
    });

    await logAudit({
      actorId: req.user?.id || null,
      action: 'MEMBER_UPDATED_BY_ADMIN',
      resource: 'User',
      resourceId: String(id),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      success: true,
      metadata: JSON.stringify({ updatedFields: Object.keys(req.body) }),
    });

    return sendSuccess(res, 'Member updated successfully', updated);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update member', 500);
  }
});

// ─── Update Member Status (ADMIN/SUPER_ADMIN only) ────────────────────────────
router.patch('/:id/status', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'];
    if (!validStatuses.includes(status)) {
      return sendError(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const existing = await prisma.user.findUnique({ where: { id: String(id) } });
    if (!existing) {
      return sendError(res, 'Member not found', 404);
    }

    const updated = await prisma.user.update({
      where: { id: String(id) },
      data: { status },
      select: { id: true, name: true, email: true, role: true, status: true, membershipNo: true },
    });

    await logAudit({
      actorId: req.user?.id || null,
      action: 'USER_STATUS_CHANGED',
      resource: 'User',
      resourceId: String(id),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      success: true,
      metadata: JSON.stringify({ newStatus: status }),
    });

    return sendSuccess(res, `Member status updated to ${status}`, updated);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update member status', 500);
  }
});

// ─── Update Member Role (SUPER_ADMIN only) ────────────────────────────────────
router.patch('/:id/role', authenticateToken, requireRole(['SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['SUPER_ADMIN', 'ADMIN', 'CORE_MEMBER', 'TRUSTEE', 'STAFF', 'VOLUNTEER', 'MEMBER', 'REGISTERED_USER'];
    if (!validRoles.includes(role)) {
      return sendError(res, `Invalid role. Must be one of: ${validRoles.join(', ')}`, 400);
    }

    const updated = await prisma.user.update({
      where: { id: String(id) },
      data: { role },
      select: { id: true, name: true, email: true, role: true, status: true, membershipNo: true },
    });

    await logAudit({
      actorId: req.user?.id || null,
      action: 'USER_ROLE_CHANGED',
      resource: 'User',
      resourceId: String(id),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      success: true,
      metadata: JSON.stringify({ newRole: role }),
    });

    return sendSuccess(res, `Member role updated to ${role}`, updated);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update member role', 500);
  }
});

export default router;

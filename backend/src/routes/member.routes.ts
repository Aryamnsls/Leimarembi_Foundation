import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Get all members (staff/admin/trustee)
router.get('/', authenticateToken, requireRole(['ADMIN', 'TRUSTEE', 'STAFF']), async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;

    const where: any = {};
    if (status) where.status = String(status);
    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { email: { contains: String(search) } },
        { membershipNo: { contains: String(search) } },
      ];
    }

    const members = await prisma.user.findMany({
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
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return sendSuccess(res, 'Members list retrieved successfully', members);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch members', 500);
  }
});

// Digital membership card details
router.get('/:id/card', authenticateToken, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const member = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        membershipNo: true,
        email: true,
        phone: true,
        bloodGroup: true,
        isSeniorCitizen: true,
        status: true,
        createdAt: true,
      },
    });

    if (!member) {
      return sendError(res, 'Member record not found', 404);
    }

    const cardPayload = {
      ...member,
      cardType: member.isSeniorCitizen ? 'Senior Citizen Privilege Membership' : 'Standard Life Membership',
      issuedBy: 'Leimarembi Foundation Digital Governance Portal',
      validity: 'Permanent / Lifetime',
      qrCodeData: JSON.stringify({
        membershipNo: member.membershipNo,
        name: member.name,
        verificationUrl: `https://leimarembifoundation.org/verify/${member.membershipNo}`,
      }),
    };

    return sendSuccess(res, 'Digital membership card generated', cardPayload);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to generate membership card', 500);
  }
});

export default router;

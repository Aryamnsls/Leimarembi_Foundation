import { prisma } from '../utils/prisma.js';

interface AuditLogInput {
  actorId: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  ip?: string;
  userAgent?: string;
  success?: boolean;
  metadata?: string; // JSON string
}

/**
 * Write an audit log entry to the database.
 * This function is intentionally silent on failure — audit log errors
 * must not break the primary request flow.
 */
export async function logAudit(input: AuditLogInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        resource: input.resource,
        resourceId: input.resourceId,
        ipAddress: input.ip || null,
        userAgent: input.userAgent || null,
        success: input.success !== undefined ? input.success : true,
        metadata: input.metadata || null,
      },
    });
  } catch (err) {
    // Swallow silently — audit log failure must not crash the API
    console.error('[AUDIT] Failed to write audit log entry:', input.action, err);
  }
}

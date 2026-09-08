import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import path from 'path';

export interface StorageUploadResult {
  fileKey: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  checksum: string;
}

export class R2StorageService {
  private client: S3Client | null = null;
  private bucketName: string;
  private isConfigured: boolean = false;

  constructor() {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    this.bucketName = process.env.R2_BUCKET_NAME || 'lfa-production-documents';

    if (accountId && accessKeyId && secretAccessKey) {
      const endpoint = process.env.R2_ENDPOINT || `https://${accountId}.r2.cloudflarestorage.com`;
      this.client = new S3Client({
        region: 'auto',
        endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.isConfigured = true;
    }
  }

  public getStatus(): { isConfigured: boolean; bucket: string } {
    return {
      isConfigured: this.isConfigured,
      bucket: this.bucketName,
    };
  }

  /**
   * Generates a pre-signed download URL with short TTL (e.g. 5 minutes)
   */
  public async getPresignedDownloadUrl(fileKey: string, expiresInSeconds: number = 300): Promise<string> {
    if (!this.client || !this.isConfigured) {
      throw new Error('R2 storage is not configured with credentials in the environment.');
    }

    // Guard against path traversal in keys
    const sanitizedKey = path.normalize(fileKey).replace(/^(\.\.[\/\\])+/, '');

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: sanitizedKey,
    });

    return await getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
  }

  /**
   * Generates a pre-signed upload URL for direct client upload
   */
  public async getPresignedUploadUrl(
    filename: string,
    mimeType: string,
    expiresInSeconds: number = 300
  ): Promise<{ uploadUrl: string; fileKey: string }> {
    if (!this.client || !this.isConfigured) {
      throw new Error('R2 storage is not configured with credentials in the environment.');
    }

    const ext = path.extname(filename).toLowerCase();
    const randomHex = crypto.randomBytes(16).toString('hex');
    const fileKey = `documents/${Date.now()}-${randomHex}${ext}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: mimeType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
    return { uploadUrl, fileKey };
  }

  /**
   * Deletes a document from the private R2 bucket
   */
  public async deleteFile(fileKey: string): Promise<void> {
    if (!this.client || !this.isConfigured) {
      throw new Error('R2 storage is not configured with credentials in the environment.');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    await this.client.send(command);
  }
}

export const r2StorageService = new R2StorageService();

import crypto from 'crypto';
import { PaymentProvider, CreateDonationInput, PaymentSessionOutput } from './PaymentProvider.js';

export class RazorpayProvider extends PaymentProvider {
  providerName = 'RAZORPAY';

  private getKeyId(): string {
    return process.env.RAZORPAY_KEY_ID || '';
  }

  private getKeySecret(): string {
    return process.env.RAZORPAY_KEY_SECRET || '';
  }

  private getWebhookSecret(): string {
    return process.env.RAZORPAY_WEBHOOK_SECRET || '';
  }

  async createCheckoutSession(
    input: CreateDonationInput,
    publicDonationId: string,
    receiptNo: string
  ): Promise<PaymentSessionOutput> {
    const keyId = this.getKeyId();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    return {
      publicDonationId,
      receiptNo,
      amount: input.amount,
      currency: 'INR',
      status: 'CREATED',
      expiresAt,
      upiId: process.env.DONATION_UPI_ID || 'leimarembi@upi',
      merchantName: 'Leimarembi Foundation',
      upiIntentUrl: `upi://pay?pa=${encodeURIComponent(process.env.DONATION_UPI_ID || 'leimarembi@upi')}&pn=${encodeURIComponent('Leimarembi Foundation')}&am=${input.amount.toFixed(2)}&cu=INR&tr=${publicDonationId}`,
      upiQrString: `upi://pay?pa=${encodeURIComponent(process.env.DONATION_UPI_ID || 'leimarembi@upi')}&pn=${encodeURIComponent('Leimarembi Foundation')}&am=${input.amount.toFixed(2)}&cu=INR&tr=${publicDonationId}`,
    };
  }

  async verifyPaymentStatus(publicDonationId: string): Promise<{ status: string; paidAt?: Date; transactionId?: string }> {
    return { status: 'PENDING' };
  }

  verifyWebhookSignature(body: string, signature: string): boolean {
    const webhookSecret = this.getWebhookSecret();
    if (!webhookSecret) return false;

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  }
}

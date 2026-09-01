import { PaymentProvider, CreateDonationInput, PaymentSessionOutput } from './PaymentProvider.js';

export class ManualUpiProvider extends PaymentProvider {
  providerName = 'MANUAL_UPI';

  private getUpiId(): string {
    return process.env.DONATION_UPI_ID || 'leimarembi@upi';
  }

  private getMerchantName(): string {
    return process.env.DONATION_MERCHANT_NAME || 'Leimarembi Foundation';
  }

  async createCheckoutSession(
    input: CreateDonationInput,
    publicDonationId: string,
    receiptNo: string
  ): Promise<PaymentSessionOutput> {
    const upiId = this.getUpiId();
    const merchantName = this.getMerchantName();
    const formattedAmount = input.amount.toFixed(2);
    const note = encodeURIComponent(`Donation ${receiptNo}`);
    const encodedMerchantName = encodeURIComponent(merchantName);

    // NPCI compliant standard UPI payment link format
    const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodedMerchantName}&am=${formattedAmount}&cu=INR&tn=${note}&tr=${publicDonationId}`;

    // 5-minute session expiration
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    return {
      publicDonationId,
      receiptNo,
      amount: input.amount,
      currency: 'INR',
      status: 'CREATED',
      expiresAt,
      upiId,
      merchantName,
      upiIntentUrl: upiUri,
      upiQrString: upiUri,
      bankDetails: {
        accountName: 'Leimarembi Foundation Trust',
        bankName: 'State Bank of India (SBI)',
        accountNumber: '40987654321',
        ifscCode: 'SBIN0001234',
        branch: 'Imphal Main Branch, Manipur',
      },
    };
  }

  async verifyPaymentStatus(publicDonationId: string): Promise<{ status: string; paidAt?: Date; transactionId?: string }> {
    // For manual merchant UPI configuration without automated webhook, backend status remains authoritatively set.
    return {
      status: 'PENDING',
    };
  }
}

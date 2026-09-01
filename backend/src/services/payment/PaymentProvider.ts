export interface CreateDonationInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  amount: number;
  purpose?: string;
  paymentMethod: 'UPI_INTENT' | 'UPI_QR' | 'BANK_TRANSFER' | 'CARD';
}

export interface PaymentSessionOutput {
  publicDonationId: string;
  receiptNo: string;
  amount: number;
  currency: string;
  status: string;
  expiresAt: string;
  upiId?: string;
  merchantName?: string;
  upiIntentUrl?: string;
  upiQrString?: string;
  bankDetails?: {
    accountName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  };
}

export abstract class PaymentProvider {
  abstract providerName: string;
  abstract createCheckoutSession(input: CreateDonationInput, donationId: string, receiptNo: string): Promise<PaymentSessionOutput>;
  abstract verifyPaymentStatus(publicDonationId: string): Promise<{ status: string; paidAt?: Date; transactionId?: string }>;
}

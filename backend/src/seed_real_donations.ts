import { prisma } from './utils/prisma.js';

async function seedRealDonations() {
  const realDonations = [
    {
      publicDonationId: 'DON-20260826-001',
      receiptNo: 'LFR-001',
      donorName: 'Mr. Dhrubajyoti Saikia',
      firstName: 'Dhrubajyoti',
      lastName: 'Saikia',
      email: 'dhrubajyoti.saikia@gmail.com',
      phone: '+91 98640 12345',
      amount: 1000,
      currency: 'INR',
      paymentMethod: 'UPI_QR',
      provider: 'MANUAL_UPI',
      purpose: 'Community Welfare & Cultural Development',
      status: 'SUCCESS',
      paidAt: new Date('2026-08-26T10:30:00.000Z'),
      metadata: JSON.stringify({ location: 'Mangoldai, Assam' }),
      notes: 'Location: Mangoldai, Assam | Receipt: 001'
    },
    {
      publicDonationId: 'DON-20260829-004',
      receiptNo: 'LFR-004',
      donorName: 'Mr. Amarjit Singha',
      firstName: 'Amarjit',
      lastName: 'Singha',
      email: 'amarjit.singha@gmail.com',
      phone: '+91 98640 23456',
      amount: 1000,
      currency: 'INR',
      paymentMethod: 'UPI_QR',
      provider: 'MANUAL_UPI',
      purpose: 'Community Welfare & Cultural Development',
      status: 'SUCCESS',
      paidAt: new Date('2026-08-29T11:15:00.000Z'),
      metadata: JSON.stringify({ location: 'Survey, Guwahati, Assam' }),
      notes: 'Location: Survey, Guwahati, Assam | Receipt: 004'
    },
    {
      publicDonationId: 'DON-20260830-005',
      receiptNo: 'LFR-005',
      donorName: 'S. Nilkumar Singha',
      firstName: 'S. Nilkumar',
      lastName: 'Singha',
      email: 'nilkumar.singha@gmail.com',
      phone: '+91 98640 34567',
      amount: 500,
      currency: 'INR',
      paymentMethod: 'UPI_QR',
      provider: 'MANUAL_UPI',
      purpose: 'Community Welfare & Cultural Development',
      status: 'SUCCESS',
      paidAt: new Date('2026-08-30T14:20:00.000Z'),
      metadata: JSON.stringify({ location: 'Chandpur, Cachar, Assam' }),
      notes: 'Location: Chandpur, Cachar, Assam | Receipt: 005'
    },
    {
      publicDonationId: 'DON-20260830-003',
      receiptNo: 'LFR-003',
      donorName: 'J. A. Choudhury',
      firstName: 'J. A.',
      lastName: 'Choudhury',
      email: 'ja.choudhury@gmail.com',
      phone: '+91 98640 45678',
      amount: 1000,
      currency: 'INR',
      paymentMethod: 'UPI_QR',
      provider: 'MANUAL_UPI',
      purpose: 'Community Welfare & Cultural Development',
      status: 'SUCCESS',
      paidAt: new Date('2026-08-30T16:45:00.000Z'),
      metadata: JSON.stringify({ location: 'Sribhumi, Assam' }),
      notes: 'Location: Sribhumi, Assam | Receipt: 003'
    },
    {
      publicDonationId: 'DON-20260905-006',
      receiptNo: 'LFR-006',
      donorName: 'Mr. Ajoy Barman',
      firstName: 'Ajoy',
      lastName: 'Barman',
      email: 'ajoy.barman@gmail.com',
      phone: '+91 98640 56789',
      amount: 500,
      currency: 'INR',
      paymentMethod: 'UPI_QR',
      provider: 'MANUAL_UPI',
      purpose: 'Community Welfare & Cultural Development',
      status: 'SUCCESS',
      paidAt: new Date('2026-09-05T09:00:00.000Z'),
      metadata: JSON.stringify({ location: 'Mangoldai' }),
      notes: 'Location: Mangoldai | Receipt: 006'
    }
  ];

  for (const d of realDonations) {
    await prisma.donation.upsert({
      where: { publicDonationId: d.publicDonationId },
      update: d,
      create: d
    });
  }

  console.log(`✅ Stored ${realDonations.length} real donations into the database.`);
  
  const all = await prisma.donation.findMany({
    select: { receiptNo: true, donorName: true, amount: true, paidAt: true, status: true, metadata: true }
  });
  console.table(all);
  process.exit(0);
}

seedRealDonations();

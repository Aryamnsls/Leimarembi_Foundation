import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Leimarembi Foundation Database Seeder...');

  // 1. Seed Users (Admin & Members)
  const adminPassword = await bcrypt.hash('Admin@123456', 10);
  const memberPassword = await bcrypt.hash('Member@123456', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@leimarembifoundation.org' },
    update: {},
    create: {
      email: 'admin@leimarembifoundation.org',
      password: adminPassword,
      name: 'Dr. Th. Ningthemba Singh',
      role: 'ADMIN',
      membershipNo: 'LF-2026-0001',
      phone: '+91 9876543210',
      address: 'Imphal West, Manipur',
      bloodGroup: 'O+',
      isSeniorCitizen: true,
      familyMembersCount: 4,
    },
  });

  await prisma.user.upsert({
    where: { email: 'member@leimarembifoundation.org' },
    update: {},
    create: {
      email: 'member@leimarembifoundation.org',
      password: memberPassword,
      name: 'L. Bembem Devi',
      role: 'MEMBER',
      membershipNo: 'LF-2026-0002',
      phone: '+91 9876543211',
      address: 'Kakching, Manipur',
      bloodGroup: 'B+',
      isSeniorCitizen: false,
      familyMembersCount: 3,
    },
  });

  console.log('✅ Users seeded');

  // 2. Seed Donations
  await prisma.donation.createMany({
    data: [
      {
        publicDonationId: 'DON-20260826-001',
        donorName: 'Mr. Dhrubajyoti Saikia',
        firstName: 'Dhrubajyoti',
        lastName: 'Saikia',
        email: 'dhrubajyoti.saikia@foundation-donor.org',
        phone: '9864000001',
        amount: 1000,
        currency: 'INR',
        paymentMethod: 'UPI_QR',
        provider: 'MANUAL_UPI',
        receiptNo: '001',
        purpose: 'Community Welfare & Rural Development (Mangoldai, Assam)',
        status: 'SUCCESS',
        paidAt: new Date('2026-08-26'),
      },
      {
        publicDonationId: 'DON-20260829-004',
        donorName: 'Mr. Amarjit Singha',
        firstName: 'Amarjit',
        lastName: 'Singha',
        email: 'amarjit.singha@foundation-donor.org',
        phone: '9864000004',
        amount: 1000,
        currency: 'INR',
        paymentMethod: 'UPI_QR',
        provider: 'MANUAL_UPI',
        receiptNo: '004',
        purpose: 'General Charitable Corpus (Survey, Guwahati, Assam)',
        status: 'SUCCESS',
        paidAt: new Date('2026-08-29'),
      },
      {
        publicDonationId: 'DON-20260830-005',
        donorName: 'S. Nilkumar Singha',
        firstName: 'Nilkumar',
        lastName: 'Singha',
        email: 'nilkumar.singha@foundation-donor.org',
        phone: '9864000005',
        amount: 500,
        currency: 'INR',
        paymentMethod: 'UPI_QR',
        provider: 'MANUAL_UPI',
        receiptNo: '005',
        purpose: 'Rural Health & Senior Citizen Support (Chandpur, Cachar)',
        status: 'SUCCESS',
        paidAt: new Date('2026-08-30'),
      },
      {
        publicDonationId: 'DON-20260830-003',
        donorName: 'J. A. Choudhury',
        firstName: 'J. A.',
        lastName: 'Choudhury',
        email: 'ja.choudhury@foundation-donor.org',
        phone: '9864000003',
        amount: 1000,
        currency: 'INR',
        paymentMethod: 'BANK_TRANSFER',
        provider: 'BANK_TRANSFER',
        receiptNo: '003',
        purpose: 'Education & Cultural Heritage (Sribhumi, Assam)',
        status: 'SUCCESS',
        paidAt: new Date('2026-08-30'),
      },
      {
        publicDonationId: 'DON-20260905-006',
        donorName: 'Mr. Ajoy Barman',
        firstName: 'Ajoy',
        lastName: 'Barman',
        email: 'ajoy.barman@foundation-donor.org',
        phone: '9864000006',
        amount: 500,
        currency: 'INR',
        paymentMethod: 'UPI_QR',
        provider: 'MANUAL_UPI',
        receiptNo: '006',
        purpose: 'General Community Development (Mangoldai)',
        status: 'SUCCESS',
        paidAt: new Date('2026-09-05'),
      },
      {
        publicDonationId: 'DON-20260908-008',
        donorName: 'Yendrembam Raju Singha.',
        firstName: 'Yendrembam Raju',
        lastName: 'Singha',
        email: 'raju.singha@foundation-donor.org',
        phone: '9864000008',
        amount: 301,
        currency: 'INR',
        paymentMethod: 'UPI_QR',
        provider: 'MANUAL_UPI',
        receiptNo: '008',
        purpose: 'Foundation Welfare Contribution (Haflong)',
        status: 'SUCCESS',
        paidAt: new Date('2026-09-08'),
      },
      {
        publicDonationId: 'DON-20260908-009',
        donorName: 'Loitangbam Biswajit Singha.',
        firstName: 'Loitangbam Biswajit',
        lastName: 'Singha',
        email: 'biswajit.singha@foundation-donor.org',
        phone: '9864000009',
        amount: 2000,
        currency: 'INR',
        paymentMethod: 'UPI_QR',
        provider: 'MANUAL_UPI',
        receiptNo: '009',
        purpose: 'Senior Citizen Medical Aid & Diagnostic Support (Cachar, Silchar)',
        status: 'SUCCESS',
        paidAt: new Date('2026-09-08'),
      },
      {
        publicDonationId: 'DON-20260908-010',
        donorName: 'Khaidem Surjya Kumar Singha.',
        firstName: 'Khaidem Surjya Kumar',
        lastName: 'Singha',
        email: 'surjya.singha@foundation-donor.org',
        phone: '9864000010',
        amount: 1000,
        currency: 'INR',
        paymentMethod: 'BANK_TRANSFER',
        provider: 'BANK_TRANSFER',
        receiptNo: '010',
        purpose: 'Education & Tribal Welfare (Kolasib, Mizoram)',
        status: 'SUCCESS',
        paidAt: new Date('2026-09-08'),
      },
      {
        publicDonationId: 'DON-20260908-011',
        donorName: 'Sahab Uddin Ahmed , Former MLA Jaleswar LAC.',
        firstName: 'Sahab Uddin',
        lastName: 'Ahmed',
        email: 'sahabuddin.ahmed@foundation-donor.org',
        phone: '9864000011',
        amount: 500,
        currency: 'INR',
        paymentMethod: 'BANK_TRANSFER',
        provider: 'BANK_TRANSFER',
        receiptNo: '011',
        purpose: 'Community Outreach & Welfare Program (Goalpara, Jaleswar)',
        status: 'SUCCESS',
        paidAt: new Date('2026-09-08'),
      },
      {
        publicDonationId: 'DON-20260909-012',
        donorName: 'Mutum Nilchandra Singha.',
        firstName: 'Mutum Nilchandra',
        lastName: 'Singha',
        email: 'nilchandra.singha@foundation-donor.org',
        phone: '9864000012',
        amount: 300,
        currency: 'INR',
        paymentMethod: 'UPI_QR',
        provider: 'MANUAL_UPI',
        receiptNo: '012',
        purpose: 'General Foundation Support (Hojai)',
        status: 'SUCCESS',
        paidAt: new Date('2026-09-09'),
      },
      {
        publicDonationId: 'DON-20260910-013',
        donorName: 'Laisram Pankaj Singha .',
        firstName: 'Laisram Pankaj',
        lastName: 'Singha',
        email: 'pankaj.singha@foundation-donor.org',
        phone: '9864000013',
        amount: 1000,
        currency: 'INR',
        paymentMethod: 'UPI_QR',
        provider: 'MANUAL_UPI',
        receiptNo: '013',
        purpose: 'Rural Development Fund (Cachar, Silchar)',
        status: 'SUCCESS',
        paidAt: new Date('2026-09-10'),
      },
      {
        publicDonationId: 'DON-20260910-014',
        donorName: 'K M Gopal Sana Raj Kumar.',
        firstName: 'K M Gopal Sana',
        lastName: 'Raj Kumar',
        email: 'gopalsana.rajkumar@foundation-donor.org',
        phone: '9864000014',
        amount: 7000,
        currency: 'INR',
        paymentMethod: 'BANK_TRANSFER',
        provider: 'BANK_TRANSFER',
        receiptNo: '014',
        purpose: 'Heritage Preservation & Main Corpus (Cachar, Silchar)',
        status: 'SUCCESS',
        paidAt: new Date('2026-09-10'),
      },
    ],
  });
  console.log('✅ Donations seeded');

  // 3. Seed Projects
  await prisma.project.createMany({
    data: [
      {
        title: 'Manipur Heritage Digital Preservation Initiative',
        category: 'Cultural Preservation',
        description: 'Digitizing centuries-old rare manuscripts (Puya), folk music, and traditional dance forms of Manipur.',
        status: 'ONGOING',
        budget: 500000,
        spent: 180000,
        startDate: new Date('2026-01-15'),
        location: 'Imphal Valley & Regional Archives',
        beneficiariesCount: 15000,
      },
      {
        title: 'Senior Citizen Free Health Check-up Drive',
        category: 'Health & Welfare',
        description: 'Providing free health screening, vision checks, and essential medicine to elderly community members.',
        status: 'ONGOING',
        budget: 250000,
        spent: 95000,
        startDate: new Date('2026-02-01'),
        location: 'Bishnupur & Thoubal Districts',
        beneficiariesCount: 2400,
      },
    ],
  });
  console.log('✅ Projects seeded');

  // 4. Seed Grants
  await prisma.grant.createMany({
    data: [
      {
        title: 'Tribal & Indigenous Heritage Digital Archive Grant',
        schemeName: 'Ministry of Culture NGO Partnership Scheme',
        department: 'Ministry of Culture, Govt of India',
        amountRequested: 1500000,
        amountSanctioned: 1200000,
        status: 'SANCTIONED',
        pfmsReference: 'PFMS-2026-MC-8849',
        utilizationCertificateStatus: 'SUBMITTED',
      },
    ],
  });
  console.log('✅ Grants seeded');

  // 5. Seed Documents
  await prisma.document.createMany({
    data: [
      {
        title: 'Leimarembi Foundation Registered Trust Deed',
        documentType: 'TRUST_DEED',
        category: 'GOVERNANCE',
        fileUrl: '/docs/trust_deed.pdf',
        fileSize: '2.4 MB',
        description: 'Official registered legal trust deed document of the Leimarembi Foundation.',
        isPublic: true,
      },
      {
        title: 'Foundation Constitution & Bye-Laws 2026',
        documentType: 'BYE_LAWS',
        category: 'GOVERNANCE',
        fileUrl: '/docs/bye_laws.pdf',
        fileSize: '1.8 MB',
        description: 'Comprehensive operational guidelines, member rights, and governance rules.',
        isPublic: true,
      },
    ],
  });
  console.log('✅ Documents seeded');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

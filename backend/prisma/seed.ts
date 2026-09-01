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
        publicDonationId: 'DON-20260901-SEED0001',
        donorName: 'Dr. Th. Ningthemba Singh',
        firstName: 'Th. Ningthemba',
        lastName: 'Singh',
        email: 'admin@leimarembifoundation.org',
        phone: '9876543210',
        amount: 25000,
        currency: 'INR',
        paymentMethod: 'UPI_QR',
        provider: 'MANUAL_UPI',
        receiptNo: 'LFR-2026-00001',
        purpose: 'Cultural Preservation Corpus Fund',
        status: 'SUCCESS',
        paidAt: new Date(),
        userId: admin.id,
      },
      {
        publicDonationId: 'DON-20260901-SEED0002',
        donorName: 'K. Tomba Meitei',
        firstName: 'Tomba',
        lastName: 'Meitei',
        email: 'tomba@example.com',
        phone: '9123456789',
        amount: 10000,
        currency: 'INR',
        paymentMethod: 'BANK_TRANSFER',
        provider: 'BANK_TRANSFER',
        receiptNo: 'LFR-2026-00002',
        purpose: 'Free Medical Camp Drive',
        status: 'SUCCESS',
        paidAt: new Date(),
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

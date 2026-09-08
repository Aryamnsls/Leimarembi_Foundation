import { prisma } from './utils/prisma.js';

async function removeFakeDonations() {
  const fakeIds = [
    'DON-20260901-SEED0001',
    'DON-20260901-SEED0002',
    'DON-20260901-SEED0003'
  ];

  const deleted = await prisma.donation.deleteMany({
    where: {
      publicDonationId: { in: fakeIds }
    }
  });

  console.log(`✅ Removed ${deleted.count} fake seed donations from database.`);
  
  const remaining = await prisma.donation.findMany();
  console.log(`Remaining donations in DB: ${remaining.length}`);
  process.exit(0);
}

removeFakeDonations();

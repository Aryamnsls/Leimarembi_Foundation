import { prisma } from './utils/prisma.js';
import bcrypt from 'bcryptjs';

async function seedMissingRoles() {
  const memberPassword = await bcrypt.hash('Member@123456', 12);

  // Trustee
  await prisma.user.upsert({
    where: { email: 'trustee@leimarembifoundation.org' },
    update: {},
    create: {
      email: 'trustee@leimarembifoundation.org',
      password: memberPassword,
      name: 'Trustee Board Member',
      role: 'TRUSTEE',
      membershipNo: 'LF-2026-TRUSTEE',
      phone: '+91 9876543213',
      address: 'Imphal East, Manipur',
      status: 'ACTIVE',
      designation: 'Governing Trustee',
    },
  });

  // Staff
  await prisma.user.upsert({
    where: { email: 'staff@leimarembifoundation.org' },
    update: {},
    create: {
      email: 'staff@leimarembifoundation.org',
      password: memberPassword,
      name: 'Operations Staff Member',
      role: 'STAFF',
      membershipNo: 'LF-2026-STAFF',
      phone: '+91 9876543214',
      address: 'Imphal West, Manipur',
      status: 'ACTIVE',
      designation: 'Operations Coordinator',
    },
  });

  // Core Member
  await prisma.user.upsert({
    where: { email: 'coremember@leimarembifoundation.org' },
    update: {},
    create: {
      email: 'coremember@leimarembifoundation.org',
      password: memberPassword,
      name: 'Senior Core Member',
      role: 'CORE_MEMBER',
      membershipNo: 'LF-2026-CORE',
      phone: '+91 9876543215',
      address: 'Thoubal, Manipur',
      status: 'ACTIVE',
      designation: 'Advisory Committee',
    },
  });

  // Volunteer
  await prisma.user.upsert({
    where: { email: 'volunteer@leimarembifoundation.org' },
    update: {},
    create: {
      email: 'volunteer@leimarembifoundation.org',
      password: memberPassword,
      name: 'Community Volunteer',
      role: 'VOLUNTEER',
      membershipNo: 'LF-2026-VOLUNTEER',
      phone: '+91 9876543216',
      address: 'Bishnupur, Manipur',
      status: 'ACTIVE',
      designation: 'Field Volunteer',
    },
  });

  console.log('✅ Upserted all missing development role fixtures.');
  const allUsers = await prisma.user.findMany({
    select: { email: true, role: true, membershipNo: true, status: true }
  });
  console.table(allUsers);
  process.exit(0);
}

seedMissingRoles();

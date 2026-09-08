import { prisma } from './utils/prisma.js';

async function listUsers() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, membershipNo: true }
  });
  console.log('CURRENT DB USERS:');
  console.table(users);
  process.exit(0);
}

listUsers();

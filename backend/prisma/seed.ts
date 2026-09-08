import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Leimarembi Foundation Database Seeder v2.0...');

  // ─── 1. Seed Users ──────────────────────────────────────────────────────────
  const superAdminPassword = await bcrypt.hash('SuperAdmin@2026!', 12);
  const adminPassword = await bcrypt.hash('Admin@123456', 12);
  const memberPassword = await bcrypt.hash('Member@123456', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'super@leimarembifoundation.org' },
    update: {},
    create: {
      email: 'super@leimarembifoundation.org',
      password: superAdminPassword,
      name: 'Foundation System Administrator',
      role: 'SUPER_ADMIN',
      membershipNo: 'LF-2026-0000',
      phone: '+91 9999000001',
      address: 'Imphal West, Manipur',
      bloodGroup: 'O+',
      isSeniorCitizen: false,
      familyMembersCount: 1,
      status: 'ACTIVE',
      designation: 'System Administrator',
    },
  });

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
      status: 'ACTIVE',
      designation: 'Founder & Chairman',
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
      status: 'ACTIVE',
    },
  });

  await prisma.user.upsert({
    where: { email: 'reguser@leimarembifoundation.org' },
    update: {},
    create: {
      email: 'reguser@leimarembifoundation.org',
      password: memberPassword,
      name: 'N. Sanatomba',
      role: 'REGISTERED_USER',
      membershipNo: 'LF-2026-0003',
      phone: '+91 9876543212',
      address: 'Imphal, Manipur',
      status: 'ACTIVE',
    },
  });

  await prisma.user.upsert({
    where: { email: 'trustee@leimarembifoundation.org' },
    update: {},
    create: {
      email: 'trustee@leimarembifoundation.org',
      password: memberPassword,
      name: 'Trustee Board Member',
      role: 'TRUSTEE',
      membershipNo: 'LF-2026-0008',
      phone: '+91 9876543213',
      address: 'Imphal East, Manipur',
      status: 'ACTIVE',
      designation: 'Governing Trustee',
    },
  });

  await prisma.user.upsert({
    where: { email: 'staff@leimarembifoundation.org' },
    update: {},
    create: {
      email: 'staff@leimarembifoundation.org',
      password: memberPassword,
      name: 'Operations Staff Member',
      role: 'STAFF',
      membershipNo: 'LF-2026-0009',
      phone: '+91 9876543214',
      address: 'Imphal West, Manipur',
      status: 'ACTIVE',
      designation: 'Operations Coordinator',
    },
  });

  await prisma.user.upsert({
    where: { email: 'coremember@leimarembifoundation.org' },
    update: {},
    create: {
      email: 'coremember@leimarembifoundation.org',
      password: memberPassword,
      name: 'Senior Core Member',
      role: 'CORE_MEMBER',
      membershipNo: 'LF-2026-0010',
      phone: '+91 9876543215',
      address: 'Thoubal, Manipur',
      status: 'ACTIVE',
      designation: 'Advisory Committee',
    },
  });

  await prisma.user.upsert({
    where: { email: 'volunteer@leimarembifoundation.org' },
    update: {},
    create: {
      email: 'volunteer@leimarembifoundation.org',
      password: memberPassword,
      name: 'Community Volunteer',
      role: 'VOLUNTEER',
      membershipNo: 'LF-2026-0011',
      phone: '+91 9876543216',
      address: 'Bishnupur, Manipur',
      status: 'ACTIVE',
      designation: 'Field Volunteer',
    },
  });

  console.log('✅ Users seeded (SUPER_ADMIN, ADMIN, TRUSTEE, STAFF, CORE_MEMBER, VOLUNTEER, MEMBER, REGISTERED_USER)');

  // ─── 2. Seed Donations ──────────────────────────────────────────────────────
  // (No mock/fake donations seeded — all donations must be generated via real user flow)
  console.log('✅ Donations seeding skipped (clean production state)');

  // ─── 3. Seed Projects ───────────────────────────────────────────────────────
  const projectSeeds = [
    { id: 'SEED_PROJ_001', title: 'Manipur Heritage Digital Preservation Initiative', category: 'Cultural Preservation', description: 'Digitizing centuries-old rare manuscripts (Puya), folk music, and traditional dance forms of Manipur.', status: 'ONGOING', budget: 500000, spent: 180000, startDate: new Date('2026-01-15'), location: 'Imphal Valley & Regional Archives', beneficiariesCount: 15000 },
    { id: 'SEED_PROJ_002', title: 'Senior Citizen Free Health Check-up Drive', category: 'Health & Welfare', description: 'Providing free health screening, vision checks, and essential medicine to elderly community members.', status: 'ONGOING', budget: 250000, spent: 95000, startDate: new Date('2026-02-01'), location: 'Bishnupur & Thoubal Districts', beneficiariesCount: 2400 },
  ];
  for (const p of projectSeeds) {
    await prisma.project.upsert({ where: { id: p.id }, update: {}, create: p });
  }
  console.log('✅ Projects seeded');

  // ─── 4. Seed Grants ─────────────────────────────────────────────────────────
  await prisma.grant.upsert({
    where: { id: 'SEED_GRANT_001' },
    update: {},
    create: { id: 'SEED_GRANT_001', title: 'Tribal & Indigenous Heritage Digital Archive Grant', schemeName: 'Ministry of Culture NGO Partnership Scheme', department: 'Ministry of Culture, Govt of India', amountRequested: 1500000, amountSanctioned: 1200000, status: 'SANCTIONED', pfmsReference: 'PFMS-2026-MC-8849', utilizationCertificateStatus: 'SUBMITTED' },
  });
  console.log('✅ Grants seeded');

  // ─── 5. Seed Documents ──────────────────────────────────────────────────────
  const docSeeds = [
    { id: 'SEED_DOC_001', title: 'Leimarembi Foundation Registered Trust Deed', documentType: 'TRUST_DEED', category: 'GOVERNANCE', fileUrl: '/docs/trust_deed.pdf', fileSize: '2.4 MB', description: 'Official registered legal trust deed document of the Leimarembi Foundation.', isPublic: true, accessLevel: 'PUBLIC' },
    { id: 'SEED_DOC_002', title: 'Foundation Constitution & Bye-Laws 2026', documentType: 'BYE_LAWS', category: 'GOVERNANCE', fileUrl: '/docs/bye_laws.pdf', fileSize: '1.8 MB', description: 'Comprehensive operational guidelines, member rights, and governance rules.', isPublic: true, accessLevel: 'PUBLIC' },
    { id: 'SEED_DOC_003', title: 'Annual Financial Statement FY 2025-26', documentType: 'ANNUAL_REPORT', category: 'FINANCE', fileUrl: '/docs/annual_report_2025_26.pdf', fileSize: '3.2 MB', description: 'Audited annual financial statements for the fiscal year 2025-26.', isPublic: false, accessLevel: 'MEMBER' },
  ];
  for (const doc of docSeeds) {
    await prisma.document.upsert({ where: { id: doc.id }, update: {}, create: doc });
  }
  console.log('✅ Documents seeded');

  // ─── 6. Seed News ───────────────────────────────────────────────────────────
  const newsSeeds = [
    { slug: 'digital-archive-initiative-2026', title: 'Leimarembi Foundation Launches Digital Archive Initiative', content: 'The Leimarembi Foundation has officially launched its digital preservation initiative, aimed at digitizing rare Meitei manuscripts (Puya) and traditional folk music. The project will serve over 15,000 community members across Manipur.', excerpt: 'Foundation launches major initiative to digitize Meitei cultural heritage for future generations.', category: 'ACHIEVEMENT', status: 'PUBLISHED', publishedAt: new Date('2026-01-20T09:00:00Z'), isPublic: true },
    { slug: 'health-camp-march-2026', title: 'Free Senior Citizen Health Camp — March 2026', content: 'Our upcoming free health camp for senior citizens will be held on March 15, 2026 at the Bishnupur Community Hall. Services include general check-up, eye examination, blood pressure monitoring, and free essential medicines.', excerpt: 'Free health screening camp for senior citizens at Bishnupur Community Hall on March 15, 2026.', category: 'HEALTH', status: 'PUBLISHED', publishedAt: new Date('2026-02-28T09:00:00Z'), isPublic: true },
  ];
  for (const n of newsSeeds) {
    await prisma.news.upsert({ where: { slug: n.slug }, update: {}, create: n });
  }
  console.log('✅ News seeded');

  // ─── 7. Seed Foundation Settings ────────────────────────────────────────────
  const settings = [
    { key: 'site.name', value: 'Leimarembi Foundation', description: 'Official name of the foundation' },
    { key: 'site.tagline', value: 'Digital Governance & Community Development Platform', description: 'Site tagline' },
    { key: 'contact.phone', value: '+91 98640-44123', description: 'Primary contact phone number' },
    { key: 'contact.email', value: 'leimarembifoundation@gmail.com', description: 'Primary contact email' },
    { key: 'contact.address', value: 'Manipur, Northeast India', description: 'Foundation address' },
    { key: 'social.facebook', value: '', description: 'Facebook page URL' },
    { key: 'social.instagram', value: '', description: 'Instagram profile URL' },
    { key: 'social.youtube', value: '', description: 'YouTube channel URL' },
    { key: 'upi.vpa', value: 'leimarembifoundation@okaxis', description: 'UPI VPA for donations' },
    { key: 'upi.displayName', value: 'LEIMAREMBI FOUNDATION', description: 'UPI payment display name' },
  ];

  for (const setting of settings) {
    await prisma.foundationSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log('✅ Foundation settings seeded');

  // ─── 8. Seed Gallery ────────────────────────────────────────────────────────
  const album = await prisma.galleryAlbum.upsert({
    where: { id: 'SEED_ALBUM_001' },
    update: {},
    create: {
      id: 'SEED_ALBUM_001',
      title: 'Foundation Activities 2026',
      description: 'Photos from our community programs and events.',
      isPublic: true,
      category: 'GENERAL',
    },
  });
  console.log('✅ Gallery seeded');

  // ─── 9. Seed Emergency Contacts ─────────────────────────────────────────────
  await prisma.emergencyContact.upsert({
    where: { id: 'SEED_EC_001' },
    update: {},
    create: {
      id: 'SEED_EC_001',
      name: 'Foundation Emergency Helpline',
      relation: 'Foundation Office',
      phone: '+91 98640-44123',
      isPrimary: true,
    },
  });
  console.log('✅ Emergency contacts seeded');

  // ─── 10. Seed Permissions & Role-Permission Matrix ──────────────────────────
  const permissionsList = [
    { name: 'members:read', description: 'View member directory', module: 'MEMBERS' },
    { name: 'members:update', description: 'Update member status/details', module: 'MEMBERS' },
    { name: 'roles:manage', description: 'Assign roles to users', module: 'MEMBERS' },
    { name: 'finance:read', description: 'View financial records & donations', module: 'FINANCE' },
    { name: 'finance:manage', description: 'Update donation status & reconcile', module: 'FINANCE' },
    { name: 'welfare:read', description: 'View welfare assistance claims', module: 'WELFARE' },
    { name: 'welfare:submit', description: 'Submit welfare request', module: 'WELFARE' },
    { name: 'welfare:approve', description: 'Review & approve welfare claims', module: 'WELFARE' },
    { name: 'documents:read', description: 'View digital library documents', module: 'DOCUMENTS' },
    { name: 'documents:download', description: 'Download sensitive documents', module: 'DOCUMENTS' },
    { name: 'documents:upload', description: 'Upload documents to digital library', module: 'DOCUMENTS' },
    { name: 'settings:read', description: 'Read system settings', module: 'SETTINGS' },
    { name: 'settings:manage', description: 'Manage foundation settings', module: 'SETTINGS' },
    { name: 'audit:read', description: 'Inspect audit trail logs', module: 'AUDIT' },
  ];

  for (const p of permissionsList) {
    const perm = await prisma.permission.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });

    // Map permissions to roles
    const roleMappings: Record<string, string[]> = {
      SUPER_ADMIN: [
        'members:read', 'members:update', 'roles:manage', 'finance:read', 'finance:manage',
        'welfare:read', 'welfare:submit', 'welfare:approve', 'documents:read', 'documents:download',
        'documents:upload', 'settings:read', 'settings:manage', 'audit:read'
      ],
      ADMIN: [
        'members:read', 'members:update', 'finance:read', 'finance:manage',
        'welfare:read', 'welfare:submit', 'welfare:approve', 'documents:read', 'documents:download',
        'documents:upload', 'settings:read', 'audit:read'
      ],
      TRUSTEE: ['members:read', 'finance:read', 'finance:manage', 'welfare:read', 'welfare:approve', 'documents:read', 'documents:download'],
      STAFF: ['members:read', 'welfare:read', 'documents:read', 'documents:upload', 'settings:read'],
      CORE_MEMBER: ['members:read', 'welfare:read', 'documents:read'],
      VOLUNTEER: ['welfare:read', 'documents:read'],
      MEMBER: ['welfare:submit', 'documents:read'],
      REGISTERED_USER: ['documents:read'],
    };

    for (const [role, perms] of Object.entries(roleMappings)) {
      if (perms.includes(p.name)) {
        await prisma.rolePermission.upsert({
          where: { role_permissionId: { role: role as any, permissionId: perm.id } },
          update: {},
          create: { role: role as any, permissionId: perm.id },
        });
      }
    }
  }
  console.log('✅ Permissions and Role-Permission matrix seeded');

  // ─── 11. Seed Audit Log ─────────────────────────────────────────────────────
  await prisma.auditLog.create({
    data: {
      actorId: superAdmin.id,
      action: 'SYSTEM_INITIALIZED',
      resource: 'System',
      resourceId: null,
      success: true,
      metadata: JSON.stringify({ version: '2.0.0', seedDate: new Date().toISOString() }),
    },
  });
  console.log('✅ Initial audit log written');

  console.log('\n🎉 Leimarembi Foundation database seeding v2.0 completed successfully!');
  console.log('─────────────────────────────────────────────────────────');
  console.log('📧 SUPER_ADMIN login: super@leimarembifoundation.org / SuperAdmin@2026!');
  console.log('📧 ADMIN login:       admin@leimarembifoundation.org  / Admin@123456');
  console.log('📧 MEMBER login:      member@leimarembifoundation.org / Member@123456');
  console.log('─────────────────────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

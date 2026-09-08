import { prisma } from './utils/prisma.js';
import bcrypt from 'bcryptjs';

async function seedExecutiveMembers() {
  const defaultPassword = await bcrypt.hash('Member@123456', 12);

  const executiveMembers = [
    {
      membershipNo: 'LF-EXEC-01',
      name: 'Dr. Phuritsabam Birmani',
      designation: 'President',
      email: 'ichemma@yahoo.com',
      phone: '98640-44123',
      address: 'Assam / Manipur',
      bloodGroup: 'O+',
      isSeniorCitizen: true,
      profilePhoto: '/members/Dr_phuritsabam.jpg',
      bio: 'Senior Journalist | President, Manipuri Sahitya Parishad, Assam. Provides leadership and guidance to Leimarembi Foundation.',
      role: 'ADMIN',
      status: 'ACTIVE'
    },
    {
      membershipNo: 'LF-EXEC-02',
      name: 'K. Ajit Singh',
      designation: 'Vice-Chairman',
      email: 'kajitsingh9@gmail.com',
      phone: '98648-01906',
      address: 'Guwahati, Assam',
      bloodGroup: 'A+',
      isSeniorCitizen: true,
      profilePhoto: '/members/ajit_singh.jpg',
      bio: 'Retired Government Employee actively involved in sports, particularly Kabaddi and youth development.',
      role: 'ADMIN',
      status: 'ACTIVE'
    },
    {
      membershipNo: 'LF-EXEC-03',
      name: 'Y. Thambal Singha',
      designation: 'Managing Director',
      email: 'thambal.singha@gmail.com',
      phone: '94350-87852',
      address: 'Kekranagar, Assam',
      bloodGroup: 'O+',
      isSeniorCitizen: true,
      profilePhoto: '/members/thambal_singha.jpg',
      bio: 'Retired Government Officer | President, GMSO | President, Sri Sri Radha Gobindo Mandir, Kekranagar.',
      role: 'ADMIN',
      status: 'ACTIVE'
    },
    {
      membershipNo: 'LF-EXEC-04',
      name: 'M. Bina Babu Singha',
      designation: 'Secretary',
      email: 'binababu.singha@yahoo.com',
      phone: '76370-87931',
      address: 'Kamrup District, Assam',
      bloodGroup: 'AB+',
      isSeniorCitizen: true,
      profilePhoto: '/members/bina_babu_singha.jpg',
      bio: 'Retired Government Officer | Advisor, UMAA, Kamrup District. Active in public administration and documentation.',
      role: 'ADMIN',
      status: 'ACTIVE'
    },
    {
      membershipNo: 'LF-EXEC-05',
      name: 'Ng. Baldev Singha',
      designation: 'Treasurer',
      email: '731baldevsingha@gmail.com',
      phone: '94351-94989',
      address: 'Kamrup, Assam',
      bloodGroup: 'B+',
      isSeniorCitizen: true,
      profilePhoto: '/members/NG_BALDEV_SINGHA.jpg',
      bio: 'Retired Government Officer | Working President, UMAA (Central) | Vice-President, GMSO.',
      role: 'TRUSTEE',
      status: 'ACTIVE'
    },
    {
      membershipNo: 'LF-EXEC-06',
      name: 'K. Braja Babu Singha',
      designation: 'Executive Member',
      email: 'brajababu.singha@gmail.com',
      phone: '70862-42310',
      address: 'Assam',
      bloodGroup: 'B+',
      isSeniorCitizen: true,
      profilePhoto: null,
      bio: 'Retired Army Personnel | Executive Member, UMAA (Central) | Executive Member, GMSO.',
      role: 'CORE_MEMBER',
      status: 'ACTIVE'
    },
    {
      membershipNo: 'LF-EXEC-07',
      name: 'L. Madan Chand Singha',
      designation: 'Executive Member',
      email: 'hanumantravels123@gmail.com',
      phone: '70027-49229',
      address: 'Kamrup District, Assam',
      bloodGroup: 'A+',
      isSeniorCitizen: false,
      profilePhoto: '/members/L_Madan_chand.jpg',
      bio: 'Business Owner / Proprietor | Treasurer, UMAA Kamrup District | General Secretary, GMSO.',
      role: 'CORE_MEMBER',
      status: 'ACTIVE'
    },
    {
      membershipNo: 'LF-EXEC-08',
      name: 'H. Monoj Kumar Singha',
      designation: 'Executive Member',
      email: 'satabditravel183@gmail.com',
      phone: '86384-51576',
      address: 'Kamrup District, Assam',
      bloodGroup: 'O+',
      isSeniorCitizen: false,
      profilePhoto: '/members/H_monoj.jpg',
      bio: 'Business Owner / Proprietor | Assistant Secretary, UMAA Kamrup District | Publication Secretary, GMSO.',
      role: 'CORE_MEMBER',
      status: 'ACTIVE'
    },
    {
      membershipNo: 'LF-EXEC-09',
      name: 'Y. Abhishek Singh',
      designation: 'Executive Member',
      email: 'y.abhisheksingh@gmail.com',
      phone: '89749-02685',
      address: 'Guwahati, Assam',
      bloodGroup: 'B+',
      isSeniorCitizen: false,
      profilePhoto: '/members/abhishek_Singh.jpg',
      bio: 'Private Sector Employee engaged in community service and social development.',
      role: 'CORE_MEMBER',
      status: 'ACTIVE'
    },
    {
      membershipNo: 'LF-EXEC-10',
      name: 'Moni Mohan Singha',
      designation: 'Executive Member',
      email: 'monimohan.singha@gmail.com',
      phone: '94361-18112',
      address: 'Salbari, Assam',
      bloodGroup: 'B+',
      isSeniorCitizen: true,
      profilePhoto: '/members/Moni_Mohan_singha.jpg',
      bio: 'Retired Army Personnel | Vice-President, UMAA, Kamrup District | Assistant Secretary, GMSO | President, Salbari Village Committee.',
      role: 'CORE_MEMBER',
      status: 'ACTIVE'
    },
    {
      membershipNo: 'LF-EXEC-11',
      name: 'Sarakkhaibam Amarjit Singha',
      designation: 'Executive Member',
      email: 'panthoibielectronics@gmail.com',
      phone: '98640-80354',
      address: 'Kamrup District, Assam',
      bloodGroup: 'O+',
      isSeniorCitizen: false,
      profilePhoto: '/members/sarakkhaibam.jpg',
      bio: 'Business Owner / Proprietor | Executive Member, UMAA, Kamrup District. Promotion of cultural activities.',
      role: 'CORE_MEMBER',
      status: 'ACTIVE'
    },
    {
      membershipNo: 'LF-EXEC-12',
      name: 'Ngangbam Binoy Singha',
      designation: 'Executive Member',
      email: 'ngbinoy@gmail.com',
      phone: '70020-66014',
      address: 'Assam',
      bloodGroup: 'B+',
      isSeniorCitizen: false,
      profilePhoto: '/members/nagangbam.jpg',
      bio: 'Business Owner / Proprietor actively engaged in community affairs and social development.',
      role: 'CORE_MEMBER',
      status: 'ACTIVE'
    }
  ];

  for (const m of executiveMembers) {
    await prisma.user.upsert({
      where: { email: m.email },
      update: {
        name: m.name,
        designation: m.designation,
        phone: m.phone,
        address: m.address,
        bloodGroup: m.bloodGroup,
        isSeniorCitizen: m.isSeniorCitizen,
        profilePhoto: m.profilePhoto,
        bio: m.bio,
        role: m.role as any,
        status: m.status as any,
      },
      create: {
        email: m.email,
        password: defaultPassword,
        name: m.name,
        membershipNo: m.membershipNo,
        designation: m.designation,
        phone: m.phone,
        address: m.address,
        bloodGroup: m.bloodGroup,
        isSeniorCitizen: m.isSeniorCitizen,
        profilePhoto: m.profilePhoto,
        bio: m.bio,
        role: m.role as any,
        status: m.status as any,
      }
    });
  }

  console.log(`✅ Upserted all 12 Executive Committee & Leadership members into the database.`);
  
  const allUsers = await prisma.user.findMany({
    select: { membershipNo: true, name: true, designation: true, bloodGroup: true, isSeniorCitizen: true, profilePhoto: true }
  });
  console.table(allUsers);
  process.exit(0);
}

seedExecutiveMembers();

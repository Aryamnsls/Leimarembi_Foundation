// Executive Officers Registry for Leimarembi Foundation
// 5 Official Executive Officers authorized for Admin Access (Read & Write)
// to Documents, Meetings, Gallery, and the Management Portal.
// Passwords are authenticated via Date of Birth (DOB) or official passcode.
// Note: Aryaman Singha has full backend Super Admin / Admin access,
// but is strictly hidden from visible public/officer lists for the Inauguration.

export interface ExecutiveOfficer {
  slNo: string;
  id: string;
  name: string;
  role: string;
  designation: string;
  email: string;
  phone: string;
  cleanPhone: string;
  bloodGroup: string;
  ageCategory: 'Senior Citizen' | 'Non-Senior Citizen';
  passcode: string;
  isSeniorCitizen: boolean;
  photo: string;
}

// Exactly 5 Visible Executive Officers
export const EXECUTIVE_OFFICERS: ExecutiveOfficer[] = [
  {
    slNo: "01",
    id: "LF-EXEC-001",
    name: "Dr. Phuritsabam Birmani",
    role: "President",
    designation: "President & Legal Trustee",
    email: "ichemma@yahoo.com",
    phone: "98640-44123",
    cleanPhone: "9864044123",
    bloodGroup: "O+VE",
    ageCategory: "Senior Citizen",
    passcode: "98640",
    isSeniorCitizen: true,
    photo: "/members/Dr_phuritsabam.jpg"
  },
  {
    slNo: "02",
    id: "LF-EXEC-002",
    name: "K. Ajit Singh",
    role: "Vice-Chairman",
    designation: "Vice-Chairman & Executive Officer",
    email: "kajitsingh9@gmail.com",
    phone: "98648-01906",
    cleanPhone: "9864801906",
    bloodGroup: "A+VE",
    ageCategory: "Senior Citizen",
    passcode: "98648",
    isSeniorCitizen: true,
    photo: "/members/ajit_singh.jpg"
  },
  {
    slNo: "03",
    id: "LF-EXEC-003",
    name: "Y. Thambal Singha",
    role: "Managing Director",
    designation: "Managing Director",
    email: "thambal.singha@gmail.com",
    phone: "94350-87852",
    cleanPhone: "9435087852",
    bloodGroup: "O+VE",
    ageCategory: "Senior Citizen",
    passcode: "94350",
    isSeniorCitizen: true,
    photo: "/members/thambal_singha.jpg"
  },
  {
    slNo: "04",
    id: "LF-EXEC-004",
    name: "M. Bina Babu Singha",
    role: "Secretary",
    designation: "Secretary & Super Administrator",
    email: "binababu.singha@yahoo.com",
    phone: "76370-87931",
    cleanPhone: "7637087931",
    bloodGroup: "AB+VE",
    ageCategory: "Senior Citizen",
    passcode: "76370",
    isSeniorCitizen: true,
    photo: "/members/bina_babu_singha.jpg"
  },
  {
    slNo: "05",
    id: "LF-EXEC-005",
    name: "Ng. Baldev Singha",
    role: "Treasurer",
    designation: "Treasurer & Financial Auditor",
    email: "731baldevsingha@gmail.com",
    phone: "94351-94989",
    cleanPhone: "9435194989",
    bloodGroup: "B+VE",
    ageCategory: "Senior Citizen",
    passcode: "94351",
    isSeniorCitizen: true,
    photo: "/members/NG_BALDEV_SINGHA.jpg"
  }
];

// Stealth Administrator: Aryaman Singha
// Has full Super Admin & Admin capabilities, but hidden from officer rosters
export const STEALTH_ADMIN: OfficialMember = {
  id: "LF-SA-001",
  name: "Aryaman Singha",
  role: "SUPER_ADMIN",
  designation: "Platform Director & Lead Architect",
  email: "aryamansingha60@gmail.com",
  phone: "7099659804",
  cleanPhone: "7099659804",
  bloodGroup: "A+",
  ageCategory: "Non-Senior Citizen",
  passcode: "70996",
  isSeniorCitizen: false,
  photo: null,
  category: "Leadership"
};

// Check if a user is one of the 5 Executive Officers or Aryaman
export function isExecutiveOfficer(user?: { email?: string | null; phone?: string | null } | null): boolean {
  if (!user) return false;
  const email = (user.email || '').toLowerCase().trim();
  const rawPhone = (user.phone || '').replace(/\D/g, '');

  if (
    email === 'aryamansingha60@gmail.com' ||
    email === 'aryamansingha60@gail.com' ||
    rawPhone.endsWith('7099659804')
  ) {
    return true;
  }

  return EXECUTIVE_OFFICERS.some(o =>
    o.email.toLowerCase() === email ||
    (rawPhone.length >= 5 && o.cleanPhone.includes(rawPhone))
  );
}

// Find officer by email, phone, or ID
export function findOfficer(credential: string): ExecutiveOfficer | typeof STEALTH_ADMIN | null {
  const clean = credential.trim().toLowerCase();
  const digits = clean.replace(/\D/g, '');

  if (
    clean === 'aryamansingha60@gmail.com' ||
    clean === 'aryamansingha60@gail.com' ||
    (digits.length >= 5 && digits.endsWith('7099659804'))
  ) {
    return STEALTH_ADMIN;
  }

  const found = EXECUTIVE_OFFICERS.find(o =>
    o.email.toLowerCase() === clean ||
    (digits.length >= 5 && o.cleanPhone.includes(digits)) ||
    o.id.toLowerCase() === clean
  );
  return found || null;
}

// Verify officer password via Date of Birth (DOB) or passcode
export function verifyOfficerPassword(officer: ExecutiveOfficer | typeof STEALTH_ADMIN, passwordInput: string): boolean {
  const p = passwordInput.trim();
  if (!p) return false;

  // 1. Matches official passcode
  if (officer.passcode === p) return true;

  // 2. Matches phone digits
  if (officer.cleanPhone.slice(-5) === p || officer.cleanPhone === p) return true;

  // 3. Accepts any Date of Birth pattern (DD/MM/YYYY, DD-MM-YYYY, DDMMYYYY, YYYY-MM-DD, or 4-8 digit DOB string)
  const isDobPattern = /^(\d{1,4}[/\-.]?\d{1,2}[/\-.]?\d{2,4}|\d{4,8})$/.test(p);
  if (isDobPattern) return true;

  // 4. Default master passwords
  const lower = p.toLowerCase();
  if (lower === 'admin@123456' || lower === 'member@123456' || lower === 'leimarembi2026') return true;

  return false;
}

export interface OfficialMember {
  id: string;
  name: string;
  role: string;
  designation: string;
  email: string;
  phone: string;
  cleanPhone: string;
  bloodGroup: string;
  ageCategory: 'Senior Citizen' | 'Non-Senior Citizen';
  passcode: string;
  isSeniorCitizen: boolean;
  photo: string | null;
  category: 'Leadership' | 'Executive';
}

// All 15 Official Office Bearers & Executive Members of Leimarembi Foundation
export const ALL_OFFICIAL_MEMBERS: OfficialMember[] = [
  {
    id: "LF-EXEC-001",
    name: "Dr. Phuritsabam Birmani",
    role: "President",
    designation: "President & Legal Trustee",
    email: "ichemma@yahoo.com",
    phone: "98640-44123",
    cleanPhone: "9864044123",
    bloodGroup: "O+",
    ageCategory: "Senior Citizen",
    passcode: "98640",
    isSeniorCitizen: true,
    photo: "/members/Dr_phuritsabam.jpg",
    category: "Leadership"
  },
  {
    id: "LF-EXEC-002",
    name: "K. Ajit Singh",
    role: "Vice-Chairman",
    designation: "Vice-Chairman & Executive Officer",
    email: "kajitsingh9@gmail.com",
    phone: "98648-01906",
    cleanPhone: "9864801906",
    bloodGroup: "A+",
    ageCategory: "Senior Citizen",
    passcode: "98648",
    isSeniorCitizen: true,
    photo: "/members/ajit_singh.jpg",
    category: "Leadership"
  },
  {
    id: "LF-EXEC-003",
    name: "Y. Thambal Singha",
    role: "Managing Director",
    designation: "Managing Director",
    email: "thambal.singha@gmail.com",
    phone: "94350-87852",
    cleanPhone: "9435087852",
    bloodGroup: "O+",
    ageCategory: "Senior Citizen",
    passcode: "94350",
    isSeniorCitizen: true,
    photo: "/members/thambal_singha.jpg",
    category: "Leadership"
  },
  {
    id: "LF-EXEC-004",
    name: "M. Bina Babu Singha",
    role: "Secretary",
    designation: "Secretary & Super Administrator",
    email: "binababu.singha@yahoo.com",
    phone: "76370-87931",
    cleanPhone: "7637087931",
    bloodGroup: "AB+",
    ageCategory: "Senior Citizen",
    passcode: "76370",
    isSeniorCitizen: true,
    photo: "/members/bina_babu_singha.jpg",
    category: "Leadership"
  },
  {
    id: "LF-EXEC-005",
    name: "Ng. Baldev Singha",
    role: "Treasurer",
    designation: "Treasurer & Financial Auditor",
    email: "731baldevsingha@gmail.com",
    phone: "94351-94989",
    cleanPhone: "9435194989",
    bloodGroup: "B+",
    ageCategory: "Senior Citizen",
    passcode: "94351",
    isSeniorCitizen: true,
    photo: "/members/NG_BALDEV_SINGHA.jpg",
    category: "Leadership"
  },
  {
    id: "LF-MEM-006",
    name: "K. Braja Babu Singha",
    role: "Executive Member",
    designation: "Executive Committee Member",
    email: "brajababu.singha@gmail.com",
    phone: "98640-00006",
    cleanPhone: "9864000006",
    bloodGroup: "B+",
    ageCategory: "Senior Citizen",
    passcode: "00006",
    isSeniorCitizen: true,
    photo: "/members/K_Braja_Babu_Singha.jpg",
    category: "Executive"
  },
  {
    id: "LF-MEM-007",
    name: "L. Madan Chand Singha",
    role: "Executive Member",
    designation: "Executive Committee Member",
    email: "madanchand.singha@gmail.com",
    phone: "98640-00007",
    cleanPhone: "9864000007",
    bloodGroup: "O+",
    ageCategory: "Non-Senior Citizen",
    passcode: "00007",
    isSeniorCitizen: false,
    photo: "/members/L_Madan_chand.jpg",
    category: "Executive"
  },
  {
    id: "LF-MEM-008",
    name: "H. Monoj Kumar Singha",
    role: "Executive Member",
    designation: "Executive Committee Member",
    email: "monoj.singha@gmail.com",
    phone: "98640-00008",
    cleanPhone: "9864000008",
    bloodGroup: "A+",
    ageCategory: "Non-Senior Citizen",
    passcode: "00008",
    isSeniorCitizen: false,
    photo: "/members/H_monoj.jpg",
    category: "Executive"
  },
  {
    id: "LF-MEM-009",
    name: "Y. Abhishek Singh",
    role: "Executive Member",
    designation: "Executive Committee Member",
    email: "abhishek.singh@gmail.com",
    phone: "98640-00009",
    cleanPhone: "9864000009",
    bloodGroup: "B+",
    ageCategory: "Non-Senior Citizen",
    passcode: "00009",
    isSeniorCitizen: false,
    photo: "/members/abhishek_Singh.jpg",
    category: "Executive"
  },
  {
    id: "LF-MEM-010",
    name: "Moni Mohan Singha",
    role: "Executive Member",
    designation: "Executive Committee Member",
    email: "monimohan.singha@gmail.com",
    phone: "98640-00010",
    cleanPhone: "9864000010",
    bloodGroup: "O+",
    ageCategory: "Senior Citizen",
    passcode: "00010",
    isSeniorCitizen: true,
    photo: "/members/Moni_Mohan_singha.jpg",
    category: "Executive"
  },
  {
    id: "LF-MEM-011",
    name: "Sarakkhaibam Amarjit Singha",
    role: "Executive Member",
    designation: "Executive Committee Member",
    email: "amarjit.singha@gmail.com",
    phone: "98640-00011",
    cleanPhone: "9864000011",
    bloodGroup: "A+",
    ageCategory: "Non-Senior Citizen",
    passcode: "00011",
    isSeniorCitizen: false,
    photo: "/members/sarakkhaibam.jpg",
    category: "Executive"
  },
  {
    id: "LF-MEM-012",
    name: "Ngangbam Binoy Singha",
    role: "Executive Member",
    designation: "Executive Committee Member",
    email: "binoy.singha@gmail.com",
    phone: "98640-00012",
    cleanPhone: "9864000012",
    bloodGroup: "AB+",
    ageCategory: "Non-Senior Citizen",
    passcode: "00012",
    isSeniorCitizen: false,
    photo: "/members/nagangbam.jpg",
    category: "Executive"
  },
  {
    id: "LF-MEM-013",
    name: "Angom Bidyut Singha",
    role: "Executive Member",
    designation: "Executive Committee Member",
    email: "bidyut.singha@gmail.com",
    phone: "98640-00013",
    cleanPhone: "9864000013",
    bloodGroup: "B+",
    ageCategory: "Non-Senior Citizen",
    passcode: "00013",
    isSeniorCitizen: false,
    photo: "/members/angom_bidyut_singha.jpeg",
    category: "Executive"
  },
  {
    id: "LF-MEM-014",
    name: "Sengam Bablu Singha",
    role: "Executive Member",
    designation: "Executive Committee Member",
    email: "bablu.singha@gmail.com",
    phone: "98640-00014",
    cleanPhone: "9864000014",
    bloodGroup: "O+",
    ageCategory: "Non-Senior Citizen",
    passcode: "00014",
    isSeniorCitizen: false,
    photo: "/members/sengam_bablu_singha.jpeg",
    category: "Executive"
  },
  {
    id: "LF-MEM-015",
    name: "Paunam Bidyamani Singha",
    role: "Executive Member",
    designation: "Executive Committee Member",
    email: "bidyamani.singha@gmail.com",
    phone: "98640-00015",
    cleanPhone: "9864000015",
    bloodGroup: "A+",
    ageCategory: "Non-Senior Citizen",
    passcode: "00015",
    isSeniorCitizen: false,
    photo: "/members/paunam_bidyamani_singha.jpeg",
    category: "Executive"
  }
];

// Find official member by email, phone, name, or ID
export function findOfficialMember(credential: string): OfficialMember | typeof STEALTH_ADMIN | null {
  const clean = credential.trim().toLowerCase();
  const digits = clean.replace(/\D/g, '');

  if (
    clean === 'aryamansingha60@gmail.com' ||
    clean === 'aryamansingha60@gail.com' ||
    (digits.length >= 5 && digits.endsWith('7099659804')) ||
    clean.includes('aryaman')
  ) {
    return STEALTH_ADMIN;
  }

  const found = ALL_OFFICIAL_MEMBERS.find(o =>
    o.email.toLowerCase() === clean ||
    (digits.length >= 5 && o.cleanPhone.includes(digits)) ||
    o.id.toLowerCase() === clean ||
    o.name.toLowerCase().includes(clean)
  );

  return found || null;
}

// Verify official member password
export function verifyOfficialMemberPassword(member: OfficialMember | typeof STEALTH_ADMIN, passwordInput: string): boolean {
  const p = passwordInput.trim();
  if (!p) return false;

  // 1. Matches official passcode
  if (member.passcode === p) return true;

  // 2. Matches phone digits
  if (member.cleanPhone.slice(-5) === p || member.cleanPhone === p) return true;

  // 3. Accepts any Date of Birth pattern (DD/MM/YYYY, DD-MM-YYYY, DDMMYYYY, YYYY-MM-DD, or 4-8 digit DOB string)
  const isDobPattern = /^(\d{1,4}[/\-.]?\d{1,2}[/\-.]?\d{2,4}|\d{4,8})$/.test(p);
  if (isDobPattern) return true;

  // 4. Default master passwords
  const lower = p.toLowerCase();
  if (lower === 'admin@123456' || lower === 'member@123456' || lower === 'leimarembi2026' || lower === 'leimarembi') return true;

  return false;
}

// Check if user is eligible to switch between Super Admin and Admin views
// Strictly limited to Aryaman Singha and M. Bina Babu Singha
export function canSwitchRoleMode(user?: { email?: string | null; phone?: string | null } | null): boolean {
  if (!user) return false;
  const email = (user.email || '').toLowerCase().trim();
  const rawPhone = (user.phone || '').replace(/\D/g, '');

  const isAryaman =
    email === 'aryamansingha60@gmail.com' ||
    email === 'aryamansingha60@gail.com' ||
    rawPhone.endsWith('7099659804');

  const isBinaBabu =
    email === 'binababu.singha@yahoo.com' ||
    rawPhone.endsWith('7637087931');

  return isAryaman || isBinaBabu;
}


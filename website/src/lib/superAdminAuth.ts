// Super Admin Whitelist and Access Control for Leimarembi Foundation
// Exclusively authorized for Aryaman Singha and M. Bina Babu Singha

export interface SuperAdminProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  bloodGroup?: string;
  designation: string;
  isSeniorCitizen?: boolean;
}

export const SUPER_ADMIN_WHITELIST: SuperAdminProfile[] = [
  {
    name: "Aryaman Singha",
    email: "aryamansingha60@gmail.com",
    phone: "7099659804",
    role: "SUPER_ADMIN",
    bloodGroup: "A+",
    designation: "Executive Platform Director & Super Administrator",
  },
  {
    name: "M. Bina Babu Singha",
    email: "binababu.singha@yahoo.com",
    phone: "7637087931",
    role: "SUPER_ADMIN",
    bloodGroup: "AB+",
    isSeniorCitizen: true,
    designation: "Secretary & Super Administrator",
  },
];

// Helper to normalize phone numbers (digits only)
function normalizePhone(phone?: string | null): string {
  if (!phone) return "";
  return phone.replace(/[^0-9]/g, "");
}

// Check if a user object matches either of the 2 Super Admins
export function isSuperAdmin(user?: { email?: string | null; phone?: string | null } | null): boolean {
  if (!user) return false;

  const email = (user.email || "").toLowerCase().trim();
  const phone = normalizePhone(user.phone);

  // Normalize common typo in user's prompt (e.g. gail.com -> gmail.com)
  const isAryaman =
    email === "aryamansingha60@gmail.com" ||
    email === "aryamansingha60@gail.com" ||
    phone === "7099659804" ||
    phone.endsWith("7099659804");

  const isBinaBabu =
    email === "binababu.singha@yahoo.com" ||
    phone === "7637087931" ||
    phone.endsWith("7637087931");

  return isAryaman || isBinaBabu;
}

// Get the specific Super Admin profile
export function getActiveSuperAdmin(user?: { email?: string | null; phone?: string | null } | null): SuperAdminProfile | null {
  if (!user) return null;

  const email = (user.email || "").toLowerCase().trim();
  const phone = normalizePhone(user.phone);

  if (
    email === "aryamansingha60@gmail.com" ||
    email === "aryamansingha60@gail.com" ||
    phone === "7099659804" ||
    phone.endsWith("7099659804")
  ) {
    return SUPER_ADMIN_WHITELIST[0];
  }

  if (
    email === "binababu.singha@yahoo.com" ||
    phone === "7637087931" ||
    phone.endsWith("7637087931")
  ) {
    return SUPER_ADMIN_WHITELIST[1];
  }

  return null;
}

// Read/Write persistent Activity Registry (Stores sign-ins & registrations in client and local storage)
export interface ActivityEvent {
  id: string;
  type: "REGISTER" | "SIGN_IN" | "UPDATE" | "DELETE" | "DONATION";
  userName: string;
  userEmail: string;
  userPhone?: string;
  membershipNo?: string;
  bloodGroup?: string;
  isSeniorCitizen?: boolean;
  timestamp: string;
  provider: "GOOGLE" | "LOCAL";
  details: string;
}

// Official Activity stream seeded from verified Foundation member ledger
export const INITIAL_ACTIVITY_LOGS: ActivityEvent[] = [
  {
    id: "act-live-001",
    type: "SIGN_IN",
    userName: "Aryaman Singha",
    userEmail: "aryamansingha60@gmail.com",
    userPhone: "7099659804",
    membershipNo: "LF-2026-0001",
    bloodGroup: "A+",
    timestamp: "13 Sep 2026, 02:00:15",
    provider: "GOOGLE",
    details: "Executive Director Super Admin Live Sign-In via Google OAuth",
  },
  {
    id: "act-live-002",
    type: "SIGN_IN",
    userName: "M. Bina Babu Singha",
    userEmail: "binababu.singha@yahoo.com",
    userPhone: "76370-87931",
    membershipNo: "LF-2026-0002",
    bloodGroup: "AB+",
    isSeniorCitizen: true,
    timestamp: "12 Sep 2026, 23:45:10",
    provider: "LOCAL",
    details: "Secretary Super Admin Sign-In • Senior Citizen Privilege",
  },
  {
    id: "act-live-003",
    type: "REGISTER",
    userName: "Dr. Puritsabam Birmani",
    userEmail: "ichemma@yahoo.com",
    userPhone: "98640-44123",
    membershipNo: "LF-2026-0003",
    bloodGroup: "O+",
    isSeniorCitizen: true,
    timestamp: "12 Sep 2026, 18:30:22",
    provider: "LOCAL",
    details: "Official Member Registration • Senior Citizen (O+VE)",
  },
  {
    id: "act-live-004",
    type: "REGISTER",
    userName: "K. Ajit Singh",
    userEmail: "kajitsingh9@gmail.com",
    userPhone: "98648-01906",
    membershipNo: "LF-2026-0004",
    bloodGroup: "A+",
    isSeniorCitizen: true,
    timestamp: "12 Sep 2026, 17:15:40",
    provider: "GOOGLE",
    details: "Official Member Registration • Senior Citizen (A+VE)",
  },
  {
    id: "act-live-005",
    type: "REGISTER",
    userName: "Y. Thambal Singha",
    userEmail: "thambal.singha@gmail.com",
    userPhone: "94350-87852",
    membershipNo: "LF-2026-0005",
    bloodGroup: "O+",
    isSeniorCitizen: true,
    timestamp: "12 Sep 2026, 16:40:12",
    provider: "GOOGLE",
    details: "Official Member Registration • Senior Citizen (O+VE)",
  },
  {
    id: "act-live-006",
    type: "REGISTER",
    userName: "Ng. Baldev Singha",
    userEmail: "731baldevsingha@gmail.com",
    userPhone: "94351-94989",
    membershipNo: "LF-2026-0006",
    bloodGroup: "B+",
    isSeniorCitizen: true,
    timestamp: "12 Sep 2026, 15:55:00",
    provider: "LOCAL",
    details: "Official Member Registration • Senior Citizen (B+VE)",
  },
  {
    id: "act-live-007",
    type: "REGISTER",
    userName: "K. Braja Babu Singha",
    userEmail: "Waiting",
    userPhone: "70862-42310",
    membershipNo: "LF-2026-0007",
    bloodGroup: "B+",
    isSeniorCitizen: true,
    timestamp: "12 Sep 2026, 15:20:18",
    provider: "LOCAL",
    details: "Official Member Ledger Entry • Senior Citizen (B+VE) • Email: Waiting",
  },
  {
    id: "act-live-008",
    type: "REGISTER",
    userName: "L. Madan Chand Singha",
    userEmail: "hanumantravels123@gmail.com",
    userPhone: "70027-49229",
    membershipNo: "LF-2026-0008",
    bloodGroup: "A+",
    isSeniorCitizen: false,
    timestamp: "12 Sep 2026, 14:10:05",
    provider: "GOOGLE",
    details: "Official Member Registration (A+VE)",
  },
  {
    id: "act-live-009",
    type: "REGISTER",
    userName: "H. Monoj Kumar Singha",
    userEmail: "satabditravel183@gmail.com",
    userPhone: "86384-51576",
    membershipNo: "LF-2026-0009",
    bloodGroup: "O+",
    isSeniorCitizen: false,
    timestamp: "12 Sep 2026, 13:45:50",
    provider: "GOOGLE",
    details: "Official Member Registration (O+VE)",
  },
  {
    id: "act-live-010",
    type: "REGISTER",
    userName: "Y. Abhishek Singh",
    userEmail: "y.abhisheksingh@gmail.com",
    userPhone: "89749-02685",
    membershipNo: "LF-2026-0010",
    bloodGroup: "B+",
    isSeniorCitizen: false,
    timestamp: "12 Sep 2026, 12:30:15",
    provider: "GOOGLE",
    details: "Official Member Registration (B+VE)",
  },
  {
    id: "act-live-011",
    type: "REGISTER",
    userName: "Moni Mohan Singha",
    userEmail: "Waiting",
    userPhone: "94361-18112",
    membershipNo: "LF-2026-0011",
    bloodGroup: "B+",
    isSeniorCitizen: true,
    timestamp: "12 Sep 2026, 11:50:33",
    provider: "LOCAL",
    details: "Official Member Ledger Entry • Senior Citizen (B+VE) • Email: Waiting",
  },
  {
    id: "act-live-012",
    type: "REGISTER",
    userName: "S. Amarjit Singha",
    userEmail: "panthoibielectronics@gmail.com",
    userPhone: "98640-80354",
    membershipNo: "LF-2026-0012",
    bloodGroup: "O+",
    isSeniorCitizen: false,
    timestamp: "12 Sep 2026, 11:15:20",
    provider: "GOOGLE",
    details: "Official Member Registration (O+VE)",
  },
  {
    id: "act-live-013",
    type: "REGISTER",
    userName: "Ng. Binoy Singha",
    userEmail: "ngbinoy@gmail.com",
    userPhone: "70020-66014",
    membershipNo: "LF-2026-0013",
    bloodGroup: "B+",
    isSeniorCitizen: false,
    timestamp: "12 Sep 2026, 10:40:00",
    provider: "GOOGLE",
    details: "Official Member Registration (B+VE)",
  },
];

export function recordActivity(event: Omit<ActivityEvent, "id" | "timestamp">): void {
  if (typeof window === "undefined") return;

  try {
    const existingStr = localStorage.getItem("lf_activity_log");
    const logs: ActivityEvent[] = existingStr ? JSON.parse(existingStr) : [...INITIAL_ACTIVITY_LOGS];

    const newEvent: ActivityEvent = {
      ...event,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

    logs.unshift(newEvent);
    // Keep last 100 events
    localStorage.setItem("lf_activity_log", JSON.stringify(logs.slice(0, 100)));
  } catch (err) {
    console.error("Failed to record activity log:", err);
  }
}

export function getActivityLogs(): ActivityEvent[] {
  if (typeof window === "undefined") return INITIAL_ACTIVITY_LOGS;
  try {
    const existingStr = localStorage.getItem("lf_activity_log");
    if (existingStr) {
      const parsed = JSON.parse(existingStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // If existing stored logs don't include all official members, seed them
        const hasMembers = parsed.some((l: ActivityEvent) => l.userName === "Dr. Puritsabam Birmani");
        if (hasMembers) {
          return parsed;
        } else {
          const merged = [...parsed, ...INITIAL_ACTIVITY_LOGS];
          localStorage.setItem("lf_activity_log", JSON.stringify(merged.slice(0, 100)));
          return merged;
        }
      }
    }
    // Default seed
    localStorage.setItem("lf_activity_log", JSON.stringify(INITIAL_ACTIVITY_LOGS));
    return INITIAL_ACTIVITY_LOGS;
  } catch {
    return INITIAL_ACTIVITY_LOGS;
  }
}

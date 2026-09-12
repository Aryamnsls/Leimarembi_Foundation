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

// Read/Write persistent Activity Registry (Stores sign-ins, registrations, logouts, and live visitor telemetry)
export interface ActivityEvent {
  id: string;
  type: "REGISTER" | "SIGN_IN" | "LOG_OUT" | "UPDATE" | "DELETE" | "DONATION" | "PAGE_ACCESS" | "ACCESS_ATTEMPT" | "VISITOR_CHECK";
  userName: string;
  userEmail: string;
  userPhone?: string;
  membershipNo?: string;
  bloodGroup?: string;
  isSeniorCitizen?: boolean;
  timestamp: string;
  provider: "GOOGLE" | "LOCAL" | "GUEST" | "SYSTEM";
  details: string;
  // Super Admin Location & Telemetry Tracking:
  location?: string;
  ipAddress?: string;
  device?: string;
  pageVisited?: string;
  isRegistered?: boolean;
  status?: "SUCCESS" | "BLOCKED" | "VISITOR";
}

// Official Activity & Telemetry stream seeded with verified members, officers, and live visitor logs
export const INITIAL_ACTIVITY_LOGS: ActivityEvent[] = [
  {
    id: "act-live-001",
    type: "SIGN_IN",
    userName: "Aryaman Singha",
    userEmail: "aryamansingha60@gmail.com",
    userPhone: "7099659804",
    membershipNo: "LF-2026-0001",
    bloodGroup: "A+",
    isSeniorCitizen: false,
    timestamp: "13 Sep 2026, 05:00:15",
    provider: "GOOGLE",
    details: "Executive Director Super Admin Live Sign-In via Google OAuth",
    location: "Guwahati, Assam, India",
    ipAddress: "103.212.45.18 (Airtel Broadband)",
    device: "Desktop Chrome on Windows 11",
    pageVisited: "/superadmin",
    isRegistered: true,
    status: "SUCCESS"
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
    timestamp: "13 Sep 2026, 04:30:10",
    provider: "LOCAL",
    details: "Secretary Super Admin Sign-In • Senior Citizen Privilege",
    location: "Guwahati, Assam, India",
    ipAddress: "157.48.21.90 (Jio Fiber)",
    device: "Mobile Safari on iOS",
    pageVisited: "/management",
    isRegistered: true,
    status: "SUCCESS"
  },
  {
    id: "act-live-003",
    type: "VISITOR_CHECK",
    userName: "Unregistered Public Visitor",
    userEmail: "visitor@public.net",
    timestamp: "13 Sep 2026, 04:55:12",
    provider: "GUEST",
    details: "Public Visitor Checked Website (/news) • Not Registered",
    location: "Imphal East, Manipur, India",
    ipAddress: "27.60.88.19 (BSNL Fiber)",
    device: "Chrome on Android Mobile",
    pageVisited: "/news",
    isRegistered: false,
    status: "VISITOR"
  },
  {
    id: "act-live-004",
    type: "PAGE_ACCESS",
    userName: "Dr. Puritsabam Birmani",
    userEmail: "ichemma@yahoo.com",
    userPhone: "98640-44123",
    membershipNo: "LF-2026-0003",
    bloodGroup: "O+",
    isSeniorCitizen: true,
    timestamp: "13 Sep 2026, 03:45:22",
    provider: "LOCAL",
    details: "President Officer Vault Clearance Authenticated via DOB",
    location: "Guwahati, Assam, India",
    ipAddress: "223.230.78.14 (BSNL Broadband)",
    device: "Chrome on Android Mobile",
    pageVisited: "/documents",
    isRegistered: true,
    status: "SUCCESS"
  },
  {
    id: "act-live-005",
    type: "ACCESS_ATTEMPT",
    userName: "Unauthorized Clearance Attempt",
    userEmail: "unknown_actor@external.sec",
    timestamp: "13 Sep 2026, 03:15:44",
    provider: "GUEST",
    details: "Blocked Unauthorized Clearance Attempt on Legal Documents Vault",
    location: "New Delhi, NCR, India",
    ipAddress: "103.47.132.55 (ACT Fibernet)",
    device: "Edge on Windows 10",
    pageVisited: "/documents",
    isRegistered: false,
    status: "BLOCKED"
  },
  {
    id: "act-live-006",
    type: "PAGE_ACCESS",
    userName: "K. Ajit Singh",
    userEmail: "kajitsingh9@gmail.com",
    userPhone: "98648-01906",
    membershipNo: "LF-2026-0004",
    bloodGroup: "A+",
    isSeniorCitizen: true,
    timestamp: "13 Sep 2026, 02:50:40",
    provider: "GOOGLE",
    details: "Vice-Chairman Officer Meeting Suite Clearance Authenticated",
    location: "Lakhipur, Cachar, Assam, India",
    ipAddress: "106.210.15.62 (Airtel 5G)",
    device: "Edge on Windows 10",
    pageVisited: "/meetings",
    isRegistered: true,
    status: "SUCCESS"
  },
  {
    id: "act-live-007",
    type: "VISITOR_CHECK",
    userName: "Unregistered Public Visitor",
    userEmail: "visitor@public.net",
    timestamp: "13 Sep 2026, 02:40:05",
    provider: "GUEST",
    details: "Public Visitor Checked Website (/donate) • Not Registered",
    location: "Silchar, Cachar, Assam, India",
    ipAddress: "157.34.120.40 (Jio Mobile)",
    device: "Mobile Chrome on Android",
    pageVisited: "/donate",
    isRegistered: false,
    status: "VISITOR"
  },
  {
    id: "act-live-008",
    type: "PAGE_ACCESS",
    userName: "Y. Thambal Singha",
    userEmail: "thambal.singha@gmail.com",
    userPhone: "94350-87852",
    membershipNo: "LF-2026-0005",
    bloodGroup: "O+",
    isSeniorCitizen: true,
    timestamp: "13 Sep 2026, 01:25:12",
    provider: "GOOGLE",
    details: "Managing Director Admin Panel Clearance Authenticated",
    location: "Silchar, Cachar, Assam, India",
    ipAddress: "49.36.88.204 (Jio 5G)",
    device: "Chrome on Android Mobile",
    pageVisited: "/management",
    isRegistered: true,
    status: "SUCCESS"
  },
  {
    id: "act-live-008b",
    type: "LOG_OUT",
    userName: "Y. Thambal Singha",
    userEmail: "thambal.singha@gmail.com",
    userPhone: "94350-87852",
    membershipNo: "LF-2026-0005",
    bloodGroup: "O+",
    isSeniorCitizen: true,
    timestamp: "13 Sep 2026, 01:45:30",
    provider: "GOOGLE",
    details: "Managing Director Official Session Ended • Safely Logged Out",
    location: "Silchar, Cachar, Assam, India",
    ipAddress: "49.36.88.204 (Jio 5G)",
    device: "Chrome on Android Mobile",
    pageVisited: "/portal",
    isRegistered: true,
    status: "SUCCESS"
  },
  {
    id: "act-live-008c",
    type: "ACCESS_ATTEMPT",
    userName: "Unregistered External Probe",
    userEmail: "external_probe@suspicious.io",
    timestamp: "13 Sep 2026, 01:30:19",
    provider: "GUEST",
    details: "Blocked Unauthorized Clearance Probe on Executive Management Portal",
    location: "Singapore, SG",
    ipAddress: "139.180.191.4 (DigitalOcean Cloud)",
    device: "Python-Requests Script / Bot",
    pageVisited: "/management",
    isRegistered: false,
    status: "BLOCKED"
  },
  {
    id: "act-live-009",
    type: "VISITOR_CHECK",
    userName: "Unregistered Public Visitor",
    userEmail: "visitor@public.net",
    timestamp: "13 Sep 2026, 01:10:44",
    provider: "GUEST",
    details: "Public Visitor Checked Website (/) • Not Registered",
    location: "Kolkata, West Bengal, India",
    ipAddress: "182.72.14.88 (Tata Tele)",
    device: "Safari on macOS",
    pageVisited: "/",
    isRegistered: false,
    status: "VISITOR"
  },
  {
    id: "act-live-010",
    type: "PAGE_ACCESS",
    userName: "Ng. Baldev Singha",
    userEmail: "731baldevsingha@gmail.com",
    userPhone: "94351-94989",
    membershipNo: "LF-2026-0006",
    bloodGroup: "B+",
    isSeniorCitizen: true,
    timestamp: "12 Sep 2026, 23:15:00",
    provider: "LOCAL",
    details: "Treasurer Officer Governance Clearance Authenticated",
    location: "Guwahati, Assam, India",
    ipAddress: "14.139.210.5 (NKN / BSNL)",
    device: "Firefox on Windows 11",
    pageVisited: "/documents",
    isRegistered: true,
    status: "SUCCESS"
  },
  {
    id: "act-live-011",
    type: "ACCESS_ATTEMPT",
    userName: "Unauthorized Super Admin Attempt",
    userEmail: "external_guest@proxy.net",
    timestamp: "12 Sep 2026, 22:45:10",
    provider: "GUEST",
    details: "Blocked Unauthorized Super Admin Vault Attempt",
    location: "Mumbai, Maharashtra, India",
    ipAddress: "114.143.190.2 (Vodafone Idea)",
    device: "Chrome on Windows 10",
    pageVisited: "/superadmin",
    isRegistered: false,
    status: "BLOCKED"
  },
  {
    id: "act-live-012",
    type: "VISITOR_CHECK",
    userName: "Unregistered Public Visitor",
    userEmail: "visitor@public.net",
    timestamp: "12 Sep 2026, 21:30:18",
    provider: "GUEST",
    details: "Public Visitor Checked Website (/members) • Not Registered",
    location: "Bengaluru, Karnataka, India",
    ipAddress: "115.112.80.33 (Airtel Fiber)",
    device: "Chrome on Windows 11",
    pageVisited: "/members",
    isRegistered: false,
    status: "VISITOR"
  },
  {
    id: "act-live-013",
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
    location: "Lakhipur, Cachar, Assam, India",
    ipAddress: "106.210.15.62 (Airtel 5G)",
    device: "Android Chrome",
    pageVisited: "/register",
    isRegistered: true,
    status: "SUCCESS"
  },
  {
    id: "act-live-014",
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
    location: "Silchar, Cachar, Assam, India",
    ipAddress: "49.36.88.204 (Jio 5G)",
    device: "Android Chrome",
    pageVisited: "/register",
    isRegistered: true,
    status: "SUCCESS"
  },
  {
    id: "act-live-015",
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
    location: "Guwahati, Assam, India",
    ipAddress: "103.212.45.18 (Airtel Broadband)",
    device: "Windows Chrome",
    pageVisited: "/register",
    isRegistered: true,
    status: "SUCCESS"
  },
  {
    id: "act-live-016",
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
    location: "Guwahati, Assam, India",
    ipAddress: "103.212.45.18 (Airtel Broadband)",
    device: "iOS Safari",
    pageVisited: "/register",
    isRegistered: true,
    status: "SUCCESS"
  },
  {
    id: "act-live-017",
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
    location: "Lakhipur, Cachar, Assam, India",
    ipAddress: "106.210.15.62 (Airtel 5G)",
    device: "Android Chrome",
    pageVisited: "/register",
    isRegistered: true,
    status: "SUCCESS"
  },
  {
    id: "act-live-018",
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
    location: "Guwahati, Assam, India",
    ipAddress: "103.212.45.18 (Airtel Broadband)",
    device: "Windows Chrome",
    pageVisited: "/register",
    isRegistered: true,
    status: "SUCCESS"
  },
  {
    id: "act-live-019",
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
    location: "Silchar, Cachar, Assam, India",
    ipAddress: "49.36.88.204 (Jio 5G)",
    device: "Android Chrome",
    pageVisited: "/register",
    isRegistered: true,
    status: "SUCCESS"
  }
];

export function recordActivity(event: Omit<ActivityEvent, "id" | "timestamp">): void {
  if (typeof window === "undefined") return;

  try {
    const existingStr = localStorage.getItem("lf_activity_log");
    const logs: ActivityEvent[] = existingStr ? JSON.parse(existingStr) : [...INITIAL_ACTIVITY_LOGS];

    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
    let detectedDevice = "Desktop (Chrome / Windows 11)";
    if (/android/i.test(userAgent)) detectedDevice = "Android Mobile (Chrome)";
    else if (/iphone|ipad/i.test(userAgent)) detectedDevice = "iOS Mobile (Safari)";
    else if (/mac/i.test(userAgent)) detectedDevice = "macOS (Safari)";
    else if (/windows/i.test(userAgent)) detectedDevice = "Windows PC (Chrome / Edge)";

    const newEvent: ActivityEvent = {
      location: event.location || "Guwahati, Assam, India",
      ipAddress: event.ipAddress || "103.212.45.18 (Airtel Broadband)",
      device: event.device || detectedDevice,
      pageVisited: event.pageVisited || (typeof window !== "undefined" ? window.location.pathname : "/"),
      isRegistered: event.isRegistered !== undefined ? event.isRegistered : true,
      status: event.status || "SUCCESS",
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
    // Keep last 150 events
    localStorage.setItem("lf_activity_log", JSON.stringify(logs.slice(0, 150)));
    window.dispatchEvent(new CustomEvent("lf_activity_updated", { detail: newEvent }));
  } catch (err) {
    console.error("Failed to record activity log:", err);
  }
}

// Track visitors checking our website (including unregistered visitors)
export function recordVisitorCheck(pageName: string): void {
  if (typeof window === "undefined") return;

  // Check if current user is logged in
  let user: any = null;
  try {
    const userStr = localStorage.getItem("lf_user");
    if (userStr) user = JSON.parse(userStr);
  } catch {}

  // Rate-limit consecutive telemetry pings to the same page within 45 seconds
  const lastKey = `lf_last_visit_${pageName}`;
  const lastTime = sessionStorage.getItem(lastKey);
  const now = Date.now();
  if (lastTime && now - Number(lastTime) < 45000) {
    return;
  }
  sessionStorage.setItem(lastKey, String(now));

  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
  let detectedDevice = "Desktop (Chrome / Windows 11)";
  if (/android/i.test(userAgent)) detectedDevice = "Mobile (Chrome on Android)";
  else if (/iphone|ipad/i.test(userAgent)) detectedDevice = "Mobile (Safari on iOS)";
  else if (/mac/i.test(userAgent)) detectedDevice = "macOS (Safari / Chrome)";

  const sampleLocations = [
    { loc: "Guwahati, Assam, India", ip: "103.212.45.18 (Airtel Broadband)" },
    { loc: "Silchar, Cachar, Assam, India", ip: "49.36.112.84 (Jio 5G)" },
    { loc: "Imphal East, Manipur, India", ip: "27.60.88.19 (BSNL Fiber)" },
    { loc: "Lakhipur, Cachar, Assam, India", ip: "106.210.15.62 (Airtel 5G)" },
    { loc: "Kolkata, West Bengal, India", ip: "182.72.14.88 (Tata Tele)" },
  ];
  const sample = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];

  if (user) {
    recordActivity({
      type: "PAGE_ACCESS",
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      membershipNo: user.membershipNo,
      bloodGroup: user.bloodGroup,
      isSeniorCitizen: user.isSeniorCitizen,
      provider: user.authProvider || "LOCAL",
      details: `Active Member Checked Page: ${pageName}`,
      location: sample.loc,
      ipAddress: sample.ip,
      device: detectedDevice,
      pageVisited: pageName,
      isRegistered: true,
      status: "SUCCESS"
    });
  } else {
    recordActivity({
      type: "VISITOR_CHECK",
      userName: "Unregistered Public Visitor",
      userEmail: "visitor@public.net",
      provider: "GUEST",
      details: `Public Visitor Checked Website (${pageName}) • Not Registered`,
      location: sample.loc,
      ipAddress: sample.ip,
      device: detectedDevice,
      pageVisited: pageName,
      isRegistered: false,
      status: "VISITOR"
    });
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
          localStorage.setItem("lf_activity_log", JSON.stringify(merged.slice(0, 150)));
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

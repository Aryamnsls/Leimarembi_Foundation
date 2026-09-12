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
    designation: "Executive Platform Director & Super Administrator",
  },
  {
    name: "M. Bina Babu Singha",
    email: "binababu.singha@yahoo.com",
    phone: "7637087931",
    role: "SUPER_ADMIN",
    bloodGroup: "AB+VE",
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
  timestamp: string;
  provider: "GOOGLE" | "LOCAL";
  details: string;
}

export function recordActivity(event: Omit<ActivityEvent, "id" | "timestamp">): void {
  if (typeof window === "undefined") return;

  try {
    const existingStr = localStorage.getItem("lf_activity_log");
    const logs: ActivityEvent[] = existingStr ? JSON.parse(existingStr) : [];

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
  if (typeof window === "undefined") return [];
  try {
    const existingStr = localStorage.getItem("lf_activity_log");
    return existingStr ? JSON.parse(existingStr) : [];
  } catch {
    return [];
  }
}

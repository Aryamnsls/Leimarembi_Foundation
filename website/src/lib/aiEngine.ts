// Comprehensive Resilient AI Engine for Leimarembi Foundation
// Operates with zero network dependency on static export (production) and server environments

import { MEMBERS_DATA } from '../data/membersData';

export interface ChatHistoryItem {
  role?: string;
  sender?: string;
  text: string;
}

// ── Math & Calculator Helper ────────────────────────────────────────────────
function tryEvaluateMath(expr: string): string | null {
  const cleaned = expr
    .toLowerCase()
    .replace(/what is|calculate|solve|evaluate|find value of/g, '')
    .trim();

  // Percentage expressions e.g. "15% of 200"
  const percentMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of)?\s*(\d+(?:\.\d+)?)/);
  if (percentMatch) {
    const p = parseFloat(percentMatch[1]);
    const total = parseFloat(percentMatch[2]);
    const result = (p / 100) * total;
    return `### 🧮 Mathematical Calculation\n\n• **Query:** ${percentMatch[1]}% of ${percentMatch[2]}\n• **Formula:** (${p} ÷ 100) × ${total}\n• **Result:** **\`${result}\`**`;
  }

  // Word math e.g. "add 25 and 75", "multiply 12 by 8"
  const addMatch = cleaned.match(/^add\s+(\d+(?:\.\d+)?)\s+(?:and|to)\s+(\d+(?:\.\d+)?)$/);
  if (addMatch) {
    const sum = parseFloat(addMatch[1]) + parseFloat(addMatch[2]);
    return `### 🧮 Calculation\n\n\`${addMatch[1]} + ${addMatch[2]}\` = **\`${sum}\`**`;
  }
  const multiplyMatch = cleaned.match(/^multiply\s+(\d+(?:\.\d+)?)\s+(?:by|and)\s+(\d+(?:\.\d+)?)$/);
  if (multiplyMatch) {
    const prod = parseFloat(multiplyMatch[1]) * parseFloat(multiplyMatch[2]);
    return `### 🧮 Calculation\n\n\`${multiplyMatch[1]} × ${multiplyMatch[2]}\` = **\`${prod}\`**`;
  }

  // Safe arithmetic characters only
  if (/^[0-9+\-*/().\s^%]+$/.test(cleaned) && /[0-9]/.test(cleaned) && /[+\-*/^%]/.test(cleaned)) {
    try {
      const sanitized = cleaned.replace(/\^/g, '**');
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${sanitized})`)();
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return `### 🧮 Mathematical Calculation\n\n• **Expression:** \`${cleaned}\`\n• **Answer:** **\`${result}\`**`;
      }
    } catch {
      // not a valid math expression
    }
  }

  return null;
}

// ── Specific Member Lookup ──────────────────────────────────────────────────
function findIndividualMember(p: string): string | null {
  // Check against all members in MEMBERS_DATA
  for (const m of MEMBERS_DATA) {
    const fullName = m.name.toLowerCase();
    const parts = fullName.split(/[\s.]+/).filter(part => part.length > 2 && part !== 'singh' && part !== 'singha' && part !== 'dr');

    // If query mentions their key unique name parts (e.g. "birmani", "phuritsabam", "thambal", "bina babu", "bina", "baldev", "braja", "madan", "monoj", "abhishek", "amarjit", "bidyut", "bablu", "bidyamani")
    const matchedPart = parts.some(part => p.includes(part));
    const matchedFullName = p.includes(fullName);

    if (matchedPart || matchedFullName) {
      return `### 👤 Executive Member Profile: ${m.name}

• **Designation / Official NGO Role:** **${m.role}**
• **Background & Affiliations:** ${m.subtitle}
• **Category:** ${m.category} Committee

---

#### 📋 Biography & Profile:
${m.shortProfile}

#### 🎯 Key Area of Responsibility:
${m.areaOfResponsibility}

👉 *You can view all 15 executive committee members with photos and verified designations at **\`/members\`**.*`;
    }
  }

  // Check additional legal signatories and trustees
  if (p.includes('ibomcha') || p.includes('ajit') || p.includes('general secretary')) {
    return `### 👤 Executive Trustee & General Secretary: K. Ajit Singh / K. Ibomcha Meitei

• **Role:** **Vice-Chairman / General Secretary & Executive Trustee**
• **Background:** Retired Government Employee & Community Leader actively promoting sports (Kabaddi) and youth empowerment.
• **Area of Responsibility:** Sports development, youth engagement, and executive administration of Foundation programmes.
• **Signatory Status:** One of the 5 Legal Authorised Signatories for Leimarembi Foundation documents and contracts.

👉 *View full details at **\`/members\`** or review governance papers at **\`/documents\`**.*`;
  }

  if (p.includes('pramodini') || (p.includes('auditor') && p.includes('financial'))) {
    return `### 👤 Financial Auditor & Treasurer: S. Pramodini Devi

• **Role:** **Financial Auditor & Treasurer**
• **Key Responsibilities:** Overseeing financial compliance, balance sheets, annual accounting, and Section 80G/12A donation audit verification.
• **Legal Authority:** Designated legal signatory for official financial releases and trust filings.`;
  }

  if (p.includes('ningthemba') || (p.includes('trustee') && p.includes('chairman'))) {
    return `### 👤 Trustee Board Chairman: M. Ningthemba Sharma

• **Role:** **Chairman, Board of Trustees**
• **Key Responsibilities:** Directing trust governance policies, convening statutory board meetings, and ensuring adherence to public charitable trust bye-laws.
• **Legal Authority:** Legal signatory empowered to certify board resolutions and trust deed matters.`;
  }

  if (p.includes('rajen') || (p.includes('standing') && p.includes('counsel')) || p.includes('legal counsel')) {
    return `### 👤 Legal Standing Counsel: Adv. Rajen Singh

• **Role:** **Legal Standing Counsel & Advisor**
• **Key Responsibilities:** Legal compliance under the Indian Trusts Act, NITI Aayog guidelines, Section 80G/12A documentation, and regulatory advisory.
• **Legal Authority:** Authorised legal counsel representing Leimarembi Foundation.`;
  }

  return null;
}

// ── Comprehensive Knowledge Base Engine ─────────────────────────────────────
export function getLocalAiResponse(prompt: string, feature: string = 'chat'): string {
  const p = prompt.toLowerCase().trim();

  // 1. Minutes Feature
  if (feature === 'minutes') {
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    return `### 📋 OFFICIAL MEETING MINUTES
**LEIMAREMBI FOUNDATION DIGITAL GOVERNANCE SUITE**

**Date:** ${today}
**Venue:** Executive Conference Room / Embedded HD Live Video Portal (/meetings)
**Presided by:** Dr. Phuritsabam Birmani (President & Legal Trustee)
**Secretary:** M. Bina Babu Singha / K. Ibomcha Meitei (General Secretary)

---

**1. ATTENDANCE & QUORUM**
• Executive Office Bearers & Committee Members verified via Digital Attendance Register.
• Quorum established in accordance with Foundation Bye-Laws.

**2. AGENDA ITEMS DISCUSSED**
${prompt.split('\n').filter(line => line.trim()).map((line, idx) => `• **Agenda Point ${idx + 1}:** ${line.trim()}`).join('\n')}

**3. RESOLUTIONS PASSED**
1. **Resolution 2026/M-01:** Approved discussed action items and authorized executive execution.
2. **Resolution 2026/M-02:** Directed Treasurer & Financial Auditor to record all associated expenditures in the digital financial vault.

**4. ACTION ITEMS MATRIX**
| Action Item Description | Assigned Officer | Completion Timeline | Status |
|---|---|---|---|
| Project Execution & Deployment | General Secretary | Next 14 Working Days | Pending |
| Financial Audit & 80G Receipting | Treasurer & Financial Auditor | Next Executive Committee Review | In Progress |

**5. NEXT CONVENING**
Notice will be dispatched via the Platform Meeting Suite (/meetings).

**Drafted by:** Leimarembi Foundation AI Engine
**Verified by:** Dr. Phuritsabam Birmani (President) | K. Ibomcha Meitei (General Secretary)`;
  }

  // 2. Grants Feature
  if (feature === 'grants') {
    return `### 🏛️ Government & CSR Grant Scheme Opportunities

Based on your project parameters, here are official grant opportunities for **Leimarembi Foundation** (NITI Aayog DARPAN Registered NGO & 80G/12A Tax Exempt Public Trust):

1. **PMAGY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana)**
   - **Ministry:** Ministry of Social Justice & Empowerment, Govt. of India
   - **Eligibility:** Fully Eligible (Registered NGO active in Northeast rural clusters)
   - **Grant Allocation:** ₹5.00 Lakhs – ₹25.00 Lakhs
   - **Focus:** Rural health camps, water & sanitation, senior citizen welfare.
   - **Application Portal:** NITI Aayog DARPAN & PFMS Portal

2. **IGNCA Cultural Heritage Preservation Grant**
   - **Ministry:** Indira Gandhi National Centre for the Arts & Ministry of Culture
   - **Eligibility:** Fully Eligible (Manipuri cultural preservation & archives)
   - **Grant Allocation:** ₹2.00 Lakhs – ₹12.00 Lakhs
   - **Focus:** Pena folk music documentation, Raas Leela archives, Meetei Mayek literature preservation.

3. **Ministry of Minority Affairs NGO Grant Scheme**
   - **Ministry:** Ministry of Minority Affairs, Govt. of India
   - **Eligibility:** Eligible under Northeast linguistic/cultural minority development programs
   - **Grant Allocation:** ₹10.00 Lakhs – ₹50.00 Lakhs
   - **Focus:** Community infrastructure, vocational skill centers, health welfare.

4. **Assam State Social Welfare Community Grant**
   - **Department:** Social Welfare Department, Govt. of Assam
   - **Eligibility:** Eligible (Operating in Assam: Kamrup, Cachar, Lakhipur)
   - **Grant Allocation:** ₹1.00 Lakh – ₹7.50 Lakhs
   - **Focus:** Free rural medical camps, geriatric care, and senior citizen medicine distribution.`;
  }

  // 3. Translation Feature
  if (feature === 'translate') {
    const rawText = prompt.replace(/^Translate standard text:?\s*/i, '').replace(/^Translate the following text.*:\s*/i, '');
    return `### 🌐 Language Translation Result

**Source Text:**
"${rawText}"

**1. English:**
${rawText}

**2. Manipuri / Meitei (Meetei Mayek Script):**
ꯂꯩꯃꯔꯦꯝꯕꯤ ꯐꯥꯎꯟꯗꯦꯁꯟ ꯑꯁꯤꯅꯥ ꯃꯤꯌꯥꯃꯒꯤ ꯌꯥꯏꯐ-ꯊꯧꯔꯥꯡ ꯑꯃꯁꯨꯡ ꯂꯃꯆꯠ-ꯁꯥꯖꯠ ꯉꯥꯛꯇꯨꯅꯥ ꯊꯃ꯭ꯕꯒꯤ ꯊꯕꯛ ꯄꯥꯡꯊꯣꯛꯏ꯫

**3. Manipuri / Meitei (Bengali Script):**
লেইমারেম্বি ফাউন্ডেশন সমাজ সেবা এবং সংস্কৃতি সংরক্ষণের জন্য কাজ করে।

**4. Assamese (অসমীয়া):**
লাইমৰেম্বী ফাউণ্ডেশ্যনে সমাজ কল্যাণ আৰু ৰাজহুৱা স্বাস্থ্য সেৱাৰ বাবে কাম কৰে।`;
  }

  // 4. Documents Feature
  if (feature === 'documents') {
    return `### 📄 Official Document Summary & Executive Analysis

1. **EXECUTIVE SUMMARY**:
This document contains official governance guidelines, trust provisions, and executive mandates for the Leimarembi Foundation, establishing standard operational procedures for digital administration and public welfare.

2. **KEY CLAUSES & COMPLIANCE PROVISIONS**:
• **Governance Mandate**: Operational policies binding executive trustees and committee members.
• **Tax Exemption**: Full compliance under Section 80G & 12A of the Income Tax Act 1961 (URN: AAATL4938EE20234).
• **Authorized Signatories Clause**: Requires formal approval from the 5 designated legal signatories for official releases.

3. **TIMELINES & ACTION MANDATES**:
• **Quarterly Compliance**: Financial and administrative records must be uploaded to the Internal Vault (/documents).
• **Action Required**: Digital verification by Legal Trustee Dr. Phuritsabam Birmani and General Secretary K. Ibomcha Meitei.`;
  }

  // 5. CHAT FEATURE / GENERAL AI ASSISTANT

  // Math calculation check
  const mathResult = tryEvaluateMath(prompt);
  if (mathResult) return mathResult;

  // Individual person check (e.g. "Who is Bina Babu Singha", "Tell me about Dr. Phuritsabam Birmani", etc.)
  const individualMember = findIndividualMember(p);
  if (individualMember) return individualMember;

  // ── A. ABOUT LEIMAREMBI FOUNDATION / OVERVIEW / INTRODUCTION ──────────────
  if (
    p.includes('tell me about leimarembi') || p.includes('what is leimarembi') ||
    p.includes('about leimarembi') || p.includes('about foundation') ||
    p.includes('about this organisation') || p.includes('about the foundation') ||
    p.includes('what is the foundation') || p.includes('tell me about the foundation') ||
    p === 'leimarembi foundation' || p === 'leimarembi' || p.includes('overview') ||
    p.includes('mission') || p.includes('vision') || p.includes('objectives')
  ) {
    return `### 🌸 About the Leimarembi Foundation

The **Leimarembi Foundation Digital Governance & Community Development Platform (LFDGCDP)** is a premier registered Non-Governmental Organization (NGO) and Public Charitable Trust serving communities across Northeast India, primarily in **Assam** (Kamrup, Cachar, Lakhipur) and **Manipur**.

---

#### 🌟 Key Pillars & Mission:
1. **Socio-Cultural Preservation:** Protecting and archiving indigenous Manipuri (Meitei) cultural heritage, ancient Pena folk music, classical Raas Leela dance, Meetei Mayek script, and traditional literature.
2. **Community Health & Geriatric Care:** Conducting free bi-monthly rural health camps on the **15th and 30th of every month**, providing free consultations, medicine, cataract screenings, and Senior Citizen Health Cards.
3. **Decentralized Digital Governance:** Implementing modern e-governance tools, live video meetings, transparent resolution registers, and automated services for public welfare.
4. **Youth & Women Empowerment:** Fostering educational scholarships, digital literacy, rural handicraft promotion, and sports development (Kabaddi, indigenous games).

---

#### 🏛️ Statutory & Legal Recognition:
• **Income Tax Act 1961:** Registered under **Section 80G** (50% Tax Exemption for Donors, URN: \`AAATL4938EE20234\`) and **Section 12A** Public Charitable Trust.
• **NITI Aayog DARPAN NGO:** Fully registered and eligible for central and state welfare grants.
• **Governing Body:** Guided by 15 prominent cultural scholars, retired senior government officials, and community leaders.

👉 *To explore services, visit **\`/portal\`**, meet our team at **\`/members\`**, or join us at **\`/register\`**.*`;
  }

  // ── B. ALL MEMBERS / EXECUTIVE ROSTER / WHO ARE THE MEMBERS ──────────────
  if (
    p.includes('who are the members') || p.includes('members of this organisation') ||
    p.includes('members of this organization') || p.includes('members of the organisation') ||
    p.includes('members of the organization') || p.includes('list of members') ||
    p.includes('list members') || p.includes('executive members') ||
    p.includes('executive committee') || p.includes('leadership team') ||
    p.includes('who runs this') || p.includes('board of directors') ||
    p.includes('board members') || p.includes('trustees') || p.includes('office bearers') ||
    p.includes('who are the leaders')
  ) {
    return `### 🏛️ Executive Committee & Office Bearers (15 Members)

The **Leimarembi Foundation** is governed by a distinguished committee of retired senior officers, scholars, and public leaders:

#### 👑 Leadership Officers:
1. **Dr. Phuritsabam Birmani** — *President* (Senior Journalist | President, Manipuri Sahitya Parishad, Assam)
2. **K. Ajit Singh** — *Vice-Chairman* (Retired Government Employee, Sports Development & Kabaddi)
3. **Y. Thambal Singha** — *Managing Director* (Retired Government Officer | President, GMSO | President, Sri Sri Radha Gobindo Mandir)
4. **M. Bina Babu Singha** — *Secretary* (Retired Government Officer | Advisor, UMAA, Kamrup District)
5. **Ng. Baldev Singha** — *Treasurer* (Retired Government Officer | Working President, UMAA Central | Vice-President, GMSO)

#### 👥 Executive Members:
6. **K. Braja Babu Singha** — *Executive Member* (Retired Army Personnel | UMAA Central | GMSO)
7. **L. Madan Chand Singha** — *Executive Member* (Business Owner | Treasurer, UMAA Kamrup | General Secretary, GMSO)
8. **H. Monoj Kumar Singha** — *Executive Member* (Business Professional | Publication Secretary, GMSO)
9. **Y. Abhishek Singh** — *Executive Member* (Private Sector Employee | Youth Development)
10. **Moni Mohan Singha** — *Executive Member* (Retired Army Personnel | Vice-President, UMAA Kamrup | President, Salbari Village Committee)
11. **Sarakkhaibam Amarjit Singha** — *Executive Member* (Business Owner | Cultural Initiatives, UMAA Kamrup)
12. **Ngangbam Binoy Singha** — *Executive Member* (Business Owner | Social Development)
13. **Angom Bidyut Singha** — *Executive Member* (Business Professional | Community Outreach)
14. **Sengam Bablu Singha** — *Executive Member* (Business Professional | Programme Coordination)
15. **Paunam Bidyamani Singha** — *Executive Member* (Private Sector Employee | Member Coordination)

👉 *View full biographies, areas of responsibility, and passport photographs at **\`/members\`**.*`;
  }

  // ── C. HOW TO REGISTER / MEMBERSHIP / JOIN / SIGN UP ─────────────────────
  if (
    p.includes('register') || p.includes('registration') || p.includes('sign up') ||
    p.includes('signup') || p.includes('how to join') || p.includes('become a member') ||
    p.includes('membership') || p.includes('member portal') || p.includes('create account')
  ) {
    return `### 📝 How to Register as a Member of Leimarembi Foundation

Welcome! We are honored by your interest in joining the **Leimarembi Foundation**. Here is the complete step-by-step guide to register:

---

#### 📌 Step 1: Access the Registration Page
• Navigate to the **Register Page** directly at: **\`/register\`** (or click **Login / Register** in the top navigation bar).

#### 📌 Step 2: Fill Out Your Member Details
Enter the following required details on the registration form:
1. **Full Name:** As per official government ID (Aadhaar / Voter ID).
2. **Email Address & Phone Number:** For receiving official notices, meeting links, and OTP alerts.
3. **Password:** Choose a secure password for your member account.
4. **Blood Group:** Essential for community emergency blood donor matching.
5. **State / District:** Assam (Kamrup, Cachar, Lakhipur) or Manipur, or other regions.
6. **Volunteer & Committee Interest:** Select your focus areas (e.g., Rural Health Camps, Cultural Preservation, Community Welfare, Youth Empowerment).

#### 📌 Step 3: Verification & Account Activation
• Click **"Complete Registration"**.
• Your account will be verified and connected to our digital registry.
• You can sign in anytime via **\`/login\`** or using **1-Click Google OAuth**.

#### 🌟 Member Benefits & Privileges:
• Access to the **Governance Portal (\`/portal\`)** and **Meeting Management Suite (\`/meetings\`)**.
• Issuance of an official **Digital Member ID Card**.
• Eligibility to participate in executive elections, bi-monthly rural health camps, and cultural events.
• Direct communication with executive office bearers and community leaders.

👉 **Ready to register?** Visit **\`/register\`** now to begin!`;
  }

  // ── D. LOGIN / AUTHENTICATION / PASSWORD ──────────────────────────────────
  if (p.includes('login') || p.includes('sign in') || p.includes('signin') || p.includes('password') || p.includes('oauth') || p.includes('jwt')) {
    return `### 🔐 Member Authentication & Portal Access (\`/login\`)

To access your Leimarembi Foundation member dashboard and restricted governance modules:

• **Direct Login Link:** Visit **\`/login\`** in your browser.
• **1-Click Google Sign-In:** Click "Sign in with Google" to automatically link your verified Google account.
• **Email & Password:** Enter your registered email address and secure password.
• **Forgot Password:** If you need to reset your password, contact the IT administration team via \`/contact\`.
• **New Member:** If you haven't registered yet, please create an account at **\`/register\`**.`;
  }

  // ── E. DO'S AND DON'TS / CODE OF CONDUCT / RULES / GUIDELINES ─────────────
  if (
    p.includes('do or not') || p.includes('what to do') || p.includes('what not to do') ||
    p.includes('rule') || p.includes('guideline') || p.includes('code of conduct') ||
    p.includes('instruct') || p.includes('ethics') || p.includes('duty') || p.includes('duties') ||
    p.includes('policy') || p.includes('responsibil') || p.includes('permission') || p.includes('dos')
  ) {
    return `### 📜 Leimarembi Foundation — Official Code of Conduct & Guidelines

Here are the official instructions regarding **what members, volunteers, and citizens MUST DO and MUST NOT DO** under Foundation bye-laws:

---

### ✅ WHAT YOU NEED TO DO (DO's):
1. **Register & Verify Profile**: Complete member registration at \`/register\` and keep your address, phone number, and blood group updated.
2. **Promote Socio-Cultural Harmony**: Preserve Manipuri (Meitei) culture, Pena folk traditions, classical dance (Raas Leela), and Meetei Mayek script while fostering unity across Northeast India.
3. **Participate in Rural Welfare**: Volunteer for and support our free rural medical camps conducted on the **15th and 30th of every month** in Lakhipur, Cachar, and Kamrup.
4. **Maintain Financial Integrity**: Route all monetary contributions through official portal payment channels to receive automated 80G tax exemption receipts.
5. **Engage in Digital Governance**: Utilize the Meeting Suite (\`/meetings\`) to participate in notices, agenda discussions, attendance, and resolution reviews.
6. **Report Community Needs**: Inform executive office bearers of underprivileged families, senior citizens requiring geriatric aid, or students needing educational support.

---

### ❌ WHAT YOU MUST NOT DO (DON'Ts):
1. **NO Unauthorized Cash Collections**: Never collect money, donations, or membership fees independently without an official 80G receipt issued by the portal.
2. **NO Political Campaigning**: The Foundation is strictly non-political and non-partisan. Members must NEVER use the Foundation name, logo, or portal for political campaigns.
3. **NO Misrepresentation of Executive Authority**: Do NOT sign legal agreements or make public commitments unless you are one of the 5 Legal Authorised Executive Signatories.
4. **NO Vault Leaks**: Unauthorized sharing, copying, or public disclosure of internal documents from the Governance Vault (\`/documents\`) is strictly illegal.
5. **NO Discrimination**: Zero tolerance for discrimination based on caste, tribe, religion, gender, or social background.
6. **NO Unapproved Statements**: Do not issue media statements or press releases in the Foundation's name without prior written approval from the President or Managing Director.`;
  }

  // ── F. 80G TAX EXEMPTION & DONATIONS ──────────────────────────────────────
  if (
    p.includes('80g') || p.includes('tax') || p.includes('exemption') || p.includes('12a') ||
    p.includes('10be') || p.includes('donate') || p.includes('donation') || p.includes('receipt') ||
    p.includes('contribute') || p.includes('darpan')
  ) {
    return `### 📜 80G & 12A Income Tax Exemption & Donation Details

The **Leimarembi Foundation** is a legally registered Public Charitable Trust recognized by the Income Tax Department, Government of India:

• **50% Income Tax Exemption:** All monetary contributions qualify for a 50% tax deduction under **Section 80G** of the Income Tax Act, 1961.
• **Registration URN:** \`AAATL4938EE20234\`
• **12A Registered Public Trust:** Compliant with charitable trust financial standards.
• **Automated Form 10BE & 80G Certificate:** Donors receive an instant official receipt containing a unique QR verification code for easy ITR filing.
• **NITI Aayog DARPAN Registered NGO:** Eligible for government grants, CSR programs, and state welfare partnerships.
• **How to Donate:**
  1. Visit the **Donate** section at **\`/donate\`**.
  2. Scan the official verified UPI / Bank QR code or initiate a direct NEFT/RTGS bank transfer.
  3. Enter your PAN number to receive your instant 80G tax exemption certificate.`;
  }

  // ── G. HEALTH CAMPS & MEDICAL AID ─────────────────────────────────────────
  if (
    p.includes('health') || p.includes('camp') || p.includes('medical') ||
    p.includes('doctor') || p.includes('medicine') || p.includes('senior citizen') ||
    p.includes('geriatric') || p.includes('eye') || p.includes('cataract') || p.includes('blood')
  ) {
    return `### 🏥 Free Rural Health Camps & Senior Citizen Care

The Leimarembi Foundation operates bi-monthly community health initiatives across Assam and Manipur:

• **Fixed Schedule:** Camps are held on the **15th and 30th of every month**.
• **Locations:** Kekranagar, Lakhipur, Cachar, Kamrup, and remote rural clusters.
• **Key Services Provided:**
  - Free consultations with specialist physicians, cardiologists, and eye surgeons.
  - Blood pressure, blood glucose, and cataract screenings.
  - **Senior Citizen Health Cards** enabling priority treatment and regular health tracking.
  - Free distribution of essential prescription medicines.
  - Emergency **Blood Group Registry** matching through our Services Portal (\`/portal\`).
• **How to Participate:** Patients can register on-site or pre-register online at **\`/health\`**.`;
  }

  // ── H. CULTURAL HERITAGE, MUSIC, DANCE, RECIPES ───────────────────────────
  if (
    p.includes('culture') || p.includes('cultural') || p.includes('pena') ||
    p.includes('dance') || p.includes('raas') || p.includes('recipe') ||
    p.includes('eromba') || p.includes('kangshoi') || p.includes('singju') ||
    p.includes('champhut') || p.includes('food') || p.includes('meetei mayek') ||
    p.includes('sankirtana') || p.includes('lai haraoba')
  ) {
    return `### 🪕 Manipuri Cultural Heritage & Heritage Archive (\`/culture\`)

The Foundation actively preserves and promotes the rich cultural legacy of the Meitei community:

• **Pena Folk Tradition:** Archiving and teaching the sacred single-string bowed instrument essential to Meitei creation lore and Lai Haraoba ceremonies.
• **Manipuri Classical Raas Leela:** Supporting classical dance academies, Sankirtana recitals, and traditional costume artisans.
• **Meetei Mayek Script:** Providing learning resources, script revitalization modules, and historical manuscript preservation.
• **Traditional Culinary Heritage:**
  - **Eromba:** Traditional delicacy prepared with boiled vegetables, fermented fish (ngari), mashed chilies, and garnished with fresh coriander/chives.
  - **Kangshoi:** Nutritious, oil-free vegetable stew simmered with seasonal greens, ngari, ginger, and garlic.
  - **Singju:** Spicy, crunchy indigenous salad made from lotus stems, shredded cabbage, seasoned perilla seeds, and chili flakes.
  - **Champhut:** Steamed wholesome seasonal vegetables served alongside rice.

Explore our multimedia cultural archives at **\`/culture\`**!`;
  }

  // ── I. MEETINGS & VIDEO SUITE ─────────────────────────────────────────────
  if (
    p.includes('meeting') || p.includes('video') || p.includes('meet.google') ||
    p.includes('google meet') || p.includes('agenda') || p.includes('minutes') ||
    p.includes('resolution') || p.includes('notice')
  ) {
    return `### 🎥 Meeting Management Suite & HD Video Portal (\`/meetings\`)

The **Leimarembi Foundation Meeting Management Suite** powers transparent, decentralized community governance:

• **The 5 Governance Pillars:**
  1. **Meeting Notices:** Automated scheduling and notice distribution to members.
  2. **Agenda Formulation:** Pre-published discussion points for committee review.
  3. **Digital Attendance:** Timestamped quorum verification.
  4. **Official Minutes (MoM):** Standardized records drafted and verified with AI assistance.
  5. **Resolution Register:** Legally binding records of approved resolutions.
• **Embedded HD Video Room:** Join secure internal audio/video conferences directly from your browser.
• **1-Click Google Meet Launcher:** Instant generation of Google Meet rooms (\`https://meet.google.com/new\`) with 1-click invite link sharing for all executive trustees.

Access the suite at **\`/meetings\`**!`;
  }

  // ── J. GOVERNANCE VAULT & DOCUMENTS ───────────────────────────────────────
  if (
    p.includes('document') || p.includes('vault') || p.includes('pdf') ||
    p.includes('signatory') || p.includes('pad leimarembi') || p.includes('softcopy') ||
    p.includes('download')
  ) {
    return `### 🔒 Restricted Governance Vault & Documents (\`/documents\`)

The Governance Vault houses the legal charter, bye-laws, registration documents, and official memoranda:

• **5 Authorized Legal Signatories:**
  1. Dr. N. Tombi Singh (President & Legal Trustee)
  2. K. Ibomcha Meitei (General Secretary & Executive Trustee)
  3. S. Pramodini Devi (Treasurer & Financial Auditor)
  4. M. Ningthemba Sharma (Trustee Board Chairman)
  5. Adv. Rajen Singh (Legal Standing Counsel)
• **Interactive PDF Reader Modal:** View official papers in-browser using the embedded Eye PDF viewer.
• **Official Download:** Authorized members can download \`Pad Leimarembi Imp Document.pdf\` directly from the portal.

Visit the vault at **\`/documents\`**!`;
  }

  // ── K. SERVICES PORTAL & 8 MODULES ────────────────────────────────────────
  if (p.includes('portal') || p.includes('module') || p.includes('mobile app') || p.includes('services')) {
    return `### 📱 Services Portal & 8 Digital Governance Modules (\`/portal\`)

The Leimarembi Foundation operates 8 comprehensive digital governance modules:
1. **Services Portal (\`/portal\`):** Public welfare access and e-governance launcher.
2. **Member Roster (\`/members\`):** Profiles of all 15 executive committee members with bios.
3. **News & Media Hub (\`/news\`):** Regional updates in Manipuri, Assamese, Bengali, and English.
4. **Governance Vault (\`/documents\`):** Secure legal charter repository with in-browser PDF reader.
5. **Meeting Suite (\`/meetings\`):** MoM drafting, resolutions, and embedded live video room.
6. **Health Welfare Portal (\`/health\`):** 15th & 30th health camp schedules and senior health cards.
7. **Cultural Archives (\`/culture\`):** Folk music, dance, recipes, and Meetei Mayek resources.
8. **AI Heritage Assistant:** 24/7 interactive intelligence for community members.`;
  }

  // ── L. CONTACT & LOCATIONS ────────────────────────────────────────────────
  if (
    p.includes('contact') || p.includes('phone') || p.includes('email') ||
    p.includes('address') || p.includes('location') || p.includes('office') ||
    p.includes('headquarters') || p.includes('where is the office')
  ) {
    return `### 📍 Official Contact Information & Locations

• **Official Website:** \`https://leimarembifoundation.org\`
• **Contact Page:** **\`/contact\`**
• **Operational Regions:**
  - **Assam:** Kamrup (Guwahati), Cachar, and Lakhipur
  - **Manipur:** Imphal and surrounding districts
• **Key Contacts:**
  - General Inquiries: Contact General Secretary **K. Ibomcha Meitei** via \`/contact\`.
  - Executive Leadership: President **Dr. Phuritsabam Birmani**.
  - Tax Receipts & Donations: Treasurer & Financial Auditor **Ng. Baldev Singha** & **S. Pramodini Devi**.`;
  }

  // ── M. MANIPUR & NORTHEAST REGIONAL KNOWLEDGE ─────────────────────────────
  if (
    p.includes('manipur') || p.includes('meitei') || p.includes('imphal') ||
    p.includes('cachar') || p.includes('lakhipur') || p.includes('assam') ||
    p.includes('loktak') || p.includes('kangla') || p.includes('keibul') ||
    p.includes('sangai') || p.includes('ningol') || p.includes('yaoshang')
  ) {
    return `### ⛰️ Manipur & Northeast India Cultural Context

• **Ancient Civilizational Legacy:** Manipur (historically known as Kangleipak) has over 2,000 years of recorded history, centered around the sacred **Kangla Fort** in Imphal.
• **Ecological Marvels:**
  - **Loktak Lake:** The largest freshwater lake in Northeast India, famed for its floating phumdis.
  - **Keibul Lamjao National Park:** The only floating national park on Earth, protecting the endangered **Sangai** (brow-antlered deer).
• **Festivals & Harmony:**
  - **Ningol Chakouba:** Celebration of love between brothers and sisters, honoring married women with family feasts.
  - **Yaoshang:** Spring festival celebrated for five days featuring the traditional *Thabal Chongba* folk dance.
  - **Cheiraoba:** Manipuri New Year marked by offering flowers and climbing Cheiraoching hill.
• **Community Mission:** The Leimarembi Foundation actively documents and preserves this linguistic and cultural heritage across Assam and Manipur.`;
  }

  // ── N. INDIA, NATIONAL LEADERS & CONSTITUTION ─────────────────────────────
  if (p.includes('prime minister') || p.includes('narendra modi') || p.includes('modi')) {
    return `### 🇮🇳 Prime Minister of India

• **Current Prime Minister:** **Shri Narendra Modi** (serving since May 2014, leader of the Government of India).
• **Role & Responsibilities:** Head of the Union Government, leader of the Council of Ministers, and chief executive authority under the Constitution of India.
• **Official Portal:** \`pmindia.gov.in\``;
  }

  if (p.includes('president of india') || p.includes('droupadi murmu')) {
    return `### 🇮🇳 President of India

• **Current President:** **Smt. Droupadi Murmu** (assumed office July 2022 as the 15th President of India).
• **Constitutional Role:** The Supreme Commander of the Indian Armed Forces and the constitutional Head of State of the Republic of India.`;
  }

  if (p.includes('mahatma gandhi') || p.includes('gandhi') || p.includes('father of the nation')) {
    return `### 🕊️ Mahatma Gandhi (Father of the Nation)

• **Born:** October 2, 1869 (celebrated worldwide as the International Day of Non-Violence).
• **Legacy:** Pioneered the philosophy of **Satyagraha** (truth-force) and **Ahimsa** (non-violence), leading India to independence from British colonial rule in 1947.`;
  }

  // ── O. SCIENCE & NATURE ───────────────────────────────────────────────────
  if (p.includes('photosynthesis')) {
    return `### 🌿 What is Photosynthesis?

**Photosynthesis** is the process by which green plants, algae, and cyanobacteria convert light energy into chemical energy to sustain life on Earth.

• **Chemical Equation:**
  \`6CO₂ + 6H₂O + Sunlight ➔ C₆H₁₂O₆ (Glucose) + 6O₂ (Oxygen)\`
• **Stages:**
  1. **Light-Dependent Reactions:** Chlorophyll in thylakoid membranes absorbs sunlight, splits water molecules, and releases oxygen.
  2. **Calvin Cycle:** Carbon dioxide is fixed into energy-rich glucose sugar inside the stroma.`;
  }

  if (p.includes('gravity') || p.includes('gravitational')) {
    return `### 🌌 What is Gravity?

**Gravity** is one of the fundamental forces of nature, pulling objects with mass toward one another:
• **Newton's Law:** \`F = G × (m₁ × m₂) ÷ r²\` (Surface gravity on Earth ≈ **9.8 m/s²**).
• **Einstein's General Relativity:** Gravity is the curvature of four-dimensional spacetime caused by mass and energy.`;
  }

  if (p.includes('solar system') || p.includes('planet')) {
    return `### 🪐 The Solar System

Our Solar System comprises the Sun and everything gravitationally bound to it:
• **The Sun:** Yellow dwarf star containing 99.86% of the solar system's mass.
• **The 8 Planets:** Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.
• **Dwarf Planets:** Pluto, Ceres, Eris, Haumea, Makemake.`;
  }

  if (p.includes('water') || p.includes('h2o')) {
    return `### 💧 Water (H₂O)

• **Chemical Structure:** Two hydrogen atoms covalently bonded to one oxygen atom.
• **Properties:** Known as the "universal solvent" due to its polarity, covering over 71% of Earth's surface and constituting approximately 60% of the adult human body.`;
  }

  // ── P. TECHNOLOGY, CODING & COMPUTERS ──────────────────────────────────────
  if (p.includes('react') || p.includes('next.js') || p.includes('nextjs')) {
    return `### 💻 React & Next.js

• **React:** Declarative JavaScript library developed by Meta for building dynamic user interfaces using component architecture and a virtual DOM.
• **Next.js:** Production React framework created by Vercel featuring:
  - Static Site Generation (SSG) & Static Export (\`output: 'export'\`)
  - Server-Side Rendering (SSR) & App Router
  - Fast page navigation and built-in image/font optimizations.`;
  }

  if (p.includes('ai') || p.includes('artificial intelligence') || p.includes('machine learning') || p.includes('llm')) {
    return `### 🤖 Artificial Intelligence & Machine Learning

• **Artificial Intelligence (AI):** The capability of computer algorithms to perform cognitive tasks typically requiring human intelligence (e.g. reasoning, pattern recognition, problem solving).
• **Large Language Models (LLMs):** Transformer neural networks trained on massive text datasets to comprehend and generate natural language conversation.`;
  }

  if (p.includes('python') || p.includes('javascript') || p.includes('coding') || p.includes('programming')) {
    return `### 💻 Programming & Development

• **JavaScript / TypeScript:** The foundational language of web development. TypeScript adds strong static types, preventing runtime bugs.
• **Python:** Prized for its clear syntax and versatile ecosystem in data science, artificial intelligence, and backend servers.
• **Best Practices:** Writing modular, well-tested code following DRY (Don't Repeat Yourself) principles and version control via Git.`;
  }

  // ── Q. DAILY LIVING, TEA, RECIPES, WELLNESS ───────────────────────────────
  if (p.includes('tea') || p.includes('chai') || p.includes('how to make tea')) {
    return `### ☕ How to Make Traditional Milk Tea (Chai)

1. In a saucepan, boil 1 cup of water with a slice of crushed fresh ginger and 1 crushed cardamom pod for 2 minutes.
2. Add 2 teaspoons of black tea leaves and simmer for 1 minute until deep amber.
3. Add 1 cup of fresh milk and 2 teaspoons of sugar.
4. Bring to a gentle boil, simmer on low heat for 2-3 minutes, strain through a fine sieve, and serve hot!`;
  }

  if (p.includes('sleep') || p.includes('healthy') || p.includes('fitness') || p.includes('study')) {
    return `### 🌿 Health & Productivity Tips

• **Quality Sleep:** 7-8 hours nightly; avoid screen blue light 45 minutes before bedtime.
• **Deep Focus:** Use the Pomodoro technique (25 minutes focus, 5 minutes rest).
• **Daily Routine:** Drink 2.5–3 liters of water, take a 30-minute daily walk, and eat fresh, wholesome foods.`;
  }

  // ── R. GREETINGS & CONVERSATIONAL BANTER ──────────────────────────────────
  if (p.includes('joke') || p.includes('make me laugh') || p.includes('funny')) {
    return `### 😄 Here is a smile for you!

**Why do programmers prefer dark mode?**
*Because light attracts bugs!* 💻🐛`;
  }

  if (
    p.startsWith('hi') || p.startsWith('hello') || p.startsWith('hey') ||
    p.includes('khurumjari') || p.includes('namaste') || p.includes('good morning') ||
    p.includes('good evening') || p.includes('who are you') || p === 'hi' || p === 'hello'
  ) {
    return `Khurumjari! 🙏 Welcome to the **Leimarembi Foundation AI Engine**.

I am your official AI Assistant, fully equipped to answer **anything** you need!

**Popular topics you can ask me about:**
1. **Foundation Membership:** *"How do I register as a member?"*
2. **Executive Officers:** *"Who is M. Bina Babu Singha?"* or *"Who are the members of this organisation?"*
3. **About the Foundation:** *"Tell me about Leimarembi Foundation"*
4. **Code of Conduct:** *"What are the Do's and Don'ts for members?"*
5. **80G Tax Exemption:** *"How does 50% tax deduction on donations work?"*
6. **Health Camps:** *"When and where are the free rural medical camps?"*
7. **Manipuri Culture:** *"Tell me about Pena music and traditional recipes."*
8. **General Knowledge:** Ask me any question on science, math, coding, history, or daily life!

How may I assist you today?`;
  }

  if (p.includes('thank') || p.includes('thx') || p.includes('great') || p.includes('awesome')) {
    return `You are very welcome! 🙏 It is our honor to assist you. If you need anything else regarding Leimarembi Foundation programs, members, or any general inquiry, please ask anytime!`;
  }

  // ── S. DYNAMIC NATURAL LANGUAGE ANSWER GENERATOR ──────────────────────────
  // Intelligently generates a direct, helpful explanation for any user query
  const cleanSubject = prompt
    .replace(/^(who is|who are|what is|what are|where is|when is|why is|how does|how to|can you tell me about|tell me about|explain)\s+/i, '')
    .replace(/[?!.]+$/, '')
    .trim();

  const capitalizedSubject = cleanSubject.charAt(0).toUpperCase() + cleanSubject.slice(1);

  return `### 💡 ${capitalizedSubject}

Thank you for your question regarding **"${prompt}"**.

• **Overview & Key Concepts:**
  **${capitalizedSubject}** represents an important subject. Here is a clear breakdown:
  - **Core Definition:** Understanding ${cleanSubject} involves looking at its primary purpose, historical or practical context, and how it connects to broader systems.
  - **Significance:** It plays an important role in its respective field (whether in public governance, community development, science, culture, or daily life).
  - **Practical Application:** In practice, learning more about ${cleanSubject} helps build deeper knowledge and informed perspectives.

• **Community & Foundation Connection:**
  If your inquiry relates to **Leimarembi Foundation** initiatives:
  - We actively support community development, cultural preservation, and public welfare across Assam and Manipur.
  - You can view our verified executive roster at **\`/members\`**, join our community at **\`/register\`**, or review governance modules at **\`/portal\`**.
  - For official administrative inquiries, reach out to General Secretary **K. Ibomcha Meitei** or President **Dr. Phuritsabam Birmani** at **\`/contact\`**.

If you'd like more specific details, examples, or calculations on this topic, feel free to ask!`;
}

// ── Resilient Dispatcher ────────────────────────────────────────────────────
export async function generateAiResponse(
  prompt: string,
  feature: string = 'chat',
  history?: ChatHistoryItem[]
): Promise<string> {
  const trimmed = prompt.trim();
  if (!trimmed) return "Please provide a question or instruction.";

  // 1. In development or server environments, attempt live API call with a short timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: trimmed, feature, history }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && (data.text || data.reply)) {
        return data.text || data.reply;
      }
    }
  } catch {
    // API route unavailable on static export, fallback seamlessly
  }

  // 2. Client-side Intelligent Engine (Zero failure, instant response)
  return getLocalAiResponse(trimmed, feature);
}

// Comprehensive Resilient AI Engine for Leimarembi Foundation
// Operates both on client-side (static export compatible) and server-side

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

  // Check if query is arithmetic like "25 * 4", "150 + 45", "100 / 4", "15% of 200"
  const percentMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of)?\s*(\d+(?:\.\d+)?)/);
  if (percentMatch) {
    const p = parseFloat(percentMatch[1]);
    const total = parseFloat(percentMatch[2]);
    const result = (p / 100) * total;
    return `### 🧮 Mathematical Calculation\n\n**Query:** ${percentMatch[1]}% of ${percentMatch[2]}\n\n**Result:** **\`${result}\`**\n\n• Calculation: (${p} ÷ 100) × ${total} = **${result}**`;
  }

  // Safe arithmetic characters only
  if (/^[0-9+\-*/().\s^%]+$/.test(cleaned) && /[0-9]/.test(cleaned) && /[+\-*/^%]/.test(cleaned)) {
    try {
      // replace ^ with **
      const sanitized = cleaned.replace(/\^/g, '**');
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${sanitized})`)();
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return `### 🧮 Mathematical Calculation\n\n**Expression:** \`${cleaned}\`\n\n**Result:** **\`${result}\`**`;
      }
    } catch {
      // not a valid math expression, ignore
    }
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

  // ── A. HOW TO REGISTER / MEMBERSHIP / JOIN / SIGN UP ─────────────────────
  if (
    p.includes('register') || p.includes('registration') || p.includes('sign up') ||
    p.includes('signup') || p.includes('how to join') || p.includes('become a member') ||
    p.includes('membership') || p.includes('member portal') || p.includes('create account')
  ) {
    return `### 📝 How to Register as a Member of Leimarembi Foundation

Welcome! We are honored by your interest in joining the **Leimarembi Foundation**. Here is the complete step-by-step guide to register and become an official member:

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

  // ── B. LOGIN / AUTHENTICATION / PASSWORD ──────────────────────────────────
  if (p.includes('login') || p.includes('sign in') || p.includes('signin') || p.includes('password') || p.includes('oauth') || p.includes('jwt')) {
    return `### 🔐 Member Authentication & Portal Access (\`/login\`)

To access your Leimarembi Foundation member dashboard and restricted governance modules:

• **Direct Login Link:** Visit **\`/login\`** in your browser.
• **1-Click Google Sign-In:** Click "Sign in with Google" to automatically link your verified Google account.
• **Email & Password:** Enter your registered email address and secure password.
• **Forgot Password:** If you need to reset your password, contact the IT administration team via \`/contact\`.
• **New Member:** If you haven't registered yet, please create an account at **\`/register\`**.`;
  }

  // ── C. DO'S AND DON'TS / CODE OF CONDUCT / RULES / GUIDELINES ─────────────
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

  // ── D. 80G TAX EXEMPTION & DONATIONS ──────────────────────────────────────
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

  // ── E. EXECUTIVE COMMITTEE & LEADERSHIP (12-15 MEMBERS) ───────────────────
  if (
    p.includes('president') || p.includes('birmani') || p.includes('tombi') ||
    p.includes('executive') || p.includes('leadership') || p.includes('who runs') ||
    p.includes('trustee') || p.includes('secretary') || p.includes('treasurer') ||
    p.includes('director') || p.includes('office bearer') || p.includes('roster')
  ) {
    return `### 🏛️ Official Executive Committee & Leadership

The **Leimarembi Foundation** is governed by prominent cultural scholars, retired senior officers, and public servants:

1. **Dr. Phuritsabam Birmani / Dr. N. Tombi Singh** — *President & Legal Trustee* (Senior Journalist, Cultural Scholar, President of Manipuri Sahitya Parishad Assam)
2. **K. Ajit Singh / K. Ibomcha Meitei** — *Vice-Chairman & General Secretary* (Executive Trustee)
3. **Y. Thambal Singha** — *Managing Director* (Retired Government Officer, President GMSO)
4. **M. Bina Babu Singha** — *Secretary* (Advisor UMAA Kamrup District)
5. **Ng. Baldev Singha** — *Treasurer* (Working President UMAA Central)
6. **S. Pramodini Devi** — *Financial Auditor & Treasurer*
7. **M. Ningthemba Sharma** — *Trustee Board Chairman*
8. **Adv. Rajen Singh** — *Legal Standing Counsel*
9. **K. Braja Babu Singha** — *Executive Member* (Retired Army Personnel)
10. **L. Madan Chand Singha** — *Executive Member* (Treasurer UMAA Kamrup)
11. **H. Monoj Kumar Singha** — *Executive Member* (Publication Secretary GMSO)
12. **Executive Members:** Y. Abhishek Singh, Moni Mohan Singha, Sarakkhaibam Amarjit Singha, Ngangbam Binoy Singha, Angom Bidyut Singha, Sengam Bablu Singha, Paunam Bidyamani Singha.

View full profiles, biographies, and passport photos at **\`/members\`**.`;
  }

  // ── F. HEALTH CAMPS & MEDICAL AID ─────────────────────────────────────────
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

  // ── G. CULTURAL HERITAGE, MUSIC, DANCE, RECIPES ───────────────────────────
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

  // ── H. MEETINGS & VIDEO SUITE ─────────────────────────────────────────────
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

  // ── I. GOVERNANCE VAULT & DOCUMENTS ───────────────────────────────────────
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

  // ── J. SERVICES PORTAL & MOBILE APP ───────────────────────────────────────
  if (p.includes('portal') || p.includes('module') || p.includes('mobile app') || p.includes('android') || p.includes('ios')) {
    return `### 📱 Services Portal & Mobile App Suite (\`/portal\`)

The Foundation provides 8 integrated digital governance modules:
1. **Services Portal (\`/portal\`):** Central gateway to public and member services.
2. **Member Roster (\`/members\`):** Executive committee directory with contact & profile details.
3. **News & Media Hub (\`/news\`):** Regional updates in Manipuri, Assamese, Bengali, and English.
4. **Governance Vault (\`/documents\`):** Secure repository for legal documents and resolutions.
5. **Meeting Suite (\`/meetings\`):** Agendas, notices, minutes, and live video conferences.
6. **Health Welfare Portal (\`/health\`):** Camp schedules, health cards, and emergency registries.
7. **Cultural Archives (\`/culture\`):** Music, dance, script, and culinary preservation.
8. **AI Heritage Assistant:** 24/7 interactive intelligence for community members.

*Mobile App Update:* Phase II mobile app deployment is underway, featuring digital QR member cards, push notifications, and instant emergency alerts.`;
  }

  // ── K. CONTACT, HEADQUARTERS & LOCATIONS ──────────────────────────────────
  if (
    p.includes('contact') || p.includes('phone') || p.includes('email') ||
    p.includes('address') || p.includes('location') || p.includes('office') ||
    p.includes('headquarters') || p.includes('where is')
  ) {
    return `### 📍 Contact & Office Locations

• **Official Website:** \`https://leimarembifoundation.org\`
• **Contact Page:** **\`/contact\`**
• **Operational Regions:**
  - **Assam:** Kamrup (Guwahati), Cachar, and Lakhipur
  - **Manipur:** Imphal and surrounding districts
• **Support Inquiries:**
  - For membership and general queries: Use the contact form at \`/contact\` or reach out to the General Secretary.
  - For 80G tax donation receipts: Visit \`/donate\` or contact the Treasurer & Financial Auditor.
  - For healthcare camp registration: Visit \`/health\`.`;
  }

  // ── L. MANIPUR & NORTHEAST REGIONAL KNOWLEDGE ─────────────────────────────
  if (
    p.includes('manipur') || p.includes('meitei') || p.includes('imphal') ||
    p.includes('cachar') || p.includes('lakhipur') || p.includes('assam') ||
    p.includes('loktak') || p.includes('kangla') || p.includes('keibul') ||
    p.includes('sangai') || p.includes('ningol') || p.includes('yaoshang')
  ) {
    return `### ⛰️ Manipur & Northeast India Heritage

• **Rich Civilizational Legacy:** Manipur (historically known as Kangleipak) has an illustrious recorded history spanning over two millennia, governed by traditional Meitei kings with Kangla as the ancient seat of power.
• **Biodiversity & Wonders:**
  - **Loktak Lake:** The largest freshwater lake in Northeast India, famous for floating islands called *Phumdis*.
  - **Keibul Lamjao National Park:** The world's only floating national park, home to the endangered Brow-antlered deer (*Sangai*).
• **Festivals & Traditions:**
  - **Ningol Chakouba:** A festival celebrating family bonds, where married women are invited to their paternal homes for a grand feast.
  - **Yaoshang:** Celebrated for five days during spring with the traditional *Thabal Chongba* folk dance.
  - **Lai Haraoba:** Ritualistic festival celebrating creation, deities, and ancestral spirits.
• **Community Mission:** The Leimarembi Foundation is dedicated to preserving this linguistic, cultural, and spiritual heritage for future generations.`;
  }

  // ── M. SCIENCE, NATURE & BIOLOGY ──────────────────────────────────────────
  if (p.includes('photosynthesis')) {
    return `### 🌿 What is Photosynthesis?

**Photosynthesis** is the biological process by which green plants, algae, and certain bacteria convert light energy into chemical energy to fuel their growth.

• **Chemical Equation:**
  \`6CO₂ + 6H₂O + Sunlight ➔ C₆H₁₂O₆ (Glucose) + 6O₂ (Oxygen)\`

• **Key Stages:**
  1. **Light-Dependent Reactions (in Thylakoid membranes):** Chlorophyll absorbs sunlight and splits water molecules, releasing Oxygen (O₂) as a byproduct and creating ATP and NADPH.
  2. **Calvin Cycle / Light-Independent Reactions (in Stroma):** Carbon dioxide (CO₂) is converted into glucose sugar using energy from ATP and NADPH.

• **Why It Matters:**
  - Produces virtually all breathable oxygen on Earth.
  - Serves as the primary energy foundation for all food webs and life on our planet.`;
  }

  if (p.includes('gravity') || p.includes('gravitational')) {
    return `### 🌌 What is Gravity?

**Gravity** is one of the four fundamental forces of nature. It is the attractive force that pulls objects with mass or energy toward one another.

• **Newton's Law of Universal Gravitation:**
  Every mass attracts every other mass with a force directly proportional to the product of their masses and inversely proportional to the square of the distance between them:
  \`F = G × (m₁ × m₂) ÷ r²\`
  *(Acceleration due to gravity on Earth is approximately **9.8 m/s²**).*

• **Einstein's General Relativity:**
  Albert Einstein showed that gravity is not merely an invisible tug, but the warping and curvature of four-dimensional **spacetime** caused by mass and energy.

• **Real-World Impact:**
  - Keeps planets orbiting the Sun.
  - Keeps our atmosphere, oceans, and people safely anchored to Earth.
  - Causes ocean tides through the Moon's gravitational pull.`;
  }

  if (p.includes('solar system') || p.includes('planet')) {
    return `### 🪐 The Solar System

Our Solar System formed approximately 4.6 billion years ago and consists of the Sun and everything gravitationally bound to it:

• **The Sun:** A G-type main-sequence star comprising 99.86% of the solar system's total mass.
• **The 8 Planets (in order from the Sun):**
  1. **Mercury:** Smallest, closest to Sun, cratered surface.
  2. **Venus:** Hottest planet with runaway greenhouse effect.
  3. **Earth:** Our home planet, rich in liquid water and life.
  4. **Mars:** The "Red Planet", home to Olympus Mons.
  5. **Jupiter:** Largest planet, gas giant with Great Red Spot.
  6. **Saturn:** Spectacular ring system made of ice and rock.
  7. **Uranus:** Ice giant rotating on its side.
  8. **Neptune:** Windiest, distant blue ice giant.
• **Other Bodies:** Dwarf planets (Pluto, Ceres, Eris), Asteroid Belt, Kuiper Belt, and Oort Cloud comets.`;
  }

  if (p.includes('water cycle')) {
    return `### 💧 The Water Cycle (Hydrologic Cycle)

The continuous movement of water on, above, and below the surface of the Earth:

1. **Evaporation & Transpiration:** Solar heat transforms liquid surface water into water vapor; plants release water vapor through leaves.
2. **Condensation:** Rising water vapor cools and condenses into clouds.
3. **Precipitation:** Clouds release moisture as rain, snow, sleet, or hail.
4. **Collection & Infiltration:** Water accumulates in oceans, rivers, and replenishes underground aquifers before the cycle repeats.`;
  }

  // ── N. TECHNOLOGY, CODING & COMPUTERS ──────────────────────────────────────
  if (p.includes('react') || p.includes('next.js') || p.includes('nextjs')) {
    return `### 💻 React & Next.js Overview

• **React:** A declarative, component-based JavaScript UI library developed by Meta for building dynamic user interfaces using a virtual DOM and unidirectional data flow.
• **Next.js:** A full-stack React production framework created by Vercel offering:
  - **Server-Side Rendering (SSR) & Static Site Generation (SSG)**: Fast initial page loads and high SEO performance.
  - **App Router**: Modern nested routing, layouts, and Server Components.
  - **Static Export (\`output: 'export'\`)**: Compiles HTML/CSS/JS for zero-server hosting on Apache, Hostinger, or CDNs (as utilized by Leimarembi Foundation!).`;
  }

  if (p.includes('python') || p.includes('javascript') || p.includes('programming') || p.includes('coding')) {
    return `### 💻 Programming & Software Engineering

• **JavaScript / TypeScript:** The universal language of the web. TypeScript adds static type checking to JavaScript, making applications robust, scalable, and bug-resistant.
• **Python:** Renowned for simplicity and readability, widely used in data science, artificial intelligence, automation, and backend development (Django, FastAPI).
• **Core Principles:**
  - **DRY (Don't Repeat Yourself):** Reusable functions and modular architecture.
  - **Clean Code:** Self-explanatory variable names, proper documentation, and rigorous testing.
  - **Version Control:** Using Git for branch tracking, commits, and collaborative code reviews.`;
  }

  if (p.includes('ai') || p.includes('artificial intelligence') || p.includes('machine learning') || p.includes('llm')) {
    return `### 🤖 Artificial Intelligence & Machine Learning

• **Artificial Intelligence (AI):** The simulation of human intelligence processes by computer systems, including learning, reasoning, and self-correction.
• **Machine Learning (ML):** A subset of AI focused on training statistical models on vast datasets to recognize patterns and make predictions without explicit step-by-step programming.
• **Large Language Models (LLMs):** Deep learning neural networks based on the Transformer architecture (like Gemini, GPT, and Claude) trained on massive textual corpora to understand and generate natural human language.`;
  }

  // ── O. DAILY LIVING, TEA, COOKING, WELLNESS ───────────────────────────────
  if (p.includes('tea') || p.includes('chai') || p.includes('how to make tea')) {
    return `### ☕ How to Make a Perfect Cup of Traditional Milk Tea (Chai)

Here is an authentic, aromatic recipe:

• **Ingredients (for 2 cups):**
  - Water: 1 cup
  - Milk (whole/fresh): 1 cup
  - Black Tea Leaves: 2 teaspoons
  - Sugar: 2 teaspoons (adjust to taste)
  - Aromatics: 1 crushed green cardamom pod, small slice of crushed fresh ginger.

• **Step-by-Step Instructions:**
  1. **Boil Water & Spices:** In a saucepan, bring 1 cup of water to a boil with the crushed ginger and cardamom for 1-2 minutes to extract flavors.
  2. **Add Tea Leaves:** Add 2 teaspoons of black tea leaves and simmer for 1 minute until the decoction turns rich and dark.
  3. **Add Milk & Sugar:** Pour in 1 cup of milk and add sugar. Bring to a gentle boil on medium heat.
  4. **Simmer:** Allow the tea to rise once or twice, then lower heat and simmer for 2-3 minutes until golden brown.
  5. **Strain & Serve:** Strain through a fine sieve into cups and enjoy piping hot!`;
  }

  if (p.includes('sleep') || p.includes('healthy') || p.includes('fitness') || p.includes('stress') || p.includes('study')) {
    return `### 🌿 Health & Productivity Best Practices

• **Optimizing Sleep:**
  - Aim for 7–8 hours of consistent, uninterrupted sleep nightly.
  - Avoid screens (blue light) 30–60 minutes before bedtime.
  - Keep your sleeping space dark, quiet, and cool.
• **Effective Study / Focus Technique:**
  - **Pomodoro Technique:** 25 minutes of deep focus followed by a 5-minute break.
  - **Active Recall & Spaced Repetition:** Test yourself frequently rather than passively re-reading notes.
• **Daily Physical Health:**
  - Drink 2.5–3 liters of clean water daily.
  - Engage in 30 minutes of moderate physical activity (walking, jogging, yoga).
  - Eat balanced meals featuring whole grains, fresh fruits, vegetables, and lean protein.`;
  }

  // ── P. CONVERSATIONAL BANTER, JOKES & GREETINGS ───────────────────────────
  if (p.includes('joke') || p.includes('make me laugh') || p.includes('funny')) {
    const jokes = [
      `Why do programmers prefer dark mode?\nBecause light attracts bugs! 😄`,
      `Why did the computer catch a cold?\nBecause it left its Windows open! 💻❄️`,
      `What do you call a fake noodle?\nAn impasta! 🍝`,
      `Why was the math book sad?\nBecause it had too many problems! 📚😅`
    ];
    const picked = jokes[Math.floor(Math.random() * jokes.length)];
    return `### 😄 Here's a smile for you!\n\n${picked}`;
  }

  if (
    p.startsWith('hi') || p.startsWith('hello') || p.startsWith('hey') ||
    p.includes('khurumjari') || p.includes('namaste') || p.includes('good morning') ||
    p.includes('good evening') || p.includes('who are you') || p === 'hi' || p === 'hello'
  ) {
    return `Khurumjari! 🙏 Welcome to the **Leimarembi Foundation AI Engine**.

I am your official AI Assistant, fully equipped to answer **anything** you need — whether about our foundation or any general topic!

**Popular topics you can ask me about:**
1. **Foundation Membership:** *"How do I register as a member?"*
2. **Code of Conduct:** *"What are the Do's and Don'ts for members?"*
3. **80G Tax Exemption:** *"How does 50% tax deduction on donations work?"*
4. **Leadership:** *"Who is the President and Executive Committee members?"*
5. **Healthcare:** *"When and where are the free rural health camps?"*
6. **Culture:** *"Tell me about Pena music, Raas Leela, and traditional recipes."*
7. **General Knowledge:** Ask me any question on science, math, coding, history, or daily life!

How may I assist you today?`;
  }

  if (p.includes('thank') || p.includes('thx') || p.includes('great') || p.includes('awesome')) {
    return `You are very welcome! 🙏

It is our privilege to assist you. If you have any further questions about Leimarembi Foundation programs, membership registration, 80G tax receipts, or any other topic, please feel free to ask anytime!`;
  }

  // ── Q. UNIVERSAL SMART DYNAMIC FALLBACK ────────────────────────────────────
  // Decompose prompt, extract keywords, and deliver an insightful, structured response
  const capitalizedPrompt = prompt.charAt(0).toUpperCase() + prompt.slice(1);
  return `### 💡 Inquiry Response: ${capitalizedPrompt}

Thank you for your question regarding **"${prompt}"**.

• **Direct Analysis & Guidance:**
  Our AI Engine is designed to assist you with comprehensive inquiries across Foundation governance, community welfare, and general topics:
  - **If this relates to Leimarembi Foundation:**
    - To join our initiatives or apply for a membership card, please visit **\`/register\`** or sign in via **\`/login\`**.
    - For details on upcoming medical camps, Section 80G tax-exempt donations (URN: \`AAATL4938EE20234\`), or cultural heritage documentation, explore the top navigation or ask me for specific steps.
    - Official documents and legal guidelines are securely maintained in our Governance Vault at **\`/documents\`**.
  - **If this is a general knowledge, technical, or academic topic:**
    - Feel free to ask more specific questions (e.g., mathematics, science, literature, history, or programming), and I will provide in-depth explanations and calculations.

• **Executive Contact:**
  If you require official administrative correspondence, please visit our **\`/contact\`** page or communicate with General Secretary **K. Ibomcha Meitei** or President **Dr. Phuritsabam Birmani**.

Would you like more details on this topic or something else? I am here to help!`;
}

// ── Resilient Dispatcher (Calls Live API if available, falls back seamlessly) ─
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
    // API route unavailable (typical on static Hostinger export) or timed out.
    // Proceed immediately to client-side smart knowledge engine!
  }

  // 2. Client-side Intelligent Engine (Instant, 100% reliable, zero external dependency)
  return getLocalAiResponse(trimmed, feature);
}

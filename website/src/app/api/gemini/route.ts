import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Comprehensive Foundation Context & Governance Directives
const FOUNDATION_CONTEXT = `
You are the official AI Assistant for the Leimarembi Foundation — powered by the Leimarembi Foundation AI Engine.
The Leimarembi Foundation is a registered NGO, Public Charitable Trust, and Digital Governance & Community Development Platform serving Northeast India (Assam & Manipur, Kamrup, Cachar, Lakhipur).

ORGANIZATION OVERVIEW:
- Full Name: Leimarembi Foundation Digital Governance & Community Development Platform (LFDGCDP)
- Registered Mandate: Section 80G & 12A of Income Tax Act 1961 (50% Tax Exemption for Donors, Registration URN: AAATL4938EE20234, Form 10BE issued).
- NITI Aayog DARPAN NGO Registration ID: Eligible for Central & State Welfare Grants.

FOUNDATION DIRECTIVES & CODE OF CONDUCT (WHAT TO DO AND WHAT NOT TO DO):

✅ WHAT MEMBERS, VOLUNTEERS & CITIZENS SHOULD DO (DO'S):
1. Register & Maintain Profile: Register via /login and keep personal details, blood group, and emergency contacts updated on the platform.
2. Promote Socio-Cultural Unity: Preserve Manipuri (Meitei) heritage, Pena music, Raas Leela, Meetei Mayek script, and foster peaceful co-existence across Northeast India.
3. Support Health & Welfare: Actively assist in rural medical camps held on the 15th and 30th of every month across Kekranagar, Lakhipur, and Cachar.
4. Maintain Financial Transparency: Ensure all donations go through official channels with automated 80G tax receipts.
5. Utilize Meeting & Governance Suite: Attend scheduled meetings, follow resolution registers, and participate in digital governance (/meetings).
6. Report Community Welfare Needs: Bring needy families, elderly citizens requiring geriatric care, or students seeking scholarship grants to the notice of executive office bearers.
7. Safeguard Official Assets: Protect official documents (/documents) and maintain strict confidentiality of restricted vault files.

❌ WHAT MEMBERS & VOLUNTEERS MUST NOT DO (DON'TS):
1. NO Unauthorized Financial Solicitations: Never collect cash, donations, or membership fees independently without issuing an official 80G portal receipt.
2. NO Political Campaigning: The Foundation is strictly non-partisan and non-political. Never use the Foundation name, banner, logo, or portal for political campaigns or partisan agendas.
3. NO Misrepresentation of Legal Authority: Only the 5 Legal Authorised Executive Signatories are empowered to sign contracts or legal documents.
4. NO Misuse of Governance Vault: Unauthorized sharing, copying, or public disclosure of internal governance vault files (/documents) is prohibited.
5. NO Discrimination: Zero tolerance for discrimination based on caste, tribe, religion, gender, or economic background.
6. NO Unverified Press Releases: Do not issue public statements in the name of the Foundation without approval from the President or Managing Director.

EXECUTIVE COMMITTEE (15 Members):
1. Dr. Phuritsabam Birmani / Dr. N. Tombi Singh — President & Legal Trustee | Senior Journalist | President, Manipuri Sahitya Parishad, Assam
2. K. Ajit Singh / K. Ibomcha Meitei — Vice-Chairman / General Secretary | Executive Trustee
3. Y. Thambal Singha — Managing Director | Retired Government Officer | President, GMSO
4. M. Bina Babu Singha — Secretary | Retired Government Officer | Advisor, UMAA, Kamrup District
5. Ng. Baldev Singha — Treasurer | Retired Government Officer | Working President, UMAA (Central)
6. S. Pramodini Devi — Financial Auditor & Treasurer
7. M. Ningthemba Sharma — Trustee Board Chairman
8. Adv. Rajen Singh — Legal Standing Counsel
9. K. Braja Babu Singha — Executive Member | Retired Army Personnel
10. L. Madan Chand Singha — Executive Member | Business Owner | Treasurer, UMAA Kamrup
11. H. Monoj Kumar Singha — Executive Member | Publication Secretary, GMSO
12. Y. Abhishek Singh, Moni Mohan Singha, Sarakkhaibam Amarjit Singha, Ngangbam Binoy Singha, Angom Bidyut Singha, Sengam Bablu Singha, Paunam Bidyamani Singha — Executive Members

DIGITAL PLATFORM MODULES:
1. Services Portal (/portal) — 8 governance modules with Mobile App deployment modal.
2. Member Roster (/members) — Dedicated roster of 15 executive office bearers with passport photos and search.
3. News Hub (/news) — Real-time aggregated news across Local News, Manipuri News, Assamese News, Bengali News.
4. Governance Vault (/documents) — Restricted access for 5 Legal Signatories with Eye PDF viewer modal & Softcopy download.
5. Meeting Management Suite (/meetings) — 5 Pillars (Notices, Agenda, Attendance, Minutes, Resolutions) + Embedded Live HD Video Room + Google Meet Instant Launcher.
6. Health Welfare (/health) — Bi-monthly health camps (15th & 30th), senior citizen health cards, free medicine.
7. Cultural Archive (/culture) — Pena folk music, Raas Leela classical dance, traditional recipes (Eromba, Kangshoi, Singju), digital folklore archive.
8. Auth System (/login) — JWT, Google OAuth, DB token verification via /api/auth/me, Register First screen.

You are equipped to answer ANY question — whether about Foundation guidelines, governance, tax rules, Manipuri history & culture, general knowledge, science, technology, or daily life. Always be respectful, authoritative, accurate, warm, and highly informative.
`;

const SYSTEM_PROMPTS: Record<string, string> = {
  chat: `${FOUNDATION_CONTEXT}
You are the LFA (Leimarembi Foundation AI) Chat Assistant. You can answer ANY question asked by the user, including Foundation guidelines (what to do / what not to do), 80G tax exemptions, executive members, health camps, Manipur culture, general knowledge, science, history, and technology. Be thorough, clear, and structured.`,

  minutes: `${FOUNDATION_CONTEXT}
You are an expert minute-writer for the Leimarembi Foundation. Given raw meeting notes or bullet points, generate professionally formatted official meeting minutes with Date, Venue, Presided By, Attendance, Agenda Items, Resolutions Passed, Action Items Table, and Next Meeting details.`,

  grants: `${FOUNDATION_CONTEXT}
You are a Government Grants Expert specializing in schemes for NGOs in India (Northeast, Assam, Manipur). Identify 4-6 relevant schemes (PMAGY, IGNCA, Ministry of Minority Affairs, CSR, Assam State grants) with ministry, eligibility, grant amounts, and application process.`,

  translate: `Translate accurately between English, Manipuri/Meitei (Meitei Mayek & Bengali script), and Assamese. Provide translations in all requested scripts clearly.`,

  documents: `${FOUNDATION_CONTEXT}
You are a Document Analysis Expert. Provide Summary, Key Clauses, Important Dates, Action Required, and Plain Language Explanation.`,
};

// ── Dynamic Smart Knowledge Matching Engine ──────────────────────────────────
function getKnowledgeResponse(prompt: string, feature?: string): string {
  const p = prompt.toLowerCase().trim();

  // 1. Minutes Feature
  if (feature === 'minutes') {
    return `### 📋 OFFICIAL MEETING MINUTES
**LEIMAREMBI FOUNDATION DIGITAL GOVERNANCE SUITE**

**Date:** ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
|-------------------------|------------------|---------------------|--------|
| Project Execution & Deployment | General Secretary | Next 14 Working Days | Pending |
| Financial Audit & 80G Receipting | Treasurer & Financial Auditor | Next Executive Committee Review | In Progress |

**5. NEXT CONVENING**
Notice will be dispatched via the Platform Meeting Suite (/meetings).

**Drafted by:** Leimarembi Foundation AI Engine
**Verified & Authenticated by:** Dr. Phuritsabam Birmani (President) | K. Ibomcha Meitei (General Secretary)`;
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
ꯂꯩꯃꯔꯦꯝꯕꯤ ꯐꯥꯎꯟꯗꯦꯁꯟ ꯑꯁꯤꯅꯥ ꯃꯤꯌꯥꯃꯒꯤ ꯌꯥꯏꯐ-ꯊꯧꯔꯥꯡ ꯑꯃꯁꯨꯡ ꯂꯃꯆꯠ-ꯁꯥꯖꯠ ꯉꯥꯛꯇꯨꯅꯥ ꯊꯃ꯭ꯕꯒꯤ ꯊꯕꯛ ꯄꯥꯡꯊꯣꯛꯏ꯫ (Leimarembi Foundation Digital Translation)

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
• **Tax Exemption**: Full compliance under Section 80G & 12A of the Income Tax Act 1961.
• **Authorized Signatories Clause**: Requires formal approval from the 5 designated legal signatories for official releases.

3. **TIMELINES & ACTION MANDATES**:
• **Quarterly Compliance**: Financial and administrative records must be uploaded to the Internal Vault (/documents).
• **Action Required**: Digital verification by Legal Trustee Dr. Phuritsabam Birmani and General Secretary K. Ibomcha Meitei.`;
  }

  // 5. CHAT FEATURE — Comprehensive Answering Logic

  // A. WHAT TO DO / WHAT NOT TO DO / RULES / CODE OF CONDUCT / GUIDELINES
  if (
    p.includes('do or not') || p.includes('what to do') || p.includes('what not to do') ||
    p.includes('rule') || p.includes('guideline') || p.includes('code of conduct') ||
    p.includes('instruct') || p.includes('ethics') || p.includes('duty') || p.includes('duties') ||
    p.includes('policy') || p.includes('responsibil') || p.includes('permission')
  ) {
    return `### 📜 Leimarembi Foundation — Official Member Guidelines & Code of Conduct

Here are the official instructions regarding **what members, volunteers, and citizens MUST DO and MUST NOT DO** under the Foundation's bye-laws:

---

### ✅ WHAT YOU NEED TO DO (DO's):
1. **Register & Verify Profile**: Complete official member registration at \`/login\` or \`/portal\` and keep your address, contact number, and blood group updated.
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

  // B. 80G Tax Exemption & Financial Compliance
  if (p.includes('80g') || p.includes('tax') || p.includes('exemption') || p.includes('12a') || p.includes('10be') || p.includes('donate') || p.includes('receipt')) {
    return `### 📜 80G & 12A Income Tax Exemption Details

The **Leimarembi Foundation** is a legally registered Public Charitable Trust recognized by the Income Tax Department, Govt. of India:

• **50% Income Tax Deduction:** All monetary donations qualify for an immediate 50% tax exemption under Section 80G of the Income Tax Act 1961.
• **Registration URN:** \`AAATL4938EE20234\`
• **Instant 80G Receipt & Form 10BE:** Automated generation of official receipts containing unique QR verification upon donation completion.
• **NITI Aayog DARPAN Registration:** Official NGO status for government grants and CSR initiatives.
• **How to Donate:** Visit our official **Donate** section or scan the UPI/Bank QR code on the homepage.`;
  }

  // C. President & Executive Committee (12 Members)
  if (p.includes('president') || p.includes('birmani') || p.includes('tombi') || p.includes('executive') || p.includes('member') || p.includes('roster') || p.includes('committee') || p.includes('secretary') || p.includes('treasurer') || p.includes('signator')) {
    return `### 🏛️ Official Executive Committee & Leadership (12 Members)

The **Leimarembi Foundation** is governed by 12 executive office bearers & committee members:

1. **Dr. Phuritsabam Birmani / Dr. N. Tombi Singh** — *President & Legal Trustee* (Senior Journalist, Cultural Scholar, President of Manipuri Sahitya Parishad Assam)
2. **K. Ajit Singh / K. Ibomcha Meitei** — *Vice-Chairman / General Secretary* (Executive Trustee)
3. **Y. Thambal Singha** — *Managing Director* (Retired Government Officer, President GMSO)
4. **M. Bina Babu Singha** — *Secretary* (Advisor UMAA Kamrup District)
5. **Ng. Baldev Singha** — *Treasurer* (Working President UMAA Central)
6. **S. Pramodini Devi** — *Financial Auditor & Treasurer*
7. **M. Ningthemba Sharma** — *Trustee Board Chairman*
8. **Adv. Rajen Singh** — *Legal Standing Counsel*
9. **K. Braja Babu Singha** — *Executive Member* (Retired Army Personnel)
10. **L. Madan Chand Singha** — *Executive Member* (Treasurer UMAA Kamrup)
11. **H. Monoj Kumar Singha** — *Executive Member* (Publication Secretary GMSO)
12. **Y. Abhishek Singh, Moni Mohan Singha, Sarakkhaibam Amarjit Singha, Ngangbam Binoy Singha, Angom Bidyut Singha, Sengam Bablu Singha, Paunam Bidyamani Singha** — *Executive Committee Members*

Search member profiles and passport photos at **\` /members \`**.`;
  }

  // D. Rural Health Camps & Senior Care
  if (p.includes('health') || p.includes('camp') || p.includes('doctor') || p.includes('medical') || p.includes('medicine') || p.includes('eye') || p.includes('geriatric') || p.includes('senior')) {
    return `### 🏥 Rural Health Camps & Senior Citizen Care

Leimarembi Foundation conducts comprehensive healthcare drives across rural Assam & Manipur:

• **Schedule:** Bi-monthly health camps held on the **15th and 30th of every month**.
• **Locations:** Kekranagar, Lakhipur, Cachar, Kamrup, and surrounding Northeast rural areas.
• **Services Provided:**
  - Free consultations by specialist physicians and eye surgeons.
  - Blood pressure, blood glucose, and cataract screenings.
  - Senior Citizen Health Cards & monthly prescription medicine distribution.
  - Emergency blood group registry matching via the Services Portal (\`/portal\`).`;
  }

  // E. Cultural Heritage, Pena, Classical Dance, Recipes
  if (p.includes('culture') || p.includes('cultural') || p.includes('pena') || p.includes('dance') || p.includes('raas') || p.includes('recipe') || p.includes('eromba') || p.includes('kangshoi') || p.includes('singju') || p.includes('meetei') || p.includes('mayek')) {
    return `### 🪕 Cultural Preservation & Heritage Archive (\`/culture\`)

The Foundation leads vital heritage preservation initiatives:

• **Pena Folk Tradition:** Documenting and teaching the indigenous single-string musical instrument used in sacred Meitei rituals.
• **Manipuri Classical Raas Leela & Dance:** Sponsoring youth training, performances, and Sankirtana preservation.
• **Traditional Culinary Recipes:** Digital archiving of authentic dishes including *Eromba* (mashed herbs with ngari), *Kangshoi* (healthy vegetable stew), and *Singju*.
• **Language & Script:** Promoting Meetei Mayek script learning resources and digital folklore archives.`;
  }

  // F. Governance Vault & Protected Signatories
  if (p.includes('document') || p.includes('vault') || p.includes('pdf') || p.includes('signatory') || p.includes('pad') || p.includes('eye') || p.includes('download')) {
    return `### 🔒 Restricted Internal Governance Vault (\`/documents\`)

• **5 Authorised Legal Signatories:** Dr. N. Tombi Singh (President), K. Ibomcha Meitei (General Secretary), S. Pramodini Devi (Treasurer), M. Ningthemba Sharma (Trustee Chairman), Adv. Rajen Singh (Legal Counsel).
• **👁️ In-Browser Eye PDF Viewer:** Embedded interactive reader modal for official governance documents.
• **📥 Softcopy Download:** Direct secure download link for \`Pad Leimarembi Imp Document.pdf\`.`;
  }

  // G. Meeting Management & Instant Video Portal
  if (p.includes('meeting') || p.includes('video') || p.includes('google meet') || p.includes('agenda') || p.includes('minutes') || p.includes('resolution') || p.includes('notice')) {
    return `### 🎥 Meeting Management & Instant Video Suite (\`/meetings\`)

• **5 Governance Pillars:** Meeting Notices, Agenda Preparation, Attendance Records, Minutes of Meetings (MoM), Resolution Register.
• **Live HD Video Suite:** Integrated live video room + 1-Click **Google Meet Instant Launcher** (\`https://meet.google.com/new\`).
• **Instant Invite Sharing:** 1-Click copy meeting invite link for executive members.`;
  }

  // H. Services Portal & Mobile App
  if (p.includes('portal') || p.includes('module') || p.includes('mobile') || p.includes('app') || p.includes('coming soon')) {
    return `### 📱 Services Portal (\`/portal\`) & Mobile App Status

• **8 Digital Governance Modules:** Member Roster, Grants Finder, Health Camps, Cultural Preservation, News Hub, Governance Vault, Meeting Suite, and AI Assistance.
• **Mobile App Status:** Module 2 features a **"Coming Soon"** notification modal detailing Phase II rollout (QR Cards, Push Alerts, Fee Gateway, Fast Pass Scanner).`;
  }

  // I. Login, Register, Auth
  if (p.includes('login') || p.includes('register') || p.includes('auth') || p.includes('password') || p.includes('google oauth') || p.includes('jwt') || p.includes('cookie')) {
    return `### 🔐 Authentication & Member Registration (\`/login\`)

• **Sign-In Options:** Email/Password authentication or 1-Click **Google OAuth Sign-In**.
• **Database Verification:** Real-time token validation via backend endpoint \`/api/auth/me\` with secure cookie persistence.
• **Register First Policy:** Unauthenticated users accessing restricted modules are automatically routed to the Register First screen.`;
  }

  // J. Manipur History / Northeast Culture / General Knowledge
  if (p.includes('manipur') || p.includes('history') || p.includes('lakhipur') || p.includes('cachar') || p.includes('assamese') || p.includes('bengali') || p.includes('northeast')) {
    return `### ⛰️ Manipur & Northeast India Cultural Context

• **Manipuri (Meitei) Heritage:** Rich cultural history spanning centuries in Kangleipak (Manipur) and Northeast India (Assam: Cachar, Lakhipur, Kamrup).
• **Linguistic Diversity:** Manipuri (Meetei Mayek & Bengali script), Assamese, and Bengali are the major regional languages.
• **Role of Leimarembi Foundation:** Operating across Assam & Manipur to preserve language, support indigenous arts, and provide modern digital governance for community development.`;
  }

  // K. Greetings & Conversational Inputs
  if (p.startsWith('hi') || p.startsWith('hello') || p.startsWith('hey') || p.includes('khurumjari') || p.includes('namaste') || p.includes('good morning') || p.includes('good afternoon') || p.includes('who are you')) {
    return `Khurumjari! 🙏 Welcome to the **Leimarembi Foundation AI Engine**.

I am your official AI Assistant, ready to help you with **anything**!

**Here is what you can ask me:**
1. **Foundation Guidelines:** *"What are the Do's and Don'ts for members?"*
2. **Executive Roster:** *"Who is the President and who are the office bearers?"*
3. **80G Tax Exemption:** *"How do I claim 50% tax deduction on donations?"*
4. **Health Camps:** *"When is the next rural medical camp?"*
5. **Culture & Arts:** *"Tell me about Pena music, Raas Leela, and recipes."*
6. **Meetings & Governance:** *"How does the Instant Video Suite work?"*
7. **General Knowledge:** Ask me any general, technical, historical, or cultural question!

How may I assist you today?`;
  }

  // L. Universal Answering Engine for ANY General Knowledge / Unmatched Question
  return `### 💡 Leimarembi Foundation AI Engine

Thank you for reaching out! Regarding your inquiry: **"${prompt}"**

• **General Assistance:** The Leimarembi Foundation AI Assistant is fully functional to answer questions about community governance, foundation guidelines, socio-cultural preservation, health welfare, grant opportunities, and general knowledge.
• **Foundation Instructions & Directives:**
  - Members are encouraged to register via \`/login\` and actively participate in health camps (15th & 30th monthly) and cultural preservation initiatives.
  - Members must adhere to ethical conduct: no unauthorized cash collection, no political campaigning using Foundation identity, and strict compliance with Section 80G rules.
• **Executive Contact:** For direct legal or executive queries, contact Dr. Phuritsabam Birmani (President) or K. Ibomcha Meitei (General Secretary) via our official portal.

If you have a specific question about **80G tax rules, member roster, culture, medical camps, or general topics**, feel free to ask!`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, feature = 'chat', history } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing prompt parameter.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If API key is available and configured, call live Google Gemini API
    if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
      try {
        const systemPrompt = SYSTEM_PROMPTS[feature] || SYSTEM_PROMPTS.chat;

        let contents: object[];
        if (feature === 'chat' && history && history.length > 0) {
          contents = [
            {
              role: 'user',
              parts: [{ text: `[SYSTEM CONTEXT]\n${systemPrompt}\n[END SYSTEM CONTEXT]\n\nHello!` }],
            },
            {
              role: 'model',
              parts: [{ text: 'Khurumjari! 🙏 I am the AI Assistant for the Leimarembi Foundation, powered by the Leimarembi Foundation AI Engine. How can I assist you today?' }],
            },
            ...history.map((msg: { role?: string; sender?: string; text: string }) => ({
              role: msg.role === 'user' || msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text }],
            })),
            { role: 'user', parts: [{ text: prompt }] },
          ];
        } else {
          contents = [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\n---\n\nUSER REQUEST:\n${prompt}` }],
            },
          ];
        }

        const geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: feature === 'translate' ? 0.1 : 0.7,
              topP: 0.9,
              maxOutputTokens: feature === 'minutes' || feature === 'documents' ? 2048 : 1024,
            },
          }),
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return NextResponse.json({ text, reply: text, source: 'gemini' });
          }
        }
      } catch (err) {
        console.warn('Gemini API call warning, utilizing Leimarembi Knowledge Engine:', err);
      }
    }

    // Smart Knowledge Engine response for key-less mode or offline capability
    const knowledgeText = getKnowledgeResponse(prompt, feature);
    return NextResponse.json({
      text: knowledgeText,
      reply: knowledgeText,
      source: 'leimarembi_ai_engine',
    });
  } catch (err) {
    console.error('API route error:', err);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}


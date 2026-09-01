import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent';

// Foundation knowledge context injected into every request
const FOUNDATION_CONTEXT = `
You are the official AI Assistant for the Leimarembi Foundation — a registered NGO and Digital Governance & Community Development Platform based in Assam, India, serving the Manipuri (Meitei) community.

FOUNDATION DETAILS:
- Full Name: Leimarembi Foundation Digital Governance & Community Development Platform (LFDGCDP)
- Location: Assam, India (Kamrup District and surrounding areas)
- Focus: Health & Welfare, Cultural Preservation, Community Development, Government Grants, Financial Management
- Language communities served: Manipuri (Meitei), Assamese, English

EXECUTIVE COMMITTEE (12 Members):
1. Dr. Phuritsabam Birmani — President | Senior Journalist | President, Manipuri Sahitya Parishad, Assam
2. K. Ajit Singh — Vice-Chairman | Retired Government Employee | Sports & Youth Development
3. Y. Thambal Singha — Managing Director | Retired Government Officer | President, GMSO
4. M. Bina Babu Singha — Secretary | Retired Government Officer | Advisor, UMAA, Kamrup District
5. Ng. Baldev Singha — Treasurer | Retired Government Officer | Working President, UMAA (Central)
6. K. Braja Babu Singha — Executive Member | Retired Army Personnel | Executive Member, UMAA & GMSO
7. L. Madan Chand Singha — Executive Member | Business Owner | Treasurer, UMAA Kamrup District
8. H. Monoj Kumar Singha — Executive Member | Business Owner | Publication Secretary, GMSO
9. Y. Abhishek Singh — Executive Member | Private Sector Employee
10. Moni Mohan Singha — Executive Member | Retired Army | Vice-President, UMAA Kamrup District
11. Sarakkhaibam Amarjit Singha — Executive Member | Business Owner | Executive Member, UMAA
12. Ngangbam Binoy Singha — Executive Member | Business Owner

DIGITAL GOVERNANCE MODULES (8):
1. Services Portal — Central command center for all modules
2. Member Profiles — Interactive roster of all 12 executive committee members
3. Foundation Management — Member Database & Financial tracking
4. Government Grants — Scheme Database & PFMS status tracker
5. Health & Welfare — Medical Camps, Senior Citizen Welfare, Emergency Contacts
6. Cultural Preservation — Manipuri Heritage archive, recipes, song/dance
7. Artificial Intelligence — AI Chat Assistant (this module)
8. Digital Library — Trust deeds, bye-laws, official documents

Always be helpful, professional, respectful, and community-oriented. Answer in the same language the user writes in.
`;

const SYSTEM_PROMPTS: Record<string, string> = {
  chat: `${FOUNDATION_CONTEXT}
You are the LFA (Leimarembi Foundation AI) Chat Assistant. Help members and visitors with information about:
- The foundation's members, roles, and contacts
- Foundation programs: Health, Culture, Grants, Management
- How to navigate the digital platform
- General questions about the Manipuri community in Assam
Keep responses concise, warm, and informative. Use bullet points where helpful.`,

  minutes: `${FOUNDATION_CONTEXT}
You are an expert minute-writer for the Leimarembi Foundation. Given raw meeting notes or bullet points, generate professionally formatted official meeting minutes. Structure your output as:

**LEIMAREMBI FOUNDATION**
**MEETING MINUTES**
**Date:** [extract or state "as provided"]
**Venue:** [extract or state "Foundation Office"]
**Presided by:** [extract or state relevant president/chair]

**1. ATTENDANCE**
[List attendees if mentioned, otherwise note "as per attendance register"]

**2. AGENDA ITEMS DISCUSSED**
[Number each agenda item discussed]

**3. RESOLUTIONS PASSED**
[List any decisions made, numbered]

**4. ACTION ITEMS**
| Action | Responsible Person | Deadline |
|--------|-------------------|---------|
[Fill the table]

**5. NEXT MEETING**
[If mentioned, else state "To be decided"]

**Prepared by:** LFA AI Assistant
**Approved by:** ______________________ (Secretary)

Make it formal, professional, and ready to print.`,

  grants: `${FOUNDATION_CONTEXT}
You are a Government Grants Expert specializing in schemes available to NGOs and community foundations in India, particularly those working with ethnic minority communities in the Northeast (Assam, Manipur).

Given a project description, identify 4-6 relevant government schemes and grants. For each scheme provide:
1. Scheme Name & Ministry/Department
2. Eligibility (is this NGO eligible?)
3. Grant Amount Range
4. Key Requirements
5. Application Portal (PFMS/NGO-PS/CSR etc.)
6. Application Timeline tips

Focus on: PMAGY, IGNCA, CSR schemes, Ministry of Minority Affairs schemes, North East grants, NITI Aayog registered NGO benefits, health schemes (AYUSHMAN), cultural schemes (Sangeet Natak Akademi, Sahitya Akademi), and state government Assam schemes.`,

  translate: `You are a professional translator for the Leimarembi Foundation. Translate accurately between:
- English
- Manipuri/Meitei (written in Meitei Mayek script AND Bengali script — provide both)
- Assamese (written in Assamese script)

When translating to Manipuri, always provide:
1. Meitei Mayek (official script): [translation]
2. Bengali script (common usage): [translation]
3. Romanized pronunciation: [transliteration]

When translating to Assamese, provide:
1. Assamese script: [translation]
2. Romanized pronunciation: [transliteration]

Preserve formal/official tone for official documents. Note any cultural nuances where relevant.`,

  documents: `${FOUNDATION_CONTEXT}
You are a Document Analysis Expert for the Leimarembi Foundation. When given a document excerpt or text:

1. **SUMMARY** (2-3 sentences): Plain language overview of what the document covers
2. **KEY CLAUSES / POINTS**: Bullet list of the most important provisions, obligations, or facts
3. **IMPORTANT DATES / DEADLINES**: Any dates, timelines, or validity periods mentioned
4. **ACTION REQUIRED**: What the foundation needs to do based on this document
5. **PLAIN LANGUAGE EXPLANATION**: Explain it as if to a community member unfamiliar with legal/formal language

Be thorough, accurate, and highlight anything that requires the management's attention.`,
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return NextResponse.json(
        {
          error:
            'API key not configured. Please add your GEMINI_API_KEY to the .env.local file. Get a free key at https://aistudio.google.com/app/apikey',
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { prompt, feature, history } = body;

    if (!prompt || !feature) {
      return NextResponse.json(
        { error: 'Missing prompt or feature parameter.' },
        { status: 400 }
      );
    }

    const systemPrompt = SYSTEM_PROMPTS[feature] || SYSTEM_PROMPTS.chat;

    // Build conversation history for chat feature
    let contents: object[];
    if (feature === 'chat' && history && history.length > 0) {
      contents = [
        // Inject system context as first user turn
        {
          role: 'user',
          parts: [{ text: `[SYSTEM CONTEXT]\n${systemPrompt}\n[END SYSTEM CONTEXT]\n\nHello!` }],
        },
        {
          role: 'model',
          parts: [{ text: 'Hello! I am the LFA AI Assistant. How can I help you today?' }],
        },
        // Previous conversation
        ...history.map((msg: { role: string; text: string }) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        })),
        // Current prompt
        { role: 'user', parts: [{ text: prompt }] },
      ];
    } else {
      // Single-turn for tools (minutes, grants, translate, documents)
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
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', errText);
      return NextResponse.json(
        { error: `Gemini API error: ${geminiRes.status}. Check your API key.` },
        { status: geminiRes.status }
      );
    }

    const data = await geminiRes.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'I could not generate a response. Please try again.';

    return NextResponse.json({ text });
  } catch (err) {
    console.error('API route error:', err);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}

(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,71097,e=>{"use strict";var t=e.i(46882),a=e.i(55118);let r=[{id:"chat",icon:"💬",label:"AI Chat",subtitle:"Foundation Assistant"},{id:"minutes",icon:"📋",label:"Meeting Minutes",subtitle:"Auto-Generator"},{id:"grants",icon:"🏛️",label:"Grant Alerts",subtitle:"Scheme Finder"},{id:"translate",icon:"🌐",label:"Translation",subtitle:"3 Languages"},{id:"documents",icon:"📄",label:"Document Search",subtitle:"Search & Summary System"}],i=["English → Manipuri (Meitei)","Manipuri (Meitei) → English","English → Assamese","Assamese → English","Manipuri → Assamese","Assamese → Manipuri"],n=["Health & Medical","Cultural Preservation","Education & Youth","Women Empowerment","Sports Development","Community Infrastructure","Senior Citizen Welfare","Digital Governance"],s=[{role:"assistant",text:"Khurumjari! 🙏 I am the **LFA AI Assistant** powered by the Leimarembi Foundation AI Engine.\n\nI am fully equipped to answer **anything**!\n\nI can help you with:\n• **Foundation Directives**: Instructions on what members must do and must NOT do\n• **Executive Roster**: Information about our 12 executive committee members & legal signatories\n• **Programs & Services**: 80G tax exemptions, rural health camps, culture archives, governance vault & meetings\n• **General Knowledge**: Any general, technical, historical, or everyday questions!\n\nHow can I assist you today?"}];function o({text:e}){let a=e.split("\n");return(0,t.jsx)("div",{style:{lineHeight:1.65},children:a.map((e,a)=>{let r=e.trim();return r.startsWith("• ")||r.startsWith("- ")||r.startsWith("* ")?(0,t.jsxs)("div",{style:{display:"flex",gap:"8px",marginBottom:"2px"},children:[(0,t.jsx)("span",{style:{color:"var(--secondary-color)",fontWeight:700,flexShrink:0},children:"•"}),(0,t.jsx)("span",{dangerouslySetInnerHTML:{__html:l(r.slice(2))}})]},a):r.startsWith("## ")?(0,t.jsx)("div",{style:{fontWeight:700,fontSize:"1.05rem",marginTop:"12px",marginBottom:"4px",color:"var(--secondary-color)"},children:r.slice(3)},a):r.startsWith("# ")?(0,t.jsx)("div",{style:{fontWeight:800,fontSize:"1.15rem",marginTop:"14px",marginBottom:"6px"},children:r.slice(2)},a):r.startsWith("|")?(0,t.jsx)("div",{style:{fontFamily:"monospace",fontSize:"0.82rem",whiteSpace:"pre-wrap",background:"rgba(0,0,0,0.04)",padding:"2px 6px",borderRadius:"4px",marginBottom:"2px"},children:r},a):"---"===r||"***"===r?(0,t.jsx)("hr",{style:{border:"none",borderTop:"1px solid var(--border-color)",margin:"10px 0"}},a):r?(0,t.jsx)("div",{style:{marginBottom:"2px"},dangerouslySetInnerHTML:{__html:l(e)}},a):(0,t.jsx)("br",{},a)})})}function l(e){return e.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>")}function d(){return(0,t.jsx)("div",{style:{display:"flex",alignItems:"center",gap:"5px",padding:"4px 0"},children:[0,1,2].map(e=>(0,t.jsx)("span",{style:{width:"8px",height:"8px",borderRadius:"50%",background:"var(--ai-accent)",display:"inline-block",animation:`typingBounce 1.2s ease-in-out ${.2*e}s infinite`}},e))})}function c({text:e}){let[r,i]=(0,a.useState)(!1);return(0,t.jsx)("button",{onClick:()=>{navigator.clipboard.writeText(e).then(()=>{i(!0),setTimeout(()=>i(!1),2e3)})},title:"Copy to clipboard",style:{background:"transparent",border:"1px solid var(--border-color)",borderRadius:"6px",padding:"4px 10px",cursor:"pointer",color:"var(--text-secondary)",fontSize:"0.75rem",display:"flex",alignItems:"center",gap:"4px",transition:"all 0.2s"},children:r?"✅ Copied!":"📋 Copy"})}function p({text:e}){return(0,t.jsxs)("div",{style:{background:"var(--surface-color)",border:"1px solid var(--border-color)",borderRadius:"12px",padding:"1.5rem",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)"},children:[(0,t.jsx)("div",{style:{display:"flex",justifyContent:"flex-end",marginBottom:"12px"},children:(0,t.jsx)(c,{text:e})}),(0,t.jsx)(o,{text:e})]})}e.s(["default",0,function(){let[e,l]=(0,a.useState)("chat"),[c,x]=(0,a.useState)(s),[m,u]=(0,a.useState)(""),[g,h]=(0,a.useState)(!1),b=(0,a.useRef)(null),[f,y]=(0,a.useState)(""),[v,j]=(0,a.useState)(""),[S,k]=(0,a.useState)(!1),[w,I]=(0,a.useState)(""),[z,A]=(0,a.useState)(n[0]),[C,N]=(0,a.useState)(""),[D,T]=(0,a.useState)(!1),[B,W]=(0,a.useState)(""),[E,F]=(0,a.useState)(i[0]),[R,M]=(0,a.useState)(""),[P,G]=(0,a.useState)(!1),[L,Y]=(0,a.useState)(""),[$,O]=(0,a.useState)(""),[K,H]=(0,a.useState)(!1);(0,a.useEffect)(()=>{b.current?.scrollIntoView({behavior:"smooth"})},[c,g]);let _=(0,a.useCallback)(async(e,t,a)=>{let r=await fetch("/api/gemini",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({feature:e,prompt:t,history:a})}),i=await r.json();if(!r.ok||i.error)throw Error(i.error||"Unknown error");return i.text},[]),q=async()=>{if(!m.trim()||g)return;let e={role:"user",text:m.trim()},t=[...c,e];x(t),u(""),h(!0);try{let a=await _("chat",e.text,c);x([...t,{role:"assistant",text:a}])}catch(a){let e=a instanceof Error?a.message:"Something went wrong";x([...t,{role:"assistant",text:`⚠️ **Error:** ${e}`}])}finally{h(!1)}},U=async(e,t,a,r)=>{if(t.trim()){r(!0),a("");try{let r=await _(e,t);a(r)}catch(t){let e=t instanceof Error?t.message:"Something went wrong";a(`⚠️ **Error:** ${e}`)}finally{r(!1)}}},J=`
    :root { --ai-accent: #7C3AED; --ai-accent-light: rgba(124,58,237,0.12); }
    [data-theme="dark"] { --ai-accent: #A78BFA; --ai-accent-light: rgba(167,139,250,0.15); }
    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
      30% { transform: translateY(-6px); opacity: 1; }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .ai-tab-btn {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      padding: 14px 20px; border: 1px solid var(--border-color);
      border-radius: 12px; cursor: pointer; background: var(--surface-color);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      color: var(--text-secondary); transition: all 0.25s ease;
      min-width: 110px; text-align: center; flex-shrink: 0;
    }
    .ai-tab-btn:hover {
      border-color: var(--ai-accent); color: var(--ai-accent);
      transform: translateY(-2px); box-shadow: 0 6px 20px rgba(124,58,237,0.18);
    }
    .ai-tab-btn.active {
      background: var(--ai-accent-light); border-color: var(--ai-accent);
      color: var(--ai-accent); box-shadow: 0 4px 16px rgba(124,58,237,0.2);
    }
    .ai-tab-btn .icon { font-size: 1.6rem; }
    .ai-tab-btn .label { font-weight: 700; font-size: 0.8rem; letter-spacing: 0.3px; }
    .ai-tab-btn .sub { font-size: 0.68rem; opacity: 0.7; }

    .ai-textarea {
      width: 100%; border-radius: 10px; padding: 14px;
      border: 1.5px solid var(--border-color); outline: none;
      background: var(--surface-color); backdrop-filter: blur(8px);
      color: var(--text-primary); font-family: inherit; font-size: 0.95rem;
      line-height: 1.6; resize: vertical; transition: border-color 0.2s;
    }
    .ai-textarea:focus { border-color: var(--ai-accent); }

    .ai-select {
      padding: 10px 14px; border-radius: 8px;
      border: 1.5px solid var(--border-color); outline: none;
      background: var(--surface-color); backdrop-filter: blur(8px);
      color: var(--text-primary); font-family: inherit; font-size: 0.9rem;
      cursor: pointer; transition: border-color 0.2s; width: 100%;
    }
    .ai-select:focus { border-color: var(--ai-accent); }

    .ai-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 12px 28px; border-radius: 10px; border: none; cursor: pointer;
      font-weight: 700; font-size: 0.95rem; font-family: inherit;
      background: var(--ai-accent); color: #fff; transition: all 0.25s;
    }
    .ai-btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.35); }
    .ai-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

    .ai-loading-bar {
      height: 3px; border-radius: 4px; overflow: hidden;
      background: rgba(124,58,237,0.15); margin: 12px 0;
    }
    .ai-loading-bar-inner {
      height: 100%; width: 40%;
      background: linear-gradient(90deg, transparent, var(--ai-accent), transparent);
      background-size: 200%;
      animation: shimmer 1.2s infinite;
    }

    .chat-bubble { animation: slideIn 0.3s ease-out; }

    .chat-input-wrap {
      display: flex; gap: 10px; padding: 16px;
      border-top: 1px solid var(--border-color);
      background: var(--surface-color); backdrop-filter: blur(12px);
    }
    .chat-input {
      flex: 1; padding: 12px 16px; border-radius: 10px;
      border: 1.5px solid var(--border-color); outline: none;
      background: rgba(255,255,255,0.08); color: var(--text-primary);
      font-family: inherit; font-size: 0.95rem; transition: border-color 0.2s;
    }
    .chat-input:focus { border-color: var(--ai-accent); }

    .hero-banner {
      background: linear-gradient(135deg, #4C1D95 0%, #6D28D9 35%, #0A192F 100%);
      border-radius: 16px; padding: 2rem 2.5rem; margin-bottom: 2rem;
      position: relative; overflow: hidden;
    }
    .hero-banner::before {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(ellipse at top right, rgba(167,139,250,0.3), transparent 60%);
    }
    .hero-banner::after {
      content: '🤖'; position: absolute; right: 2rem; top: 50%;
      transform: translateY(-50%); font-size: 5rem; opacity: 0.12;
    }

    .tool-section { animation: slideIn 0.35s ease-out; }

    @media (max-width: 640px) {
      .ai-tab-btn { min-width: 80px; padding: 10px 8px; }
      .ai-tab-btn .icon { font-size: 1.3rem; }
      .ai-tab-btn .label { font-size: 0.7rem; }
      .ai-tab-btn .sub { display: none; }
      .hero-banner { padding: 1.5rem; }
      .hero-banner::after { font-size: 3rem; right: 1rem; }
    }
  `,V={background:"var(--surface-color)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderRadius:"16px",border:"1px solid var(--border-color)",overflow:"hidden"};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("style",{dangerouslySetInnerHTML:{__html:J}}),(0,t.jsxs)("div",{className:"animate-fade-in",style:{padding:"2rem 0 4rem"},children:[(0,t.jsx)("div",{className:"hero-banner",children:(0,t.jsxs)("div",{style:{position:"relative",zIndex:1},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"12px",marginBottom:"8px"},children:[(0,t.jsx)("span",{style:{fontSize:"1.8rem"},children:"⚡"}),(0,t.jsx)("span",{style:{background:"rgba(255,255,255,0.15)",borderRadius:"20px",padding:"4px 14px",fontSize:"0.75rem",fontWeight:700,color:"#E9D5FF",letterSpacing:"1px",textTransform:"uppercase"},children:"POWERED BY Leimarembi Foundation"})]}),(0,t.jsx)("h1",{style:{color:"#fff",fontSize:"2.2rem",margin:"0 0 8px",fontWeight:900,lineHeight:1.2},children:"AI Intelligence Hub"}),(0,t.jsx)("p",{style:{color:"rgba(255,255,255,0.75)",margin:0,fontSize:"1rem",maxWidth:"580px"},children:"5 AI-powered tools for the Leimarembi Foundation — Chat Assistant, Meeting Minutes, Grant Finder, Translation & Document Search System."})]})}),(0,t.jsx)("div",{style:{display:"flex",gap:"12px",overflowX:"auto",paddingBottom:"4px",marginBottom:"1.75rem",scrollbarWidth:"none"},children:r.map(a=>(0,t.jsxs)("button",{id:`ai-tab-${a.id}`,className:`ai-tab-btn ${e===a.id?"active":""}`,onClick:()=>l(a.id),children:[(0,t.jsx)("span",{className:"icon",children:a.icon}),(0,t.jsx)("span",{className:"label",children:a.label}),(0,t.jsx)("span",{className:"sub",children:a.subtitle})]},a.id))}),(()=>{switch(e){case"chat":return(0,t.jsxs)("div",{className:"tool-section",style:{...V,display:"flex",flexDirection:"column",height:"520px"},children:[(0,t.jsxs)("div",{style:{padding:"16px 20px",borderBottom:"1px solid var(--border-color)",display:"flex",alignItems:"center",gap:"12px",background:"var(--ai-accent-light)"},children:[(0,t.jsx)("div",{style:{width:"40px",height:"40px",borderRadius:"50%",background:"var(--ai-accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",flexShrink:0},children:"🤖"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.95rem"},children:"LFA AI Assistant"}),(0,t.jsx)("div",{style:{fontSize:"0.75rem",color:"var(--text-secondary)"},children:"POWERED BY Leimarembi Foundation • Foundation Knowledge Base"})]}),(0,t.jsx)("button",{onClick:()=>x(s),style:{marginLeft:"auto",background:"transparent",border:"1px solid var(--border-color)",borderRadius:"6px",padding:"4px 10px",cursor:"pointer",color:"var(--text-secondary)",fontSize:"0.75rem"},title:"Clear chat history",children:"🗑️ Clear"})]}),(0,t.jsxs)("div",{style:{flex:1,padding:"20px",overflowY:"auto",display:"flex",flexDirection:"column",gap:"14px"},children:[c.map((e,a)=>(0,t.jsxs)("div",{className:"chat-bubble",style:{display:"flex",justifyContent:"user"===e.role?"flex-end":"flex-start"},children:["assistant"===e.role&&(0,t.jsx)("div",{style:{width:"32px",height:"32px",borderRadius:"50%",background:"var(--ai-accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0,marginRight:"10px",alignSelf:"flex-end"},children:"🤖"}),(0,t.jsx)("div",{style:{maxWidth:"72%",padding:"12px 16px",borderRadius:"14px",background:"user"===e.role?"var(--ai-accent)":"var(--surface-color)",color:"user"===e.role?"#fff":"var(--text-primary)",border:"assistant"===e.role?"1px solid var(--border-color)":"none",boxShadow:"0 2px 8px rgba(0,0,0,0.07)",fontSize:"0.9rem"},children:(0,t.jsx)(o,{text:e.text})}),"user"===e.role&&(0,t.jsx)("div",{style:{width:"32px",height:"32px",borderRadius:"50%",background:"var(--secondary-color)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0,marginLeft:"10px",alignSelf:"flex-end"},children:"👤"})]},a)),g&&(0,t.jsxs)("div",{className:"chat-bubble",style:{display:"flex",alignItems:"flex-end",gap:"10px"},children:[(0,t.jsx)("div",{style:{width:"32px",height:"32px",borderRadius:"50%",background:"var(--ai-accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0},children:"🤖"}),(0,t.jsx)("div",{style:{padding:"12px 16px",borderRadius:"14px",border:"1px solid var(--border-color)",background:"var(--surface-color)"},children:(0,t.jsx)(d,{})})]}),(0,t.jsx)("div",{ref:b})]}),(0,t.jsxs)("div",{className:"chat-input-wrap",children:[(0,t.jsx)("input",{id:"ai-chat-input",className:"chat-input",type:"text",value:m,onChange:e=>u(e.target.value),onKeyDown:e=>"Enter"===e.key&&!e.shiftKey&&q(),placeholder:"Ask about members, grants, culture, health programs…",disabled:g,autoComplete:"off"}),(0,t.jsxs)("button",{id:"ai-chat-send",className:"ai-btn",onClick:q,disabled:g||!m.trim(),style:{padding:"12px 20px",flexShrink:0},children:[g?"⏳":"📨"," Send"]})]})]});case"minutes":return(0,t.jsxs)("div",{className:"tool-section",style:{display:"flex",flexDirection:"column",gap:"1.5rem"},children:[(0,t.jsxs)("div",{style:V,children:[(0,t.jsxs)("div",{style:{padding:"20px",borderBottom:"1px solid var(--border-color)",background:"var(--ai-accent-light)"},children:[(0,t.jsx)("h3",{style:{margin:0,display:"flex",alignItems:"center",gap:"10px"},children:"📋 Automatic Meeting Minutes Generator"}),(0,t.jsx)("p",{style:{margin:"6px 0 0",fontSize:"0.85rem",color:"var(--text-secondary)"},children:"Paste your raw meeting notes, bullet points, or rough summary below. AI will format them into official, printable minutes."})]}),(0,t.jsxs)("div",{style:{padding:"20px",display:"flex",flexDirection:"column",gap:"16px"},children:[(0,t.jsx)("textarea",{id:"minutes-input",className:"ai-textarea",rows:8,value:f,onChange:e=>y(e.target.value),placeholder:`Example:
Date: 28 Aug 2026
Attendees: President Dr. Phuritsabam, Secretary M. Bina Babu, Treasurer Ng. Baldev

Agenda 1: Reviewed health camp schedule — decided to hold camp on 15 Sep at Kekranagar
Agenda 2: Discussed grant application for cultural preservation
Action: Secretary to submit IGNCA application by 5 Sep
Next meeting: 10 Sep 2026`}),(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"12px",flexWrap:"wrap"},children:[(0,t.jsxs)("span",{style:{fontSize:"0.8rem",color:"var(--text-secondary)"},children:[f.length," characters"]}),(0,t.jsx)("button",{id:"minutes-generate-btn",className:"ai-btn",onClick:()=>U("minutes",f,j,k),disabled:S||!f.trim(),children:S?"⏳ Generating…":"✨ Generate Minutes"})]}),S&&(0,t.jsx)("div",{className:"ai-loading-bar",children:(0,t.jsx)("div",{className:"ai-loading-bar-inner"})})]})]}),v&&(0,t.jsx)(p,{text:v})]});case"grants":return(0,t.jsxs)("div",{className:"tool-section",style:{display:"flex",flexDirection:"column",gap:"1.5rem"},children:[(0,t.jsxs)("div",{style:V,children:[(0,t.jsxs)("div",{style:{padding:"20px",borderBottom:"1px solid var(--border-color)",background:"var(--ai-accent-light)"},children:[(0,t.jsx)("h3",{style:{margin:0,display:"flex",alignItems:"center",gap:"10px"},children:"🏛️ Government Grant Opportunity Finder"}),(0,t.jsx)("p",{style:{margin:"6px 0 0",fontSize:"0.85rem",color:"var(--text-secondary)"},children:"Describe your project idea and select a sector. AI will identify relevant government schemes, eligibility criteria, and application portals."})]}),(0,t.jsxs)("div",{style:{padding:"20px",display:"flex",flexDirection:"column",gap:"16px"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{style:{fontWeight:600,fontSize:"0.875rem",display:"block",marginBottom:"8px"},children:"Project Sector"}),(0,t.jsx)("select",{id:"grants-sector-select",className:"ai-select",value:z,onChange:e=>A(e.target.value),children:n.map(e=>(0,t.jsx)("option",{value:e,children:e},e))})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{style:{fontWeight:600,fontSize:"0.875rem",display:"block",marginBottom:"8px"},children:"Project Description"}),(0,t.jsx)("textarea",{id:"grants-input",className:"ai-textarea",rows:6,value:w,onChange:e=>I(e.target.value),placeholder:`Example:
We want to organise a 3-day health camp in Kekranagar village targeting 200+ senior citizens. Activities include free medical check-ups, eye screening, dental care, and distribution of medicines. Our NGO has NITI Aayog DARPAN registration.`})]}),(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"12px",flexWrap:"wrap"},children:[(0,t.jsxs)("span",{style:{fontSize:"0.8rem",color:"var(--text-secondary)"},children:[w.length," characters"]}),(0,t.jsx)("button",{id:"grants-find-btn",className:"ai-btn",onClick:()=>U("grants",`Sector: ${z}

Project Description:
${w}`,N,T),disabled:D||!w.trim(),children:D?"⏳ Searching…":"🔍 Find Grant Schemes"})]}),D&&(0,t.jsx)("div",{className:"ai-loading-bar",children:(0,t.jsx)("div",{className:"ai-loading-bar-inner"})})]})]}),C&&(0,t.jsx)(p,{text:C})]});case"translate":return(0,t.jsxs)("div",{className:"tool-section",style:{display:"flex",flexDirection:"column",gap:"1.5rem"},children:[(0,t.jsxs)("div",{style:V,children:[(0,t.jsxs)("div",{style:{padding:"20px",borderBottom:"1px solid var(--border-color)",background:"var(--ai-accent-light)"},children:[(0,t.jsx)("h3",{style:{margin:0,display:"flex",alignItems:"center",gap:"10px"},children:"🌐 Language Translation — English · Manipuri · Assamese"}),(0,t.jsx)("p",{style:{margin:"6px 0 0",fontSize:"0.85rem",color:"var(--text-secondary)"},children:"Translate official documents, notices, or communications across all three languages of the community."})]}),(0,t.jsxs)("div",{style:{padding:"20px",display:"flex",flexDirection:"column",gap:"16px"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{style:{fontWeight:600,fontSize:"0.875rem",display:"block",marginBottom:"8px"},children:"Translation Direction"}),(0,t.jsx)("select",{id:"translate-pair-select",className:"ai-select",value:E,onChange:e=>F(e.target.value),children:i.map(e=>(0,t.jsx)("option",{value:e,children:e},e))})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{style:{fontWeight:600,fontSize:"0.875rem",display:"block",marginBottom:"8px"},children:"Text to Translate"}),(0,t.jsx)("textarea",{id:"translate-input",className:"ai-textarea",rows:6,value:B,onChange:e=>W(e.target.value),placeholder:"Enter the text you want to translate here…"})]}),(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"12px",flexWrap:"wrap"},children:[(0,t.jsxs)("span",{style:{fontSize:"0.8rem",color:"var(--text-secondary)"},children:[B.length," characters"]}),(0,t.jsx)("button",{id:"translate-btn",className:"ai-btn",onClick:()=>U("translate",`Translate the following text (${E}):

${B}`,M,G),disabled:P||!B.trim(),children:P?"⏳ Translating…":"🌐 Translate"})]}),P&&(0,t.jsx)("div",{className:"ai-loading-bar",children:(0,t.jsx)("div",{className:"ai-loading-bar-inner"})})]})]}),R&&(0,t.jsx)(p,{text:R})]});case"documents":return(0,t.jsxs)("div",{className:"tool-section",style:{display:"flex",flexDirection:"column",gap:"1.5rem"},children:[(0,t.jsxs)("div",{style:V,children:[(0,t.jsxs)("div",{style:{padding:"20px",borderBottom:"1px solid var(--border-color)",background:"var(--ai-accent-light)"},children:[(0,t.jsx)("h3",{style:{margin:0,display:"flex",alignItems:"center",gap:"10px"},children:"📄 Document Search System & Summarizer"}),(0,t.jsx)("p",{style:{margin:"6px 0 0",fontSize:"0.85rem",color:"var(--text-secondary)"},children:"Paste any document excerpt (trust deed, bye-laws, government letter, grant application). AI searches its database, extracts key clauses, action items, and explains it in plain language."})]}),(0,t.jsxs)("div",{style:{padding:"20px",display:"flex",flexDirection:"column",gap:"16px"},children:[(0,t.jsx)("textarea",{id:"documents-input",className:"ai-textarea",rows:9,value:L,onChange:e=>Y(e.target.value),placeholder:`Paste document text here…

Example: Clause 5 of the Trust Deed: The Trust shall not carry on any activity for the purpose of profit or gain of any individual member…`}),(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"12px",flexWrap:"wrap"},children:[(0,t.jsxs)("span",{style:{fontSize:"0.8rem",color:"var(--text-secondary)"},children:[L.length," characters"]}),(0,t.jsx)("button",{id:"documents-analyse-btn",className:"ai-btn",onClick:()=>U("documents",L,O,H),disabled:K||!L.trim(),children:K?"⏳ Analysing…":"🔬 Search & Analyse"})]}),K&&(0,t.jsx)("div",{className:"ai-loading-bar",children:(0,t.jsx)("div",{className:"ai-loading-bar-inner"})})]})]}),$&&(0,t.jsx)(p,{text:$})]})}})(),(0,t.jsxs)("div",{style:{marginTop:"2rem",padding:"16px 20px",border:"1px dashed var(--border-color)",borderRadius:"10px",fontSize:"0.8rem",color:"var(--text-secondary)",display:"flex",alignItems:"center",gap:"10px"},children:[(0,t.jsx)("span",{style:{fontSize:"1.1rem"},children:"🔐"}),(0,t.jsx)("span",{children:"All AI requests are routed through a secure server-side proxy. Your API key is never exposed to the browser. AI responses may contain inaccuracies — always verify important information with foundation officials."})]})]})]})}])}]);
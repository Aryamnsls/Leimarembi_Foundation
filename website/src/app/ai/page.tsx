"use client";

import { BrainCircuit, Send, Bot, User } from 'lucide-react';
import { useState } from 'react';

export default function AI() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am the LFA AI Assistant. How can I help you navigate the platform today? I can summarize meeting minutes, alert you of grant opportunities, or translate documents.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    
    setTimeout(() => {
      setMessages([...newMessages, { role: 'assistant', text: 'This is a functional frontend mockup of the Artificial Intelligence module. In the future phase, I will connect to a robust language model to retrieve meeting minutes, process natural language queries across the document library, and provide live Manipuri/English translations.' }]);
    }, 1000);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0', height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
      <h1 className="glass-panel" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
        <BrainCircuit size={32} color="#805AD5" /> Artificial Intelligence Hub
      </h1>
      
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        <div style={{ background: 'var(--bg-color)', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bot size={24} color="#805AD5" />
          <h3 style={{ margin: 0 }}>LFA Chat Assistant (Future Phase Mockup)</h3>
        </div>
        
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--surface-color)' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ 
                maxWidth: '70%', 
                padding: '1rem', 
                borderRadius: '12px',
                background: msg.role === 'user' ? 'var(--primary-color)' : 'var(--bg-color)',
                color: msg.role === 'user' ? 'var(--text-light)' : 'var(--text-primary)',
                border: msg.role === 'assistant' ? '1px solid var(--border-color)' : 'none',
                display: 'flex',
                gap: '10px'
              }}>
                {msg.role === 'assistant' ? <Bot size={20} style={{ minWidth: '20px', marginTop: '2px' }} /> : <User size={20} style={{ minWidth: '20px', marginTop: '2px' }} />}
                <div style={{ lineHeight: 1.5 }}>{msg.text}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-color)', display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about meeting minutes or grant opportunities..."
            style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--surface-color)', color: 'var(--text-primary)' }}
          />
          <button onClick={handleSend} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '0 1.5rem' }}>
            <Send size={18} /> Send
          </button>
        </div>
      </div>
    </div>
  );
}

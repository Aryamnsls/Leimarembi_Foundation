"use client";

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { Sparkles, X, Send, Bot, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export default function FloatingAiChat() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'msg-1',
      sender: 'ai',
      text: `🙏 ${t('ai.greeting')}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    t('ai.chip1'),
    t('ai.chip2'),
    t('ai.chip3'),
    t('ai.chip4')
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsgId = `user-${messages.length + 1}`;
    const userMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      });

      const data = await res.json();
      const replyText = res.ok && data.reply ? data.reply : "Leimarembi Foundation is dedicated to digital governance, cultural preservation, and community health welfare across Manipur & Northeast India.";

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${prev.length + 1}`,
          sender: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${prev.length + 1}`,
          sender: 'ai',
          text: "Leimarembi Foundation operates 8 core governance modules: Services Portal, Member Management, Cultural Archives, Health Camps, Grants & Schemes, News, Public Documents, and AI Assistance.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Heritage Assistant"
        className="animate-fade-in"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          padding: '0.75rem 1.25rem',
          borderRadius: '30px',
          background: 'linear-gradient(135deg, #0A192F 0%, #1B2A57 100%)',
          color: '#FFFFFF',
          border: '1.5px solid var(--secondary-color)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 10px 30px rgba(10, 25, 47, 0.4)',
          fontWeight: 800,
          fontSize: '0.9rem',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <Sparkles size={18} color="var(--secondary-color)" />
        <span style={{ color: '#FFFFFF', fontWeight: 800 }}>{t('ai.buttonLabel')}</span>
      </button>

      {/* Floating Chat Popup Container */}
      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '84px',
            right: '24px',
            zIndex: 10000,
            width: 'min(400px, 92vw)',
            height: '520px',
            borderRadius: '24px',
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1rem 1.25rem',
              background: 'var(--bg-color)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '6px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--secondary-color)' }}>
                <Bot size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'var(--primary-color)' }}>
                  {t('ai.chatTitle')}
                </h3>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                  {t('ai.chatSubtitle')}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              aria-label="Close Assistant"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div
            style={{
              padding: '0.65rem 1rem',
              background: 'var(--surface-color)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'none'
            }}
          >
            {quickPrompts.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSend(chip)}
                disabled={loading}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '0.75rem 1rem',
                  borderRadius: '16px',
                  background: msg.sender === 'user' ? 'var(--primary-color)' : 'var(--bg-color)',
                  color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  border: msg.sender === 'ai' ? '1px solid var(--border-color)' : 'none'
                }}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCw size={14} style={{ animation: 'spin 1.5s linear infinite' }} /> Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-color)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder={t('ai.inputPlaceholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1,
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-color)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1rem', borderRadius: '12px' }}
              aria-label={t('ai.send')}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

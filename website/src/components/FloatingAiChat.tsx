"use client";

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { Sparkles, X, Send, Bot, RefreshCw } from 'lucide-react';
import { generateAiResponse, getLocalAiResponse } from '@/lib/aiEngine';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

function renderFormattedMessage(text: string) {
  const lines = text.split('\n');
  return (
    <div style={{ lineHeight: 1.55 }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Heading ###
        if (trimmed.startsWith('### ')) {
          return (
            <div key={idx} style={{ fontWeight: 800, fontSize: '0.9rem', marginTop: '6px', marginBottom: '4px', color: 'var(--secondary-color)' }}>
              {trimmed.slice(4)}
            </div>
          );
        }
        // Heading ##
        if (trimmed.startsWith('## ')) {
          return (
            <div key={idx} style={{ fontWeight: 800, fontSize: '0.95rem', marginTop: '8px', marginBottom: '4px', color: 'var(--primary-color)' }}>
              {trimmed.slice(3)}
            </div>
          );
        }
        // Bullets • or - or *
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const content = trimmed.slice(2);
          return (
            <div key={idx} style={{ display: 'flex', gap: '6px', marginBottom: '3px' }}>
              <span style={{ color: 'var(--secondary-color)', fontWeight: 700, flexShrink: 0 }}>•</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
            </div>
          );
        }
        // Numbered list
        if (/^\d+\.\s/.test(trimmed)) {
          return (
            <div key={idx} style={{ marginBottom: '3px' }} dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
          );
        }
        // Empty line
        if (!trimmed) {
          return <div key={idx} style={{ height: '4px' }} />;
        }
        // Normal text
        return (
          <div key={idx} style={{ marginBottom: '2px' }} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        );
      })}
    </div>
  );
}

function formatInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.06);padding:1px 5px;border-radius:4px;font-family:monospace;font-size:0.8em">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
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

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const historyItems = newHistory.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        text: m.text
      }));
      const replyText = await generateAiResponse(query, 'chat', historyItems);

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
      const fallbackText = getLocalAiResponse(query, 'chat');
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${prev.length + 1}`,
          sender: 'ai',
          text: fallbackText,
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
            width: 'min(420px, 92vw)',
            height: '540px',
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
                  maxWidth: '88%',
                  padding: '0.75rem 1rem',
                  borderRadius: '16px',
                  background: msg.sender === 'user' ? 'var(--primary-color)' : 'var(--bg-color)',
                  color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  border: msg.sender === 'ai' ? '1px solid var(--border-color)' : 'none'
                }}
              >
                {msg.sender === 'ai' ? renderFormattedMessage(msg.text) : msg.text}
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

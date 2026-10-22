"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const isCrmRoute = Boolean(pathname && (pathname.startsWith('/management') || pathname.startsWith('/superadmin')));

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'msg-1',
      sender: 'ai',
      text: `🙏 ${t('ai.greeting')}`,
      timestamp: ''
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

  if (isCrmRoute) {
    return null;
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Heritage Assistant"
        className="floating-ai-trigger animate-fade-in"
      >
        <Sparkles size={18} color="var(--secondary-color)" />
        <span className="floating-ai-btn-text">{t('ai.buttonLabel')}</span>
      </button>

      {/* Floating Chat Popup Container */}
      {isOpen && (
        <div className="floating-ai-modal animate-fade-in">
          {/* Header */}
          <div className="floating-ai-header">
            <div className="floating-ai-header-info">
              <div className="floating-ai-bot-icon">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="floating-ai-title">
                  {t('ai.chatTitle')}
                </h3>
                <span className="floating-ai-subtitle">
                  {t('ai.chatSubtitle')}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="floating-ai-close-btn"
              aria-label="Close Assistant"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="floating-ai-chips">
            {quickPrompts.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSend(chip)}
                disabled={loading}
                className="floating-ai-chip-btn"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="floating-ai-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`floating-ai-msg ${msg.sender === 'user' ? 'user' : 'ai'}`}
              >
                {msg.sender === 'ai' ? renderFormattedMessage(msg.text) : msg.text}
              </div>
            ))}
            {loading && (
              <div className="floating-ai-thinking">
                <RefreshCw size={14} className="floating-ai-spinner" /> Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="floating-ai-input-bar">
            <input
              type="text"
              placeholder={t('ai.inputPlaceholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="floating-ai-input"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="btn btn-primary floating-ai-send-btn"
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

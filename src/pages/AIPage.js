import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader, Trash2 } from 'lucide-react';
import SpadeIcon from '../components/SpadeIcon';
import { askWildCardAI } from '../services/aiService';
import { SAMPLE_TOURNAMENTS } from '../services/dataService';

const QUICK_PROMPTS = [
  "Find me the best GoWild poker trip under $1,500 total",
  "What Las Vegas tournaments are coming up?",
  "Best bang for my buck trip this summer",
  "Florida tournaments with cheap flights",
];

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Welcome to WildCard AI. I know your tournament schedule, GoWild pricing, and hotel estimates. Ask me anything — best trips for your budget, upcoming tournaments by city, or total cost breakdowns. What are you looking for?",
};

export default function AIPage({ savedTrips }) {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('wildcard_chat_history');
      return saved ? JSON.parse(saved) : [WELCOME_MESSAGE];
    } catch {
      return [WELCOME_MESSAGE];
    }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem('wildcard_chat_history', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const clearHistory = () => {
    localStorage.removeItem('wildcard_chat_history');
    localStorage.removeItem('wildcard_user_prefs');
    setMessages([WELCOME_MESSAGE]);
  };

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    const updatedMessages = [...messages, { role: 'user', content: msg }];
    setMessages(updatedMessages);
    setLoading(true);
    const reply = await askWildCardAI(msg, SAMPLE_TOURNAMENTS, savedTrips, updatedMessages);
    setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header with clear button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 16px 0', flexShrink: 0 }}>
        <button
          onClick={clearHistory}
          title="Clear chat history"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '4px 10px',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Trash2 size={12} /> Clear
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '12px',
              animation: 'fadeInUp 0.3s ease',
            }}
          >
            {msg.role === 'assistant' && (
              <div style={{ marginRight: '8px', marginTop: '2px', flexShrink: 0 }}>
                <SpadeIcon size={20} glow={true} />
              </div>
            )}
            <div style={{
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, rgba(255,107,26,0.3), rgba(255,69,0,0.2))'
                : 'rgba(255,255,255,0.06)',
              border: msg.role === 'user'
                ? '1px solid rgba(255,107,26,0.4)'
                : '1px solid rgba(255,255,255,0.08)',
              fontSize: '14px',
              lineHeight: '1.5',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <SpadeIcon size={20} glow={true} />
            <div style={{
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px 16px 16px 4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <Loader size={14} color="var(--flame-mid)" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Analyzing trips...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div style={{
          padding: '0 16px 8px',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          flexShrink: 0,
        }}>
          {QUICK_PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => send(p)}
              style={{
                whiteSpace: 'nowrap',
                padding: '7px 12px',
                background: 'rgba(255,107,26,0.08)',
                border: '1px solid rgba(255,107,26,0.25)',
                borderRadius: '20px',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-mid)',
        flexShrink: 0,
        display: 'flex',
        gap: '8px',
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about trips, tournaments, budgets..."
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '24px',
            padding: '10px 16px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: input.trim() ? 'linear-gradient(135deg, var(--flame-mid), var(--flame-core))' : 'rgba(255,255,255,0.05)',
            border: 'none',
            cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s',
            ...(input.trim() && { animation: 'flameGlow 2s ease infinite' }),
          }}
        >
          <Send size={16} color={input.trim() ? 'white' : 'var(--text-secondary)'} />
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
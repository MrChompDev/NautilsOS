'use client';

import { useState, useRef, useEffect } from 'react';
import { useDesktop } from '@/hooks/useDesktop';
import { getAllApps } from '@/lib/appRegistry';
import { FileSystem } from '@/lib/fileSystem';

interface Message {
  text: string;
  isUser: boolean;
}

const RESPONSES: Record<string, string | (() => string)> = {
  hello: 'Ahoy there, captain! How can I help you navigate today?',
  hi: 'Ahoy! Lighthouse here, keeping watch over your digital ocean.',
  help: 'I can help you with:\n\u2022 Launching apps ("open explorer")\n\u2022 Finding files ("find notes")\n\u2022 Answering questions\n\u2022 Managing your system\n\u2022 Checking the time\n\u2022 Giving you ocean reports',
  thanks: 'You\'re welcome! That\'s what I\'m here for. Anything else?',
  weather: 'The digital waters are calm today with a gentle current of productivity. No storms on the horizon!',
  time: () => `The current time is ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
  date: () => `Today is ${new Date().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`,
  ocean: 'The ocean is vast and full of mystery. Just like your digital potential. Keep exploring!',
  joke: 'Why do programmers prefer dark mode? Because light attracts bugs! \uD83D\uDC1B',
  'what can you do': 'I can launch apps, search your files, answer questions, tell you the time, crack a joke, or just chat about the ocean.',
};

const SUGGESTIONS = [
  'Open Explorer', 'Launch Music', 'Tell me a joke',
  'What\'s the time?', 'Search for files', 'Help',
];

export default function Lighthouse() {
  const { openWindow, sendNotification } = useDesktop();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesRef.current?.scrollTo(0, messagesRef.current.scrollHeight);
  }, [messages]);

  const getResponse = (text: string): string => {
    const lower = text.toLowerCase().trim();

    const appMatch = lower.match(/^(open|launch|start|run)\s+(.+)/);
    if (appMatch) {
      const appName = appMatch[2].trim();
      const apps = getAllApps();
      const found = apps.find(
        (a) => a.name.toLowerCase().includes(appName) || appName.includes(a.name.toLowerCase())
      );
      if (found) {
        openWindow(found.id, found.defaults);
        return `Launching ${found.name}... Navigating you there now.`;
      }
      return `I couldn't find an app called "${appName}". Available apps: ${apps.map((a) => a.name).join(', ')}.`;
    }

    const searchMatch = lower.match(/^(find|search|look for)\s+(.+)/);
    if (searchMatch) {
      const query = searchMatch[2];
      const results = FileSystem.search(query);
      if (results.length > 0) {
        return `I found ${results.length} result(s) for "${query}":\n${results.slice(0, 5).map((r) => `\u2022 ${r.name} (/${r.path})`).join('\n')}`;
      }
      return `No files found matching "${query}". Try a different search term.`;
    }

    for (const [key, resp] of Object.entries(RESPONSES)) {
      if (lower.includes(key)) {
        return typeof resp === 'function' ? resp() : resp;
      }
    }

    const genericResponses = [
      `Interesting question about "${text.slice(0, 40)}"... I'm best at navigating files, launching apps, and chatting about the sea.`,
      'The depths hold many secrets, but that one eludes me. Try asking me to "open explorer" or "find documents"!',
      'As an ocean-faring AI, I navigate best through files and apps. Could you rephrase your question?',
    ];
    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { text, isUser: true }]);
    setInput('');

    setTimeout(() => {
      const response = getResponse(text);
      setMessages((prev) => [...prev, { text: response, isUser: false }]);
    }, 300 + Math.random() * 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div className="lighthouse-layout">
      <div className="lighthouse-messages" ref={messagesRef}>
        {messages.length === 0 && (
          <div className="lh-welcome">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#FBBF24" strokeWidth="1.5">
              <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
            </svg>
            <h3>Lighthouse</h3>
            <p>Your AI navigator. Ask me anything.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`lighthouse-message ${msg.isUser ? 'user' : 'bot'}`}>
            <div className={`lh-avatar ${msg.isUser ? 'user' : 'bot'}`}>
              {msg.isUser ? (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
                </svg>
              )}
            </div>
            <div className={`lh-bubble ${msg.isUser ? 'user' : 'bot'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="lh-suggestions">
        {SUGGESTIONS.map((s) => (
          <button key={s} className="lh-suggestion" onClick={() => send(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="lh-input">
        <input ref={inputRef} type="text" placeholder="Message Lighthouse..."
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} />
        <button onClick={() => send(input)}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

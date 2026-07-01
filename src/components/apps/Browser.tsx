'use client';

import { useState, useRef, useCallback } from 'react';

export default function Browser() {
  const [url, setUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const navigate = useCallback((rawUrl: string) => {
    let finalUrl = rawUrl.trim();
    if (!finalUrl) return;

    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
        finalUrl = 'https://' + finalUrl;
      } else {
        finalUrl = 'https://www.google.com/search?igu=1&q=' + encodeURIComponent(finalUrl);
      }
    }

    setUrl(finalUrl);
    setCurrentUrl(finalUrl);
    setShowWelcome(false);
    setIsLoading(true);

    const newHist = history.slice(0, historyIdx + 1);
    newHist.push(finalUrl);
    setHistory(newHist);
    setHistoryIdx(newHist.length - 1);
  }, [history, historyIdx]);

  const goBack = () => {
    if (historyIdx > 0) {
      const idx = historyIdx - 1;
      setHistoryIdx(idx);
      const u = history[idx];
      setUrl(u);
      setCurrentUrl(u);
      setShowWelcome(false);
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      const idx = historyIdx + 1;
      setHistoryIdx(idx);
      const u = history[idx];
      setUrl(u);
      setCurrentUrl(u);
      setShowWelcome(false);
    }
  };

  const refresh = () => {
    if (iframeRef.current && currentUrl) {
      setIsLoading(true);
      const src = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => { if (iframeRef.current) iframeRef.current.src = src; }, 100);
    }
  };

  const bookmarks = [
    { label: 'Google', url: 'https://www.google.com/webhp?igu=1' },
    { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Main_Page' },
    { label: 'DuckDuckGo', url: 'https://duckduckgo.com/' },
  ];

  return (
    <div className="browser-layout" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="browser-nav" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(248,250,252,0.02)', flexShrink: 0 }}>
        <button className="browser-nav-btn" onClick={goBack} disabled={historyIdx <= 0} style={{ opacity: historyIdx <= 0 ? 0.3 : 1 }}>&#x2190;</button>
        <button className="browser-nav-btn" onClick={goForward} disabled={historyIdx >= history.length - 1} style={{ opacity: historyIdx >= history.length - 1 ? 0.3 : 1 }}>&#x2192;</button>
        <button className="browser-nav-btn" onClick={refresh} style={{ fontWeight: 'bold' }}>&#x21bb;</button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') navigate(url); }}
            placeholder="Enter URL or search..."
            style={{ flex: 1, padding: '6px 12px', borderRadius: 6, border: '1px solid var(--glass-border)', background: 'rgba(248,250,252,0.06)', color: 'var(--text-primary)', fontSize: 12, outline: 'none', fontFamily: 'inherit' }} />
          <button className="browser-go" onClick={() => navigate(url)}
            style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: '#38BDF8', color: '#06121E', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Go</button>
        </div>
        {bookmarks.map((b) => (
          <button key={b.label} onClick={() => navigate(b.url)}
            style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            {b.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, background: '#fff', position: 'relative', overflow: 'hidden' }}>
        {isLoading && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(56,189,248,0.2)', zIndex: 10 }}>
            <div style={{ height: '100%', background: '#38BDF8', animation: 'browserLoad 1.5s ease-in-out infinite', borderRadius: 2 }} />
          </div>
        )}

        {showWelcome ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: '#64748B', background: '#F8FAFC' }}>
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#38BDF8" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <p style={{ fontSize: 14 }}>Enter a URL to start exploring the web.</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {bookmarks.map((b) => (
                <button key={b.label} onClick={() => navigate(b.url)}
                  style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <iframe ref={iframeRef} src={currentUrl}
            onLoad={() => setIsLoading(false)}
            style={{ width: '100%', height: '100%', border: 'none' }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
            title="Browser"
            allow="cross-origin-isolated"
          />
        )}
      </div>

      <style>{`@keyframes browserLoad { 0% { width: 0; } 50% { width: 70%; } 100% { width: 100%; } }`}</style>
    </div>
  );
}

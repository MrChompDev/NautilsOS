'use client';

export default function Welcome() {
  return (
    <div className="welcome-layout">
      <div className="welcome-header">
        <div className="welcome-avatar">
          <svg viewBox="0 0 64 64" width={52} height={52} fill="none">
            <defs>
              <linearGradient id="welcome-nautilus" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#4ADE80" />
              </linearGradient>
            </defs>
            <path d="M44 32c0-10-8-18-18-18S8 22 8 32s8 18 18 18c6 0 11-3 13-8"
              stroke="url(#welcome-nautilus)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M43 42c-3 6-9 10-17 10C14 52 8 44 8 34c0-5 2-9.5 5.5-13"
              stroke="url(#welcome-nautilus)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
            <path d="M26 14c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7z"
              fill="rgba(56,189,248,0.08)" stroke="url(#welcome-nautilus)" strokeWidth="1" />
          </svg>
        </div>
        <h1 className="welcome-title">Welcome to NautilusOS</h1>
        <p className="welcome-subtitle">Explore Your Digital Ocean</p>
      </div>

      <div className="welcome-body">
        <div className="welcome-section">
          <h2>About</h2>
          <p>
            A browser-based operating system inspired by the deep sea.
            Navigate your digital world through a unique oceanic interface
            with draggable windows, immersive ambient sounds, and a suite
            of built-in apps.
          </p>
        </div>

        <div className="welcome-section">
          <h2>Built-in Apps</h2>
          <div className="welcome-apps-grid">
            <div className="welcome-app-item">
              <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#38BDF8" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>Current Browser</span>
            </div>
            <div className="welcome-app-item">
              <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#4ADE80" strokeWidth="2">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <span>Captain&apos;s Notes</span>
            </div>
            <div className="welcome-app-item">
              <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#FBBF24" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              <span>Tide Timer</span>
            </div>
            <div className="welcome-app-item">
              <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#F87171" strokeWidth="2">
                <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6h8M8 10h8M8 14h4M8 18h4" />
              </svg>
              <span>Depth Calculator</span>
            </div>
            <div className="welcome-app-item">
              <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#F8FAFC" strokeWidth="2">
                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
              </svg>
              <span>Ocean Waves</span>
            </div>
            <div className="welcome-app-item">
              <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#38BDF8" strokeWidth="2">
                <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
              </svg>
              <span>Lighthouse</span>
            </div>
          </div>
        </div>

        <div className="welcome-links">
          <h2>Find Me Online</h2>
          <div className="welcome-link-buttons">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="welcome-link">
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span>GitHub</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="welcome-link">
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M20 4l-6.768 6.768" />
              </svg>
              <span>Twitter</span>
            </a>
            <a href="https://hackclub.com" target="_blank" rel="noopener noreferrer" className="welcome-link">
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <span>Hack Club</span>
            </a>
            <a href="#" className="welcome-link">
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
              </svg>
              <span>My Playlist</span>
            </a>
          </div>
        </div>
      </div>

      <div className="welcome-footer">
        <p>NautilusOS v2.0 &mdash; Built with Next.js &amp; Hack Club</p>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSetup, setIsSetup] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [wallpaper, setWallpaper] = useState('/wallpapers/deep-blue.svg');

  useEffect(() => {
    const stored = localStorage.getItem('nautilus_password');
    setIsSetup(!stored);
    const saved = localStorage.getItem('nautilus_wallpaper');
    if (saved) setWallpaper(saved);
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));
    };
    update();
    const id = setInterval(update, 1000);
    setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSetup) {
      if (!password) {
        setError('Enter a password.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 3) {
        setError('Password must be at least 3 characters.');
        return;
      }
      localStorage.setItem('nautilus_password', password);
      localStorage.setItem('nautilus_locked', 'false');
      onUnlock();
    } else {
      const stored = localStorage.getItem('nautilus_password');
      if (password === stored) {
        localStorage.setItem('nautilus_locked', 'false');
        onUnlock();
      } else {
        setError('Incorrect password.');
        setPassword('');
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }
  };

  return (
    <div className="lockscreen" onContextMenu={(e) => e.preventDefault()}
      style={{ backgroundImage: `url(${wallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="lockscreen-overlay" />
      <form className="lockscreen-form" onSubmit={handleSubmit}>
        <div className="lockscreen-logo">
          <img src="/images/nautilus-logo.svg" alt="NautilusOS" width={160} height={160} />
        </div>

        <div className="lockscreen-time">{time}</div>
        <div className="lockscreen-date">{date}</div>

        <div className="lockscreen-input-group">
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" className="lockscreen-input-icon">
            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <input
            ref={inputRef}
            type="password"
            placeholder={isSetup ? 'Create password' : 'Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="lockscreen-input"
            autoFocus
          />
        </div>

        {isSetup && (
          <div className="lockscreen-input-group">
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" className="lockscreen-input-icon">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="lockscreen-input"
            />
          </div>
        )}

        {error && <p className="lockscreen-error">{error}</p>}

        <button type="submit" className="lockscreen-submit">
          <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          <span>{isSetup ? 'Set Password' : 'Unlock'}</span>
        </button>

        {!isSetup && (
          <p className="lockscreen-hint">Press Enter to unlock</p>
        )}
      </form>
    </div>
  );
}

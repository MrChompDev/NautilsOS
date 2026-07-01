'use client';

import { useState, useEffect } from 'react';
import { useDesktop } from '@/hooks/useDesktop';
import { getApp } from '@/lib/appRegistry';
import { NautilusIcon, SearchIcon } from '@/lib/icons';

export default function Tidebar() {
  const { windows, focusWindow, minimizeWindow, openWindow, setStartOpen, setSearchOpen, notifications } = useDesktop();
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString([], { month: 'short', day: 'numeric' }));
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div id="tidebar">
      <div className="tidebar-left">
        <button className="tidebar-icon launchpad" title="Launchpad"
          onClick={(e) => { e.stopPropagation(); setStartOpen(true); }}>
          <NautilusIcon />
        </button>
        <button className="tidebar-icon" title="Sonar Search"
          onClick={() => setSearchOpen(true)}>
          <SearchIcon />
        </button>
      </div>

      <div id="tidebar-center">
        {windows.map((w) => {
          const app = getApp(w.appId);
          return (
            <div
              key={w.id}
              className={`tide-task ${!w.minimized ? 'active' : ''}`}
              onClick={() => w.minimized ? minimizeWindow(w.id) : focusWindow(w.id)}
            >
              {app?.icon && <span style={{ display: 'flex' }}>{app.icon()}</span>}
              <span>{w.title}</span>
            </div>
          );
        })}
      </div>

      <div className="tidebar-right">
        <button className="tidebar-icon" title="Bottled Messages" onClick={() => openWindow('notifications-panel')}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
        </button>
        <button className="tidebar-icon" title="Lock Screen" onClick={() => {
          localStorage.setItem('nautilus_locked', 'true');
          window.location.reload();
        }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </button>
        <div id="tidebar-clock">
          <span id="clock-time">{time}</span>
          <span id="clock-date">{date}</span>
        </div>
      </div>
    </div>
  );
}

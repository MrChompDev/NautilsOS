'use client';

import { useState, useEffect, useRef } from 'react';
import { useDesktop } from '@/hooks/useDesktop';
import { getAllApps } from '@/lib/appRegistry';
import { NautilusIcon, SettingsIcon } from '@/lib/icons';

export default function StartMenu() {
  const { isStartOpen, setStartOpen, openWindow } = useDesktop();
  const [filter, setFilter] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStartOpen) {
      setFilter('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isStartOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setStartOpen(false);
      }
    };
    if (isStartOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isStartOpen, setStartOpen]);

  const apps = getAllApps().filter((a) =>
    a.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      {isStartOpen && <div className="backdrop" onClick={() => setStartOpen(false)} />}
      <div ref={menuRef} className={`start-menu glass ${isStartOpen ? 'visible' : ''}`}>
        <div className="start-header">
          <NautilusIcon />
          <span>NautilusOS</span>
          <span className="start-version">v2.0</span>
        </div>
        <div className="start-search">
          <input ref={inputRef} type="text" placeholder="Search apps..." value={filter}
            onChange={(e) => setFilter(e.target.value)} />
        </div>
        <div className="start-apps">
          {apps.map((app) => (
            <button key={app.id} className="start-app-item"
              onClick={() => { openWindow(app.id, app.defaults); setStartOpen(false); }}>
              <span style={{ width: 24, height: 24 }}>{app.icon()}</span>
              <span>{app.name}</span>
            </button>
          ))}
        </div>
        <div className="start-footer">
          <button className="start-footer-btn"
            onClick={() => { openWindow('settings', { width: 640, height: 460 }); setStartOpen(false); }}>
            <SettingsIcon />
            Captain&apos;s Log
          </button>
        </div>
      </div>
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { FileSystem } from '@/lib/fileSystem';
import { NautilusLargeIcon, StarIcon } from '@/lib/icons';
import { useDesktop } from '@/hooks/useDesktop';

const WALLPAPERS = [
  { id: 'deep-blue', name: 'Deep Blue', path: '/wallpapers/deep-blue.svg', colors: ['#0A2342', '#030B16'] },
  { id: 'abyssal', name: 'Abyssal', path: '/wallpapers/abyssal.svg', colors: ['#050B14', '#010306'] },
  { id: 'coral', name: 'Coral Reef', path: '/wallpapers/coral.svg', colors: ['#0A2342', '#1A3D5C'] },
  { id: 'aurora', name: 'Aurora', path: '/wallpapers/aurora.svg', colors: ['#020810', '#030B16'] },
  { id: 'sunlight', name: 'Sunlight', path: '/wallpapers/sunlight.svg', colors: ['#0F3B5E', '#06121E'] },
];

export default function Settings() {
  const { sendNotification } = useDesktop();
  const [section, setSection] = useState('appearance');
  const [currentWallpaper, setCurrentWallpaper] = useState('/wallpapers/deep-blue.svg');

  useEffect(() => {
    const saved = localStorage.getItem('nautilus_wallpaper');
    if (saved) setCurrentWallpaper(saved);
  }, []);

  const setWallpaper = (path: string) => {
    setCurrentWallpaper(path);
    localStorage.setItem('nautilus_wallpaper', path);
    window.dispatchEvent(new Event('storage'));
    sendNotification('Wallpaper', 'Ocean depths transformed.');
  };

  const sections = [
    { id: 'appearance', label: 'Appearance', icon: 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42' },
    { id: 'system', label: 'System', icon: 'M2 3h20v14H2zM8 21h8M12 17v4' },
    { id: 'about', label: 'About', icon: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 16v-4M12 8h.01' },
  ];

  return (
    <div className="settings-layout">
      <div className="settings-sidebar">
        {sections.map((s) => (
          <button key={s.id}
            className={`settings-sidebar-item ${section === s.id ? 'active' : ''}`}
            onClick={() => setSection(s.id)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={s.icon} />
            </svg>
            {s.label}
          </button>
        ))}
      </div>

      <div className="settings-main">
        {section === 'appearance' && (
          <div className="settings-section">
            <h2>Appearance</h2>
            <div className="settings-card">
              <h3>Ocean Wallpaper</h3>
              <p>Choose your ocean depth backdrop.</p>
              <div className="settings-wallpapers">
                {WALLPAPERS.map((wp) => (
                  <button key={wp.id}
                    className={`settings-wallpaper-btn ${currentWallpaper === wp.path ? 'active' : ''}`}
                    onClick={() => setWallpaper(wp.path)}>
                    <div className="settings-wallpaper-preview" style={{
                      background: `linear-gradient(135deg, ${wp.colors[0]}, ${wp.colors[1]})`,
                    }} />
                    <span>{wp.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="settings-card">
              <div className="settings-toggle">
                <span>Ocean Ambient Effects</span>
                <button className="toggle-switch active" />
              </div>
              <p>Animated particles, light rays, and bubble effects.</p>
            </div>
          </div>
        )}

        {section === 'system' && (
          <div className="settings-section">
            <h2>System</h2>
            <div className="settings-card">
              <h3>Storage</h3>
              <p>Virtual filesystem stored in your browser.</p>
              <p style={{ fontSize: 13, color: 'var(--text-primary)' }}>Local storage used: {FileSystem.getStorageInfo()}</p>
            </div>
            <div className="settings-card">
              <h3>Data Management</h3>
              <button className="danger-btn" onClick={() => {
                if (confirm('Clear all NautilusOS data? This cannot be undone.')) {
                  FileSystem.reset();
                  sendNotification('Captain\'s Log', 'All data cleared. Reloading...');
                  setTimeout(() => window.location.reload(), 1000);
                }
              }}>Clear All Data</button>
              <p>This will reset your filesystem, notes, and settings.</p>
            </div>
          </div>
        )}

        {section === 'about' && (
          <div className="settings-section">
            <h2>About NautilusOS</h2>
            <div className="settings-card" style={{ textAlign: 'center', padding: 32 }}>
              <NautilusLargeIcon />
              <h3 style={{ fontSize: 20, marginBottom: 4, marginTop: 12 }}>NautilusOS</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>Version 2.0.0</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>&ldquo;Explore Your Digital Ocean.&rdquo;</p>
              <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                <p>Built with Next.js, TypeScript, Three.js</p>
                <p>Inspired by the mysteries of the deep ocean.</p>
                <p>NautilusOS &mdash; Navigate Without Limits.</p>
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 4 }}>
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

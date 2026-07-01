'use client';

import { useState, useRef, useEffect } from 'react';
import { useDesktop } from '@/hooks/useDesktop';
import { getApp, getAllApps } from '@/lib/appRegistry';
import { FileSystem } from '@/lib/fileSystem';
import { SearchIcon, FolderIcon, FileIcon } from '@/lib/icons';

export default function SonarSearch() {
  const { isSearchOpen, setSearchOpen, openWindow } = useDesktop();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isSearchOpen, setSearchOpen]);

  let results: React.ReactNode = null;

  if (query.trim()) {
    const q = query.toLowerCase();
    const fileResults = FileSystem.search(q);
    const appResults = getAllApps().filter((a) =>
      a.name.toLowerCase().includes(q)
    );

    const items: React.ReactNode[] = [];

    appResults.forEach((app) => {
      items.push(
        <div key={`app-${app.id}`} className="sonar-result" onClick={() => { openWindow(app.id, app.defaults); setSearchOpen(false); }}>
          <span style={{ width: 18, height: 18 }}>{app.icon()}</span>
          <span>{app.name}</span>
          <span className="sonar-desc">App</span>
        </div>
      );
    });

    fileResults.slice(0, 8).forEach((f) => {
      items.push(
        <div key={`file-${f.path}`} className="sonar-result" onClick={() => { openWindow('explorer'); setSearchOpen(false); }}>
          {f.type === 'folder' ? <span style={{ width: 18, height: 18 }}><FolderIcon /></span> : <span style={{ width: 18, height: 18 }}><FileIcon /></span>}
          <span>{f.name}</span>
          <span className="sonar-desc">{f.path}</span>
        </div>
      );
    });

    if (items.length === 0) {
      items.push(
        <div key="empty" className="sonar-result" style={{ justifyContent: 'center', color: '#94A3B8' }}>
          Nothing found — ask Lighthouse?
        </div>
      );
    }

    results = <>{items}</>;
  }

  return (
    <>
      {isSearchOpen && <div className="backdrop" onClick={() => setSearchOpen(false)} />}
      <div className={`sonar-search glass ${isSearchOpen ? 'visible' : ''}`}>
        <div className="sonar-header">
          <SearchIcon />
          <span>Sonar Search</span>
        </div>
        <input ref={inputRef} type="text" className="sonar-input" placeholder="Search apps, files, or ask Lighthouse..."
          value={query} onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSearchOpen(false);
          }} />
        <div className="sonar-results">{results}</div>
      </div>
    </>
  );
}

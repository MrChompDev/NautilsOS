'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileSystem } from '@/lib/fileSystem';
import { useDesktop } from '@/hooks/useDesktop';
import type { FileEntry } from '@/lib/types';
import { HomeIcon, DocIcon, DownloadIcon, PictureIcon, TrashIcon } from '@/lib/icons';

const folderColors = ['#FBBF24', '#F59E0B', '#F97316'];
const fileIcons: Record<string, string> = {
  folder: '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#FBBF24" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  file: '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#38BDF8" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  image: '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#4ADE80" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
  music: '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#4ADE80" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
};

function getFileIcon(name: string, type: string): string {
  if (type === 'folder') return fileIcons.folder;
  const ext = name.includes('.') ? name.split('.').pop()!.toLowerCase() : '';
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico'].includes(ext)) return fileIcons.image;
  if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(ext)) return fileIcons.music;
  return fileIcons.file;
}

export default function Explorer() {
  const { sendNotification, setActiveDriftwood } = useDesktop();
  const [currentPath, setCurrentPath] = useState('');
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; entry: FileEntry } | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const refresh = useCallback(() => {
    let list = FileSystem.list(currentPath);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((e) => e.name.toLowerCase().includes(q));
    setEntries(list);
  }, [currentPath, search]);

  useEffect(() => { refresh(); }, [refresh]);

  const navigate = (path: string) => {
    const newHist = history.slice(0, historyIdx + 1);
    newHist.push(path);
    setHistory(newHist);
    setHistoryIdx(newHist.length - 1);
    setCurrentPath(path);
    setSelectedFile(null);
  };

  const goBack = () => {
    if (historyIdx > 0) {
      const idx = historyIdx - 1;
      setHistoryIdx(idx);
      setCurrentPath(history[idx]);
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      const idx = historyIdx + 1;
      setHistoryIdx(idx);
      setCurrentPath(history[idx]);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, entry: FileEntry) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, entry });
  };

  useEffect(() => {
    if (!ctxMenu) return;
    const handler = () => setCtxMenu(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [ctxMenu]);

  const sidebarItems = [
    { label: 'Home', path: '', icon: HomeIcon },
    { label: 'Desktop', path: 'Desktop', icon: () => <span style={{ color: '#FBBF24' }}><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></span> },
    { label: 'Documents', path: 'Documents', icon: DocIcon },
    { label: 'Downloads', path: 'Downloads', icon: DownloadIcon },
    { label: 'Pictures', path: 'Pictures', icon: PictureIcon },
    { label: 'Music', path: 'Music', icon: () => <span style={{ color: '#4ADE80' }}><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></span> },
    { label: 'Driftwood', path: '__driftwood__', icon: TrashIcon },
  ];

  return (
    <div className="explorer-layout" onContextMenu={(e) => { if (!ctxMenu) { e.preventDefault(); setCtxMenu(null); } }}>
      <div className="explorer-sidebar">
        {sidebarItems.map((item) => (
          <button key={item.label}
            className={`explorer-sidebar-item ${currentPath === item.path ? 'active' : ''}`}
            onClick={() => {
              if (item.path === '__driftwood__') {
                setActiveDriftwood(true);
              } else {
                navigate(item.path);
              }
            }}>
            <item.icon />
            {item.label}
          </button>
        ))}
      </div>

      <div className="explorer-main">
        <div className="explorer-toolbar">
          <button onClick={goBack} disabled={historyIdx <= 0} style={{ opacity: historyIdx <= 0 ? 0.3 : 1 }}>&#x2190;</button>
          <button onClick={goForward} disabled={historyIdx >= history.length - 1} style={{ opacity: historyIdx >= history.length - 1 ? 0.3 : 1 }}>&#x2192;</button>
          <input type="text" value={'/' + currentPath} readOnly />
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 160 }} />
          <button onClick={() => {
            const name = prompt('Folder name:');
            if (name && FileSystem.createFolder(currentPath, name)) {
              refresh();
              sendNotification('Explorer', `Folder "${name}" created.`);
            }
          }}>+ Folder</button>
        </div>

        <div className="explorer-files">
          {currentPath && !search && (
            <div className="explorer-file folder" onDoubleClick={() => {
              const parts = currentPath.split('/').filter(Boolean);
              parts.pop();
              navigate(parts.join('/'));
            }}>
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#94A3B8" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              <span>..</span>
            </div>
          )}

          {entries.map((entry) => (
            <div key={entry.name}
              className={`explorer-file ${entry.type}${selectedFile === entry.name ? ' selected' : ''}`}
              onDoubleClick={() => {
                if (entry.type === 'folder') {
                  navigate(currentPath ? `${currentPath}/${entry.name}` : entry.name);
                } else {
                  sendNotification('Explorer', `Opening "${entry.name}"`);
                }
              }}
              onClick={() => setSelectedFile(entry.name)}
              onContextMenu={(e) => handleContextMenu(e, entry)}>
              <span dangerouslySetInnerHTML={{ __html: getFileIcon(entry.name, entry.type) }} />
              <span>{entry.name}</span>
            </div>
          ))}

          {entries.length === 0 && (
            <div className="empty-files">
              {search ? 'No matching files.' : 'This folder is empty.'}
            </div>
          )}
        </div>
      </div>

      {ctxMenu && (
        <div className="explorer-context-menu" style={{ left: ctxMenu.x, top: ctxMenu.y }}>
          <button className="context-item" onClick={() => {
            if (ctxMenu.entry.type === 'folder') {
              navigate(currentPath ? `${currentPath}/${ctxMenu.entry.name}` : ctxMenu.entry.name);
            }
            setCtxMenu(null);
          }}>Open</button>
          <button className="context-item danger" onClick={() => {
            const fullPath = currentPath ? `${currentPath}/${ctxMenu.entry.name}` : ctxMenu.entry.name;
            if (confirm(`Send "${ctxMenu.entry.name}" to Driftwood?`)) {
              FileSystem.delete(fullPath);
              refresh();
              sendNotification('Explorer', `"${ctxMenu.entry.name}" moved to Driftwood.`);
            }
            setCtxMenu(null);
          }}>Delete</button>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';

interface Note {
  id: string;
  title: string;
  body: string;
  created: number;
  updated: number;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('nautilus_notes') || '[]') as Note[];
      setNotes(stored);
      if (stored.length > 0) {
        setActiveId(stored[0].id);
        setTitle(stored[0].title);
        setBody(stored[0].body);
      }
    } catch { /* ignore */ }
  }, []);

  const persist = useCallback((updated: Note[]) => {
    localStorage.setItem('nautilus_notes', JSON.stringify(updated));
  }, []);

  useEffect(() => {
    if (!dirty || !activeId) return;
    const timer = setTimeout(() => {
      setNotes((prev) => {
        const next = prev.map((n) =>
          n.id === activeId ? { ...n, title: title || 'Untitled', body, updated: Date.now() } : n
        );
        persist(next);
        return next;
      });
      setDirty(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [dirty, activeId, title, body, persist]);

  const createNote = () => {
    const id = `note_${Date.now()}`;
    const note: Note = { id, title: 'Untitled', body: '', created: Date.now(), updated: Date.now() };
    setNotes((prev) => {
      const next = [note, ...prev];
      persist(next);
      return next;
    });
    setActiveId(id);
    setTitle('Untitled');
    setBody('');
    setDirty(false);
  };

  const selectNote = (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      setActiveId(id);
      setTitle(note.title);
      setBody(note.body);
      setDirty(false);
    }
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      persist(next);
      return next;
    });
    if (activeId === id) {
      const remaining = notes.filter((n) => n.id !== id);
      if (remaining.length > 0) {
        selectNote(remaining[0].id);
      } else {
        setActiveId(null);
        setTitle('');
        setBody('');
      }
    }
  };

  return (
    <div className="notes-layout">
      <div className="notes-sidebar">
        <div className="notes-sidebar-header">
          <span>{notes.length} note(s)</span>
          <button onClick={createNote}>+</button>
        </div>
        <div className="notes-list">
          {notes.map((note) => (
            <div key={note.id}
              className={`notes-list-item ${note.id === activeId ? 'active' : ''}`}
              onClick={() => selectNote(note.id)}>
              <div className="note-title">{note.title || 'Untitled'}</div>
              <div className="note-preview">{(note.body || '').slice(0, 50) || 'Empty note'}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="notes-editor">
        <input type="text" value={title} onChange={(e) => { setTitle(e.target.value); setDirty(true); }}
          placeholder="Note title..." disabled={!activeId} />
        <textarea value={body} onChange={(e) => { setBody(e.target.value); setDirty(true); }}
          placeholder="Start writing..." disabled={!activeId} />
      </div>
    </div>
  );
}

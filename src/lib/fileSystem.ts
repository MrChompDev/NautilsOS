'use client';

import type { FileNode, FileEntry, FileSearchResult } from './types';

const STORAGE_KEY = 'nautilus_fs';

function createDefaultFS(): FileNode {
  return {
    type: 'folder',
    children: {
      Desktop: { type: 'folder', children: {} },
      Documents: {
        type: 'folder',
        children: {
          Notes: { type: 'folder', children: {} },
          Projects: { type: 'folder', children: {} },
        },
      },
      Music: { type: 'folder', children: {} },
      Downloads: { type: 'folder', children: {} },
      Pictures: { type: 'folder', children: {} },
    },
  };
}

let fs: FileNode | null = null;

function loadFS(): FileNode {
  if (fs) return fs;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    fs = stored ? (JSON.parse(stored) as FileNode) : createDefaultFS();
  } catch {
    fs = createDefaultFS();
  }
  return fs;
}

function saveFS(): void {
  if (fs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fs));
  }
}

function getNode(path: string): FileNode | null {
  const root = loadFS();
  if (!path) return root;
  const parts = path.split('/').filter(Boolean);
  let node: FileNode = root;
  for (const part of parts) {
    if (node.children?.[part]) {
      node = node.children[part];
    } else {
      return null;
    }
  }
  return node;
}

function getParent(
  path: string
): { node: FileNode; name: string } | null {
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return null;
  const parentPath = parts.slice(0, -1).join('/');
  const node = getNode(parentPath);
  if (!node) return null;
  return { node, name: parts[parts.length - 1] };
}

export const FileSystem = {
  init(): void {
    loadFS();
  },

  list(path = ''): FileEntry[] {
    const node = getNode(path);
    if (!node || node.type !== 'folder') return [];
    const entries: FileEntry[] = [];
    for (const [name, child] of Object.entries(node.children ?? {})) {
      entries.push({ name, ...child });
    }
    entries.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    return entries;
  },

  createFile(path: string, name: string, content = ''): boolean {
    const node = getNode(path);
    if (!node || node.type !== 'folder' || node.children?.[name]) return false;
    node.children = node.children ?? {};
    node.children[name] = {
      type: 'file',
      content,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };
    saveFS();
    return true;
  },

  createFolder(path: string, name: string): boolean {
    const node = getNode(path);
    if (!node || node.type !== 'folder' || node.children?.[name]) return false;
    node.children = node.children ?? {};
    node.children[name] = {
      type: 'folder',
      children: {},
      createdAt: Date.now(),
    };
    saveFS();
    return true;
  },

  delete(path: string): boolean {
    const parent = getParent(path);
    if (!parent) return false;
    delete parent.node.children?.[parent.name];
    saveFS();
    return true;
  },

  readFile(path: string): string | null {
    const node = getNode(path);
    if (!node || node.type !== 'file') return null;
    return node.content ?? '';
  },

  writeFile(path: string, content: string): boolean {
    const node = getNode(path);
    if (!node || node.type !== 'file') return false;
    node.content = content;
    node.modifiedAt = Date.now();
    saveFS();
    return true;
  },

  search(query: string, path = ''): FileSearchResult[] {
    const results: FileSearchResult[] = [];
    const entries = this.list(path);
    for (const entry of entries) {
      const fullPath = path ? `${path}/${entry.name}` : entry.name;
      if (entry.name.toLowerCase().includes(query.toLowerCase())) {
        results.push({ name: entry.name, path: fullPath, type: entry.type });
      }
      if (entry.type === 'folder') {
        results.push(...this.search(query, fullPath));
      }
    }
    return results;
  },

  getStorageInfo(): string {
    const raw = localStorage.getItem(STORAGE_KEY) || '{}';
    return `${(new Blob([raw]).size / 1024).toFixed(1)} KB`;
  },

  reset(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('nautilus_notes');
    localStorage.removeItem('nautilus_driftwood');
    localStorage.removeItem('nautilus_sessions');
    fs = null;
    loadFS();
  },
};

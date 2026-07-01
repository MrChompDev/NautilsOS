export interface FileNode {
  type: 'file' | 'folder';
  content?: string;
  children?: Record<string, FileNode>;
  createdAt?: number;
  modifiedAt?: number;
}

export interface FileEntry {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: Record<string, FileNode>;
  createdAt?: number;
  modifiedAt?: number;
}

export interface FileSearchResult {
  name: string;
  path: string;
  type: 'file' | 'folder';
}

export interface Notification {
  id: number;
  title: string;
  text: string;
  icon: string;
  time: Date;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  minimized: boolean;
  maximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  prevBounds?: { x: number; y: number; width: number; height: number };
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: () => React.ReactElement;
  defaults?: Partial<{
    width: number;
    height: number;
    x: number;
    y: number;
  }>;
}

export interface DesktopContextType {
  windows: WindowState[];
  openWindow: (appId: string, opts?: Partial<WindowState>) => string;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  notifications: Notification[];
  sendNotification: (title: string, text: string, icon?: string) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isStartOpen: boolean;
  setStartOpen: (open: boolean) => void;
  activeDriftwood: boolean;
  setActiveDriftwood: (active: boolean) => void;
}

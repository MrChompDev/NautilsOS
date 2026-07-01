'use client';

import React, { createContext, useContext, useCallback, useState, useRef } from 'react';
import type { WindowState, Notification, DesktopContextType } from '@/lib/types';

const DesktopContext = createContext<DesktopContextType | null>(null);

export function useDesktop(): DesktopContextType {
  const ctx = useContext(DesktopContext);
  if (!ctx) throw new Error('useDesktop must be used within DesktopProvider');
  return ctx;
}

export function DesktopProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isStartOpen, setStartOpen] = useState(false);
  const [activeDriftwood, setActiveDriftwood] = useState(false);
  const counterRef = useRef(0);
  const zRef = useRef(100);

  const openWindow = useCallback((appId: string, opts?: Partial<WindowState>) => {
    counterRef.current++;
    const id = `win-${counterRef.current}`;
    zRef.current++;
    const vw = window.innerWidth;
    const vh = window.innerHeight - 48;
    const offset = ((counterRef.current * 24) % 240);
    const win: WindowState = {
      id,
      appId,
      title: opts?.title || appId,
      minimized: false,
      maximized: false,
      x: opts?.x ?? (40 + offset),
      y: opts?.y ?? (20 + (counterRef.current * 20) % 180),
      width: opts?.width ?? 640,
      height: opts?.height ?? 440,
      zIndex: zRef.current,
    };
    setWindows((prev) => [...prev, win]);
    return id;
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w))
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized) {
          return {
            ...w,
            maximized: false,
            x: w.prevBounds?.x ?? 60,
            y: w.prevBounds?.y ?? 40,
            width: w.prevBounds?.width ?? 640,
            height: w.prevBounds?.height ?? 440,
            prevBounds: undefined,
          };
        }
        return {
          ...w,
          maximized: true,
          prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight - 48,
        };
      })
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    zRef.current++;
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return { ...w, zIndex: zRef.current, minimized: false };
        }
        return w;
      })
    );
  }, []);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w))
    );
  }, []);

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, width, height } : w))
    );
  }, []);

  const sendNotification = useCallback((title: string, text: string, icon = 'bell') => {
    const notif: Notification = { id: Date.now() + Math.random(), title, text, icon, time: new Date() };
    setNotifications((prev) => [notif, ...prev].slice(0, 20));
  }, []);

  return (
    <DesktopContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        updateWindowPosition,
        updateWindowSize,
        notifications,
        sendNotification,
        isSearchOpen,
        setSearchOpen,
        isStartOpen,
        setStartOpen,
        activeDriftwood,
        setActiveDriftwood,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
}

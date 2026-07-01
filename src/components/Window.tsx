'use client';

import { useRef, useCallback, type ReactNode } from 'react';
import { useDesktop } from '@/hooks/useDesktop';
import { getApp } from '@/lib/appRegistry';
import type { WindowState } from '@/lib/types';

interface WindowProps {
  win: WindowState;
  children: ReactNode;
}

export default function Window({ win, children }: WindowProps) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition, updateWindowSize } = useDesktop();
  const dragRef = useRef<{ startX: number; startY: number; startLeft: number; startTop: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; startW: number; startH: number } | null>(null);
  const elRef = useRef<HTMLDivElement>(null);
  const app = getApp(win.appId);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    if (win.maximized) return;
    dragRef.current = {
      startX: e.clientX, startY: e.clientY,
      startLeft: win.x, startTop: win.y,
    };
    focusWindow(win.id);

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      updateWindowPosition(
        win.id,
        dragRef.current.startLeft + ev.clientX - dragRef.current.startX,
        dragRef.current.startTop + ev.clientY - dragRef.current.startY
      );
    };
    const onUp = () => { dragRef.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [win, focusWindow, updateWindowPosition]);

  const handleResizeDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    resizeRef.current = { startX: e.clientX, startY: e.clientY, startW: win.width, startH: win.height };
    const onMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return;
      updateWindowSize(
        win.id,
        Math.max(320, resizeRef.current.startW + ev.clientX - resizeRef.current.startX),
        Math.max(200, resizeRef.current.startH + ev.clientY - resizeRef.current.startY)
      );
    };
    const onUp = () => { resizeRef.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [win, updateWindowSize]);

  if (win.minimized) return null;

  const isFocused = win.zIndex === Math.max(...Array.from(document.querySelectorAll('.window')).length > 0 ? [win.zIndex] : [0]);

  return (
    <div
      ref={elRef}
      className={`window${win.maximized ? ' maximized' : ''}`}
      style={{
        left: win.x, top: win.y,
        width: win.width, height: win.height,
        zIndex: win.zIndex,
        borderColor: isFocused ? 'rgba(56, 189, 248, 0.3)' : undefined,
      }}
      onMouseDown={() => focusWindow(win.id)}
      onDoubleClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.window-titlebar') && !target.closest('.window-controls')) {
          maximizeWindow(win.id);
        }
      }}
    >
      <div className="window-titlebar" onMouseDown={handleMouseDown}
        style={{ background: isFocused ? 'rgba(56, 189, 248, 0.08)' : undefined }}>
        <div className="window-title">
          <span style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{app?.icon?.()}</span>
          <span>{win.title}</span>
        </div>
        <div className="window-controls">
          <button className="window-btn win-close" data-tip="Close" onClick={() => closeWindow(win.id)} />
          <button className="window-btn win-minimize" data-tip="Minimize" onClick={() => minimizeWindow(win.id)} />
          <button className="window-btn win-maximize" data-tip="Maximize" onClick={() => maximizeWindow(win.id)} />
        </div>
      </div>
      <div className="window-content">
        {children}
      </div>
      <div
        onMouseDown={handleResizeDown}
        style={{ position: 'absolute', right: 0, bottom: 0, width: 12, height: 12, cursor: 'nwse-resize' }}
      />
    </div>
  );
}

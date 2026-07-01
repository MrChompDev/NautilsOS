'use client';

import React, { useState } from 'react';
import { useDesktop } from '@/hooks/useDesktop';
import { getAllApps } from '@/lib/appRegistry';
import { ExplorerIcon, BrowserIcon, NotesIcon, MusicIcon, TimerIcon, CalculatorIcon, LighthouseIcon, SettingsIcon, WelcomeIcon } from '@/lib/icons';

const iconMap: Record<string, React.ComponentType> = {
  explorer: ExplorerIcon,
  browser: BrowserIcon,
  notes: NotesIcon,
  music: MusicIcon,
  timer: TimerIcon,
  calculator: CalculatorIcon,
  lighthouse: LighthouseIcon,
  settings: SettingsIcon,
  welcome: WelcomeIcon,
};

export default function DesktopIcons() {
  const { openWindow } = useDesktop();
  const apps = getAllApps();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleClick = (appId: string) => {
    if (selectedId === appId) {
      setSelectedId(null);
    } else {
      setSelectedId(appId);
    }
  };

  const handleDoubleClick = (appId: string, defaults?: { width?: number; height?: number }) => {
    setSelectedId(null);
    openWindow(appId, defaults);
  };

  const handleBlankClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.desktop-icon')) return;
    setSelectedId(null);
  };

  return (
    <div id="desktop-icons" onClick={handleBlankClick}>
      {apps.map((app) => {
        const Icon = iconMap[app.id];
        return (
          <div key={app.id}
            className={`desktop-icon ${selectedId === app.id ? 'selected' : ''}`}
            onClick={() => handleClick(app.id)}
            onDoubleClick={() => handleDoubleClick(app.id, app.defaults)}>
            <Icon />
            <span>{app.name}</span>
          </div>
        );
      })}
    </div>
  );
}

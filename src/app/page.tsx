'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { DesktopProvider, useDesktop } from '@/hooks/useDesktop';
import { FileSystem } from '@/lib/fileSystem';
import { registerDefaultApps } from '@/lib/appRegistry';
import OceanBackground from '@/components/OceanBackground';
import DesktopIcons from '@/components/DesktopIcons';
import Tidebar from '@/components/Tidebar';
import StartMenu from '@/components/StartMenu';
import SonarSearch from '@/components/SonarSearch';
import BottledMessage from '@/components/BottledMessage';
import LockScreen from '@/components/LockScreen';
import Window from '@/components/Window';
import Explorer from '@/components/apps/Explorer';
import Browser from '@/components/apps/Browser';
import Notes from '@/components/apps/Notes';
import Music from '@/components/apps/Music';
import Timer from '@/components/apps/Timer';
import Calculator from '@/components/apps/Calculator';
import Settings from '@/components/apps/Settings';
import Lighthouse from '@/components/apps/Lighthouse';
import Welcome from '@/components/apps/Welcome';

const appComponents: Record<string, ComponentType> = {
  explorer: Explorer,
  browser: Browser,
  notes: Notes,
  music: Music,
  timer: Timer,
  calculator: Calculator,
  settings: Settings,
  lighthouse: Lighthouse,
  welcome: Welcome,
};

function NotificationsPanel() {
  const { notifications } = useDesktop();
  return (
    <div style={{ padding: 12, color: 'var(--text-primary)', overflow: 'auto', height: '100%' }}>
      <h3 style={{ marginBottom: 8, fontSize: 14 }}>Bottled Messages</h3>
      {notifications.length === 0 && (
        <p style={{ color: '#94A3B8', fontSize: 13 }}>No bottled messages yet.</p>
      )}
      {notifications.map((n) => (
        <div key={n.id} className="notification-item" style={{ marginBottom: 6 }}>
          <div className="notification-body">
            <div className="notification-title">{n.title}</div>
            <div className="notification-text">{n.text}</div>
            <div className="notification-time">
              {n.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AppRenderer({ appId, winId }: { appId: string; winId: string }) {
  if (appId === 'notifications-panel') {
    return <NotificationsPanel />;
  }
  const Component = appComponents[appId];
  if (!Component) {
    return (
      <div style={{ padding: 20, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p>App not found: {appId}</p>
      </div>
    );
  }
  return <Component />;
}

function DesktopContent() {
  const { windows, sendNotification, openWindow } = useDesktop();

  useEffect(() => {
    registerDefaultApps();
    FileSystem.init();

    const firstRun = localStorage.getItem('nautilus_first_run');
    if (!firstRun) {
      setTimeout(() => {
        openWindow('welcome', { width: 480, height: 520 });
      }, 600);
      localStorage.setItem('nautilus_first_run', 'done');
    }

    sendNotification('Welcome', 'NautilusOS has surfaced. Explore your digital ocean.');
  }, [sendNotification, openWindow]);

  return (
    <>
      <OceanBackground />
      <div id="ocean-surface">
        <DesktopIcons />
        <div id="window-container">
          {windows.map((win) => (
            <Window key={win.id} win={win}>
              <AppRenderer appId={win.appId} winId={win.id} />
            </Window>
          ))}
        </div>
      </div>
      <Tidebar />
      <StartMenu />
      <SonarSearch />
      <BottledMessage />
    </>
  );
}

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);
  const [init, setInit] = useState(false);

  useEffect(() => {
    const locked = localStorage.getItem('nautilus_locked') !== 'false';
    if (!locked) setUnlocked(true);
    setInit(true);
  }, []);

  if (!init) return null;

  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <DesktopProvider>
      <DesktopContent />
    </DesktopProvider>
  );
}

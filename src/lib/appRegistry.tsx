import type { AppDefinition } from './types';
import { ExplorerIcon, BrowserIcon, NotesIcon, MusicIcon, TimerIcon, CalculatorIcon, SettingsIcon, LighthouseIcon, WelcomeIcon } from './icons';

const apps = new Map<string, AppDefinition>();

export function registerApp(def: AppDefinition): void {
  apps.set(def.id, def);
}

export function getApp(id: string): AppDefinition | undefined {
  return apps.get(id);
}

export function getAllApps(): AppDefinition[] {
  return Array.from(apps.values());
}

export function registerDefaultApps(): void {
  registerApp({ id: 'explorer', name: 'Nautilus Explorer', icon: ExplorerIcon, defaults: { width: 780, height: 500 } });
  registerApp({ id: 'browser', name: 'Current Browser', icon: BrowserIcon, defaults: { width: 800, height: 520 } });
  registerApp({ id: 'notes', name: "Captain's Notes", icon: NotesIcon, defaults: { width: 680, height: 460 } });
  registerApp({ id: 'music', name: 'Ocean Waves', icon: MusicIcon, defaults: { width: 380, height: 480 } });
  registerApp({ id: 'timer', name: 'Tide Timer', icon: TimerIcon, defaults: { width: 360, height: 420 } });
  registerApp({ id: 'calculator', name: 'Depth Calculator', icon: CalculatorIcon, defaults: { width: 300, height: 400 } });
  registerApp({ id: 'settings', name: "Captain's Log", icon: SettingsIcon, defaults: { width: 640, height: 460 } });
  registerApp({ id: 'lighthouse', name: 'Lighthouse', icon: LighthouseIcon, defaults: { width: 420, height: 520 } });
  registerApp({ id: 'welcome', name: 'Welcome', icon: WelcomeIcon, defaults: { width: 480, height: 520 } });
}

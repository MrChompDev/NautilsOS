import React from 'react';

type IconFn = () => React.ReactElement;

function svg(d: string, color = '#38BDF8', w = '1.5', size = 16): IconFn {
  return () => React.createElement('svg', {
    viewBox: '0 0 24 24',
    width: size,
    height: size,
    fill: 'none',
    stroke: color,
    strokeWidth: w,
    dangerouslySetInnerHTML: { __html: d },
  }) as React.ReactElement;
}

export const FolderIcon: IconFn = svg('<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>');
export const FileIcon: IconFn = svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>');
export const ExplorerIcon: IconFn = svg('<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>');
export const BrowserIcon: IconFn = svg('<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>');
export const NotesIcon: IconFn = svg('<path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>');
export const MusicIcon: IconFn = svg('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>');
export const TimerIcon: IconFn = svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>');
export const CalculatorIcon: IconFn = svg('<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h8M8 14h4M8 18h4"/>');
export const SettingsIcon: IconFn = svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>');
export const LighthouseIcon: IconFn = svg('<path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/>');
export const WelcomeIcon: IconFn = svg('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>', '#4ADE80');
export const HomeIcon: IconFn = svg('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>', '#94A3B8', '2');
export const DocIcon: IconFn = svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>', '#94A3B8', '2');
export const DownloadIcon: IconFn = svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>', '#94A3B8', '2');
export const TrashIcon: IconFn = svg('<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>', '#F87171', '2');
export const PictureIcon: IconFn = svg('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>', '#94A3B8', '2');
export const SearchIcon: IconFn = svg('<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/>', '#38BDF8', '2');
export const StarIcon: IconFn = svg('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', '#FBBF24', '2');

export const NautilusIcon: IconFn = () => React.createElement('svg', { viewBox: '0 0 32 32', width: 28, height: 28, fill: 'none' },
  React.createElement('defs', null,
    React.createElement('linearGradient', { id: 'nautilus-grad', x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
      React.createElement('stop', { offset: '0%', stopColor: '#38BDF8' }),
      React.createElement('stop', { offset: '100%', stopColor: '#4ADE80' }),
    ),
  ),
  React.createElement('path', {
    d: 'M22 16c0-5-4-9-9-9S4 11 4 16s4 9 9 9c3 0 5.5-1.5 6.5-4',
    stroke: 'url(#nautilus-grad)', strokeWidth: '2.2', strokeLinecap: 'round',
  }),
  React.createElement('path', {
    d: 'M21.5 21C20 24 17 26 13 26c-5.5 0-10-4.5-10-10S7.5 6 13 6s10 4.5 10 10',
    stroke: 'url(#nautilus-grad)', strokeWidth: '1.6', strokeLinecap: 'round', opacity: '0.35',
  }),
  React.createElement('path', {
    d: 'M13 6c-2 0-3.5 1.5-3.5 3.5S11 13 13 13s3.5-1.5 3.5-3.5S15 6 13 6z',
    fill: 'rgba(56,189,248,0.1)', stroke: 'url(#nautilus-grad)', strokeWidth: '1', strokeLinecap: 'round',
  }),
);

export const NautilusLargeIcon: IconFn = () => React.createElement('svg', { viewBox: '0 0 64 64', width: 48, height: 48, fill: 'none' },
  React.createElement('defs', null,
    React.createElement('linearGradient', { id: 'nautilus-lg', x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
      React.createElement('stop', { offset: '0%', stopColor: '#38BDF8' }),
      React.createElement('stop', { offset: '100%', stopColor: '#4ADE80' }),
    ),
  ),
  React.createElement('circle', { cx: 32, cy: 32, r: 28, stroke: 'rgba(56,189,248,0.1)', strokeWidth: '1' }),
  React.createElement('path', {
    d: 'M44 32c0-10-8-18-18-18S8 22 8 32s8 18 18 18c6 0 11-3 13-8',
    stroke: 'url(#nautilus-lg)', strokeWidth: '3.2', strokeLinecap: 'round',
  }),
  React.createElement('path', {
    d: 'M43 42c-3 6-9 10-17 10C14 52 8 44 8 34c0-5 2-9.5 5.5-13',
    stroke: 'url(#nautilus-lg)', strokeWidth: '2', strokeLinecap: 'round', opacity: '0.3',
  }),
  React.createElement('path', {
    d: 'M26 14c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7z',
    fill: 'rgba(56,189,248,0.08)', stroke: 'url(#nautilus-lg)', strokeWidth: '1.2',
  }),
);

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { audioEngine } from '@/lib/audioEngine';

const SOUNDS = [
  { id: 'ocean' as const, label: 'Ocean Waves', freq: 'Deep' },
  { id: 'whitenoise' as const, label: 'White Noise', freq: 'Full spectrum' },
  { id: 'brownnoise' as const, label: 'Brown Noise', freq: 'Deep rumble' },
  { id: 'rain' as const, label: 'Rain', freq: 'High' },
];

export default function Music() {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [bars, setBars] = useState<number[]>(Array(24).fill(4));
  const animRef = useRef<number>(0);

  const startVisualizer = useCallback(() => {
    function update() {
      setBars((prev) => prev.map(() => 4 + Math.random() * 80));
      animRef.current = requestAnimationFrame(update);
    }
    update();
  }, []);

  const stopVisualizer = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    setBars(Array(24).fill(4));
  }, []);

  const handlePlay = (id: string) => {
    if (activeSound === id && isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
      stopVisualizer();
      return;
    }
    audioEngine.start(id as any);
    setActiveSound(id);
    setIsPlaying(true);
    startVisualizer();
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
      stopVisualizer();
    } else if (activeSound) {
      audioEngine.start(activeSound as any);
      setIsPlaying(true);
      startVisualizer();
    }
  };

  const handleVolume = (v: number) => {
    setVolume(v);
    audioEngine.setVolume(v);
  };

  useEffect(() => {
    return () => { audioEngine.stop(); stopVisualizer(); };
  }, [stopVisualizer]);

  return (
    <div className="music-layout">
      <div className="music-current">{activeSound ? SOUNDS.find(s => s.id === activeSound)?.label : 'Select a sound'}</div>

      <div className="music-visualizer">
        {bars.map((h, i) => (
          <div key={i} className="music-bar" style={{ height: h }} />
        ))}
      </div>

      <div className="music-controls">
        <button className={`music-btn play ${isPlaying ? '' : ''}`} onClick={handleTogglePlay}>
          {isPlaying ? (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          )}
        </button>
      </div>

      <div className="music-sounds">
        {SOUNDS.map((s) => (
          <button key={s.id}
            className={`music-sound-btn ${activeSound === s.id && isPlaying ? 'active' : ''}`}
            onClick={() => handlePlay(s.id)}>
            <span className="sound-label">{s.label}</span>
            <span className="sound-freq">{s.freq}</span>
          </button>
        ))}
      </div>

      <div className="music-volume">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
        <input type="range" min="0" max="1" step="0.01" value={volume}
          onChange={(e) => handleVolume(parseFloat(e.target.value))} />
      </div>
    </div>
  );
}

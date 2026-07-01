'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDesktop } from '@/hooks/useDesktop';
import { audioEngine } from '@/lib/audioEngine';

const MODES = [
  { id: 'focus', label: 'Focus', time: 25 * 60 },
  { id: 'short', label: 'Short Break', time: 5 * 60 },
  { id: 'long', label: 'Long Break', time: 15 * 60 },
];

const circumference = 2 * Math.PI * 90;

export default function Timer() {
  const { sendNotification } = useDesktop();
  const [modeIdx, setModeIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MODES[0].time);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('nautilus_sessions');
    if (stored) setSessions(parseInt(stored, 10));
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const id = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          setIsRunning(false);
          const newSessions = parseInt(localStorage.getItem('nautilus_sessions') || '0', 10) + 1;
          localStorage.setItem('nautilus_sessions', newSessions.toString());
          setSessions(newSessions);
          sendNotification('Tide Timer', 'Session complete! Time for a break.');
          audioEngine.playChime();
          return MODES[modeIdx].time;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [isRunning, modeIdx, sendNotification]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(MODES[modeIdx].time);
  }, [modeIdx]);

  const toggleTimer = useCallback(() => {
    if (timeLeft <= 0) setTimeLeft(MODES[modeIdx].time);
    setIsRunning((p) => !p);
  }, [timeLeft, modeIdx]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progress = 1 - timeLeft / MODES[modeIdx].time;

  return (
    <div className="timer-layout">
      <div className="timer-ring-container">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle className="timer-ring-bg" cx="100" cy="100" r="90" />
          <circle className="timer-ring-progress" cx="100" cy="100" r="90"
            strokeDasharray={circumference} strokeDashoffset={circumference * progress} />
        </svg>
        <div className="timer-display">
          <div className="timer-time">{formatTime(timeLeft)}</div>
          <div className="timer-sessions">Sessions: {sessions}</div>
        </div>
      </div>

      <div className="timer-modes">
        {MODES.map((m, i) => (
          <button key={m.id}
            className={`timer-mode-btn ${i === modeIdx ? 'active' : ''}`}
            onClick={() => {
              setIsRunning(false);
              setModeIdx(i);
              setTimeLeft(m.time);
            }}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="timer-controls">
        <button className={`timer-ctrl-btn ${isRunning ? 'pause' : 'start'}`}
          onClick={toggleTimer}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button className="timer-ctrl-btn reset" onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}

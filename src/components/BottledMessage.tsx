'use client';

import { useEffect, useState } from 'react';
import { useDesktop } from '@/hooks/useDesktop';

export default function BottledMessage() {
  const { notifications, sendNotification } = useDesktop();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<{ title: string; text: string } | null>(null);

  useEffect(() => {
    if (notifications.length > 0) {
      const n = notifications[0];
      setCurrent({ title: n.title, text: n.text });
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  useEffect(() => {
    const phrases = [
      'The ocean is calm tonight.', 'Waves rolling gently.', 'A school of data fishes nearby.',
      'Currents are favorable.', 'Deep waters hold secrets.', 'The tide is rising.',
      'Sonar detects clear waters.', 'A warm current from the south.', 'The abyss is quiet.',
      'Bioluminescent glow on the horizon.',
    ];
    const interval = setInterval(() => {
      if (Math.random() < 0.15) {
        sendNotification('Ocean Report', phrases[Math.floor(Math.random() * phrases.length)]);
      }
    }, 120000);
    return () => clearInterval(interval);
  }, [sendNotification]);

  return (
    <div className={`bottled-message glass ${visible ? 'visible' : ''}`}>
      <p>{current?.title}: {current?.text}</p>
    </div>
  );
}

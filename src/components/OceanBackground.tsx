'use client';

import { useEffect, useRef, useState } from 'react';

interface Bubble {
  x: number; y: number; r: number; speed: number; drift: number; phase: number; opacity: number;
}

interface Particle {
  x: number; y: number; size: number; speed: number; opacity: number; twinkle: number; phase: number;
}

interface Ray {
  x: number; width: number; speed: number; opacity: number; phase: number;
}

export default function OceanBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wallpaper, setWallpaper] = useState('/wallpapers/deep-blue.svg');

  useEffect(() => {
    const saved = localStorage.getItem('nautilus_wallpaper');
    if (saved) setWallpaper(saved);

    const handleStorage = () => {
      const s = localStorage.getItem('nautilus_wallpaper');
      if (s) setWallpaper(s);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0;
    let animId = 0;

    const bubbles: Bubble[] = [];
    const particles: Particle[] = [];
    const rays: Ray[] = [];

    const resize = () => {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 40; i++) {
      bubbles.push({
        x: Math.random() * w, y: Math.random() * h,
        r: 1 + Math.random() * 4, speed: 0.15 + Math.random() * 0.4,
        drift: (Math.random() - 0.5) * 0.3, phase: Math.random() * Math.PI * 2,
        opacity: 0.1 + Math.random() * 0.3,
      });
    }

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        size: 0.5 + Math.random() * 1.5, speed: 0.02 + Math.random() * 0.05,
        opacity: 0.1 + Math.random() * 0.4, twinkle: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }

    for (let i = 0; i < 6; i++) {
      rays.push({
        x: Math.random() * w * 1.4 - w * 0.2,
        width: 20 + Math.random() * 60,
        speed: 0.002 + Math.random() * 0.004,
        opacity: 0.02 + Math.random() * 0.04,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const draw = (t: number) => {
      ctx!.clearRect(0, 0, w, h);

      // Subtle vignette overlay
      const vigGrad = ctx!.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.9);
      vigGrad.addColorStop(0, 'transparent');
      vigGrad.addColorStop(1, 'rgba(2, 8, 16, 0.3)');
      ctx!.fillStyle = vigGrad;
      ctx!.fillRect(0, 0, w, h);

      // Light rays (caustics) from surface
      rays.forEach((ray) => {
        const rx = ray.x + Math.sin(t * ray.speed + ray.phase) * 80;
        ctx!.save();
        ctx!.globalAlpha = ray.opacity * (0.6 + 0.4 * Math.sin(t * ray.speed * 0.5 + ray.phase));
        const rg = ctx!.createLinearGradient(rx, 0, rx + ray.width * 0.3, h);
        rg.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
        rg.addColorStop(0.3, 'rgba(74, 222, 128, 0.05)');
        rg.addColorStop(1, 'transparent');
        ctx!.fillStyle = rg;

        ctx!.beginPath();
        ctx!.moveTo(rx - ray.width * 0.3, -20);
        ctx!.quadraticCurveTo(rx + ray.width * 0.1, h * 0.4, rx + ray.width * 0.15, h + 20);
        ctx!.quadraticCurveTo(rx - ray.width * 0.1, h * 0.4, rx + ray.width * 0.3, -20);
        ctx!.closePath();
        ctx!.fill();
        ctx!.restore();
      });

      // Plankton particles
      particles.forEach((p) => {
        p.y += p.speed;
        if (p.y > h) { p.y = -5; p.x = Math.random() * w; }
        const twinkle = p.twinkle * (0.5 + 0.5 * Math.sin(t * 0.002 + p.phase));
        ctx!.globalAlpha = p.opacity * twinkle;
        ctx!.fillStyle = '#4ADE80';
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
      });
      ctx!.globalAlpha = 1;

      // Bubbles
      bubbles.forEach((b) => {
        b.y -= b.speed;
        b.x += Math.sin(t * 0.003 + b.phase) * b.drift;
        if (b.y < -10) { b.y = h + 10; b.x = Math.random() * w; }

        ctx!.globalAlpha = b.opacity;
        ctx!.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx!.lineWidth = 0.5;
        ctx!.beginPath();
        ctx!.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx!.stroke();

        ctx!.globalAlpha = b.opacity * 0.6;
        ctx!.fillStyle = 'rgba(248, 250, 252, 0.3)';
        ctx!.beginPath();
        ctx!.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.35, 0, Math.PI * 2);
        ctx!.fill();
      });
      ctx!.globalAlpha = 1;

      // Deep-sea floor silhouette
      ctx!.fillStyle = 'rgba(2, 8, 16, 0.35)';
      ctx!.beginPath();
      ctx!.moveTo(0, h);
      for (let x = 0; x <= w; x += 8) {
        const y = h - 6 - Math.sin(x * 0.008 + t * 0.0001) * 4
          - Math.sin(x * 0.02 + t * 0.0002) * 3 - Math.sin(x * 0.05) * 2;
        ctx!.lineTo(x, y);
      }
      ctx!.lineTo(w, h);
      ctx!.closePath();
      ctx!.fill();

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [wallpaper]);

  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 0.5s ease',
      }} />
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 1 }} />
    </>
  );
}

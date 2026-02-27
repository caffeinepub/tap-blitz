import React, { useRef, useEffect, useState } from 'react';
import { Target } from './Target';
import type { Target as TargetType, GameStatus } from '../hooks/useGameState';
import { Zap } from 'lucide-react';

interface GameCanvasProps {
  status: GameStatus;
  score: number;
  timeLeft: number;
  targets: TargetType[];
  highScore: number;
  onTap: (id: string) => void;
  onAreaReady: (width: number, height: number) => void;
}

interface TapFeedback {
  id: string;
  x: number;
  y: number;
}

export function GameCanvas({
  status,
  score,
  timeLeft,
  targets,
  highScore,
  onTap,
  onAreaReady,
}: GameCanvasProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [tapFeedbacks, setTapFeedbacks] = useState<TapFeedback[]>([]);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          onAreaReady(width, height);
        }
      }
    });
    ro.observe(el);
    const { width, height } = el.getBoundingClientRect();
    if (width > 0 && height > 0) onAreaReady(width, height);
    return () => ro.disconnect();
  }, [onAreaReady]);

  const handleTap = (id: string, x: number, y: number) => {
    const fb: TapFeedback = { id: `${id}-${Date.now()}`, x, y };
    setTapFeedbacks((prev) => [...prev, fb]);
    setTimeout(() => {
      setTapFeedbacks((prev) => prev.filter((f) => f.id !== fb.id));
    }, 500);
    onTap(id);
  };

  const isUrgent = timeLeft <= 10;

  return (
    <div className="flex flex-col h-full w-full">
      {/* HUD */}
      <div className="flex items-center justify-between px-4 py-3 hud-bar shrink-0">
        <div className="flex flex-col items-center min-w-[80px]">
          <span className="text-xs font-bold tracking-widest uppercase text-muted-game mb-0.5">Score</span>
          <span className="text-3xl font-black tabular-nums text-neon-cyan leading-none">{score}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs font-bold tracking-widest uppercase text-muted-game mb-0.5">Time</span>
          <span
            className={`text-4xl font-black tabular-nums leading-none transition-colors duration-300 ${
              isUrgent ? 'text-neon-magenta animate-pulse' : 'text-neon-yellow'
            }`}
          >
            {timeLeft}
          </span>
        </div>

        <div className="flex flex-col items-center min-w-[80px]">
          <span className="text-xs font-bold tracking-widest uppercase text-muted-game mb-0.5 flex items-center gap-1">
            <Zap size={10} className="text-neon-yellow" />Best
          </span>
          <span className="text-3xl font-black tabular-nums text-neon-purple leading-none">{highScore}</span>
        </div>
      </div>

      {/* Play area */}
      <div
        ref={areaRef}
        className="relative flex-1 overflow-hidden game-area"
        style={{ touchAction: 'none' }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
          style={{ backgroundImage: "url('/assets/generated/game-bg.dim_390x844.png')" }}
        />

        {/* Grid lines for arcade feel */}
        <div className="absolute inset-0 pointer-events-none grid-overlay" />

        {status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
            <p className="text-neon-cyan text-lg font-bold tracking-widest uppercase opacity-60 animate-pulse">
              Tap targets to score!
            </p>
          </div>
        )}

        {targets.map((target) => (
          <Target
            key={target.id}
            {...target}
            onTap={(id) => handleTap(id, target.x, target.y)}
          />
        ))}

        {/* Tap feedback bursts */}
        {tapFeedbacks.map((fb) => (
          <div
            key={fb.id}
            className="tap-burst pointer-events-none absolute"
            style={{ left: fb.x, top: fb.y }}
          />
        ))}
      </div>
    </div>
  );
}

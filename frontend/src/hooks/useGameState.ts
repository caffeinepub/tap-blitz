import { useState, useEffect, useRef, useCallback } from 'react';

export type GameStatus = 'idle' | 'playing' | 'gameover';

export interface Target {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  spawnedAt: number;
  lifetime: number;
}

const NEON_COLORS = [
  '#ff2d78', // magenta
  '#00f5ff', // cyan
  '#ffe600', // yellow
  '#7b2fff', // purple
  '#00ff9d', // green
];

const GAME_DURATION = 30;
const TARGET_LIFETIME = 2000; // ms
const SPAWN_INTERVAL = 700; // ms
const MIN_TARGET_SIZE = 55;
const MAX_TARGET_SIZE = 80;

function generateTarget(areaWidth: number, areaHeight: number): Target {
  const size = MIN_TARGET_SIZE + Math.random() * (MAX_TARGET_SIZE - MIN_TARGET_SIZE);
  const padding = size / 2 + 10;
  const x = padding + Math.random() * (areaWidth - padding * 2);
  const y = padding + Math.random() * (areaHeight - padding * 2);
  const color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
  return {
    id: `${Date.now()}-${Math.random()}`,
    x,
    y,
    size,
    color,
    spawnedAt: Date.now(),
    lifetime: TARGET_LIFETIME,
  };
}

export function useGameState(areaWidth: number, areaHeight: number) {
  const [status, setStatus] = useState<GameStatus>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [targets, setTargets] = useState<Target[]>([]);

  const statusRef = useRef<GameStatus>('idle');
  const scoreRef = useRef(0);
  const timeLeftRef = useRef(GAME_DURATION);
  const targetsRef = useRef<Target[]>([]);
  const spawnIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cleanupIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAllIntervals = useCallback(() => {
    if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (cleanupIntervalRef.current) clearInterval(cleanupIntervalRef.current);
    spawnIntervalRef.current = null;
    timerIntervalRef.current = null;
    cleanupIntervalRef.current = null;
  }, []);

  const startGame = useCallback(() => {
    clearAllIntervals();
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setTargets([]);
    scoreRef.current = 0;
    timeLeftRef.current = GAME_DURATION;
    targetsRef.current = [];
    statusRef.current = 'playing';
    setStatus('playing');
  }, [clearAllIntervals]);

  const endGame = useCallback(() => {
    clearAllIntervals();
    statusRef.current = 'gameover';
    setStatus('gameover');
    setTargets([]);
    targetsRef.current = [];
  }, [clearAllIntervals]);

  // Game loop effects
  useEffect(() => {
    if (status !== 'playing') return;

    // Spawn targets
    spawnIntervalRef.current = setInterval(() => {
      if (areaWidth <= 0 || areaHeight <= 0) return;
      const newTarget = generateTarget(areaWidth, areaHeight);
      targetsRef.current = [...targetsRef.current, newTarget];
      setTargets([...targetsRef.current]);
    }, SPAWN_INTERVAL);

    // Countdown timer
    timerIntervalRef.current = setInterval(() => {
      timeLeftRef.current -= 1;
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) {
        endGame();
      }
    }, 1000);

    // Cleanup expired targets
    cleanupIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const alive = targetsRef.current.filter(
        (t) => now - t.spawnedAt < t.lifetime
      );
      if (alive.length !== targetsRef.current.length) {
        targetsRef.current = alive;
        setTargets([...alive]);
      }
    }, 100);

    return () => {
      clearAllIntervals();
    };
  }, [status, areaWidth, areaHeight, endGame, clearAllIntervals]);

  const tapTarget = useCallback((id: string) => {
    if (statusRef.current !== 'playing') return;
    const exists = targetsRef.current.find((t) => t.id === id);
    if (!exists) return;
    targetsRef.current = targetsRef.current.filter((t) => t.id !== id);
    setTargets([...targetsRef.current]);
    scoreRef.current += 1;
    setScore(scoreRef.current);
  }, []);

  return {
    status,
    score,
    timeLeft,
    targets,
    startGame,
    tapTarget,
  };
}

import React, { useEffect, useRef } from 'react';

interface TargetProps {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  spawnedAt: number;
  lifetime: number;
  onTap: (id: string) => void;
}

export function Target({ id, x, y, size, color, spawnedAt, lifetime, onTap }: TargetProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const tappedRef = useRef(false);

  const elapsed = Date.now() - spawnedAt;
  const progress = Math.min(elapsed / lifetime, 1);
  const scale = 1 - progress * 0.85;
  const opacity = 1 - progress * 0.3;

  useEffect(() => {
    tappedRef.current = false;
  }, [id]);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (tappedRef.current) return;
    tappedRef.current = true;

    // Burst animation
    if (ref.current) {
      ref.current.style.transform = `translate(-50%, -50%) scale(1.4)`;
      ref.current.style.opacity = '0';
    }
    setTimeout(() => onTap(id), 80);
  };

  return (
    <button
      ref={ref}
      onMouseDown={handleTap}
      onTouchStart={handleTap}
      className="target-btn absolute rounded-full flex items-center justify-center select-none cursor-pointer"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color}55)`,
        border: `3px solid ${color}`,
        boxShadow: `0 0 18px ${color}99, 0 0 40px ${color}44, inset 0 0 12px ${color}33`,
        transition: 'transform 0.08s ease, opacity 0.08s ease',
        willChange: 'transform, opacity',
        touchAction: 'none',
      }}
      aria-label="Tap target"
    >
      <span
        className="block rounded-full"
        style={{
          width: size * 0.35,
          height: size * 0.35,
          background: `${color}cc`,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
    </button>
  );
}

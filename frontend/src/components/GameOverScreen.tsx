import { Zap, RotateCcw, Trophy } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  onRestart: () => void;
}

export function GameOverScreen({ score, highScore, isNewHighScore, onRestart }: GameOverScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-6 gap-6 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none"
        style={{ backgroundImage: "url('/assets/generated/game-bg.dim_390x844.png')" }}
      />

      {/* Title */}
      <div className="text-center z-10">
        <p className="text-neon-magenta text-sm font-bold tracking-[0.3em] uppercase mb-1">Game Over</p>
        <h1 className="text-6xl font-black text-white leading-none tracking-tight" style={{
          textShadow: '0 0 30px rgba(255,45,120,0.8), 0 0 60px rgba(255,45,120,0.4)'
        }}>
          TAP<br />BLITZ
        </h1>
      </div>

      {/* Score card */}
      <div className="w-full max-w-xs z-10">
        <div className="score-card rounded-2xl p-6 text-center mb-4">
          <p className="text-xs font-bold tracking-widest uppercase text-muted-game mb-2">Final Score</p>
          <p className="text-7xl font-black tabular-nums text-neon-cyan leading-none" style={{
            textShadow: '0 0 20px rgba(0,245,255,0.8)'
          }}>
            {score}
          </p>
          {isNewHighScore && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <Trophy size={16} className="text-neon-yellow" />
              <span className="text-neon-yellow text-sm font-bold tracking-widest uppercase animate-pulse">
                New High Score!
              </span>
              <Trophy size={16} className="text-neon-yellow" />
            </div>
          )}
        </div>

        <div className="score-card rounded-2xl p-4 text-center flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-neon-yellow" />
            <span className="text-xs font-bold tracking-widest uppercase text-muted-game">Best</span>
          </div>
          <span className="text-3xl font-black tabular-nums text-neon-purple">{highScore}</span>
        </div>
      </div>

      {/* Restart button */}
      <button
        onClick={onRestart}
        className="restart-btn z-10 flex items-center gap-3 px-10 py-4 rounded-full font-black text-xl tracking-widest uppercase"
      >
        <RotateCcw size={22} />
        Play Again
      </button>

      {/* Instructions */}
      <div className="z-10 text-center">
        <p className="text-muted-game text-xs tracking-wide">
          Tap the glowing circles before they vanish!
        </p>
        <p className="text-muted-game text-xs tracking-wide">
          30 seconds · Score as high as you can
        </p>
      </div>
    </div>
  );
}

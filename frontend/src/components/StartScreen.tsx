import { Zap } from 'lucide-react';

interface StartScreenProps {
  highScore: number;
  onStart: () => void;
}

export function StartScreen({ highScore, onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-6 gap-8 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
        style={{ backgroundImage: "url('/assets/generated/game-bg.dim_390x844.png')" }}
      />

      {/* Logo */}
      <div className="text-center z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap size={28} className="text-neon-yellow" fill="currentColor" />
          <span className="text-neon-yellow text-sm font-bold tracking-[0.4em] uppercase">Arcade</span>
          <Zap size={28} className="text-neon-yellow" fill="currentColor" />
        </div>
        <h1
          className="text-7xl font-black text-white leading-none tracking-tight"
          style={{ textShadow: '0 0 30px rgba(0,245,255,0.9), 0 0 60px rgba(0,245,255,0.4)' }}
        >
          TAP
        </h1>
        <h1
          className="text-7xl font-black leading-none tracking-tight"
          style={{
            color: '#ff2d78',
            textShadow: '0 0 30px rgba(255,45,120,0.9), 0 0 60px rgba(255,45,120,0.4)',
          }}
        >
          BLITZ
        </h1>
      </div>

      {/* High score */}
      {highScore > 0 && (
        <div className="z-10 score-card rounded-2xl px-8 py-3 flex items-center gap-3">
          <Zap size={18} className="text-neon-yellow" />
          <span className="text-xs font-bold tracking-widest uppercase text-muted-game">Best</span>
          <span className="text-2xl font-black tabular-nums text-neon-purple">{highScore}</span>
        </div>
      )}

      {/* Start button */}
      <button
        onClick={onStart}
        className="start-btn z-10 px-14 py-5 rounded-full font-black text-2xl tracking-widest uppercase"
      >
        TAP TO PLAY
      </button>

      {/* How to play */}
      <div className="z-10 score-card rounded-2xl p-5 w-full max-w-xs">
        <p className="text-neon-cyan text-xs font-bold tracking-widest uppercase text-center mb-3">How to Play</p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-xs text-muted-game">
            <span className="text-neon-magenta font-bold mt-0.5">→</span>
            Tap the glowing circles before they shrink away
          </li>
          <li className="flex items-start gap-2 text-xs text-muted-game">
            <span className="text-neon-yellow font-bold mt-0.5">→</span>
            Each tap scores 1 point
          </li>
          <li className="flex items-start gap-2 text-xs text-muted-game">
            <span className="text-neon-cyan font-bold mt-0.5">→</span>
            You have 30 seconds — go fast!
          </li>
        </ul>
      </div>
    </div>
  );
}

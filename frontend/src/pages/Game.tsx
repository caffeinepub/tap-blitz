import { useState, useCallback } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useHighScore, useSubmitScore } from '../hooks/useQueries';
import { GameCanvas } from '../components/GameCanvas';
import { GameOverScreen } from '../components/GameOverScreen';
import { StartScreen } from '../components/StartScreen';

export function GamePage() {
  const [areaSize, setAreaSize] = useState({ width: 0, height: 0 });
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const { data: highScoreRaw = BigInt(0) } = useHighScore();
  const { mutateAsync: submitScore } = useSubmitScore();

  const highScore = Number(highScoreRaw);

  const { status, score, timeLeft, targets, startGame, tapTarget } = useGameState(
    areaSize.width,
    areaSize.height
  );

  const handleAreaReady = useCallback((width: number, height: number) => {
    setAreaSize((prev) => {
      if (prev.width === width && prev.height === height) return prev;
      return { width, height };
    });
  }, []);

  // When game ends, submit score
  const prevStatusRef = { current: status };
  if (prevStatusRef.current !== status && status === 'gameover') {
    submitScore(score).then((isNew) => {
      setIsNewHighScore(!!isNew);
    });
  }

  const handleRestart = () => {
    setIsNewHighScore(false);
    startGame();
  };

  return (
    <div className="game-root flex flex-col h-screen w-full max-w-[430px] mx-auto overflow-hidden">
      {status === 'idle' && (
        <StartScreen highScore={highScore} onStart={startGame} />
      )}

      {status === 'playing' && (
        <GameCanvas
          status={status}
          score={score}
          timeLeft={timeLeft}
          targets={targets}
          highScore={highScore}
          onTap={tapTarget}
          onAreaReady={handleAreaReady}
        />
      )}

      {status === 'gameover' && (
        <GameOverScreen
          score={score}
          highScore={Math.max(highScore, score)}
          isNewHighScore={isNewHighScore}
          onRestart={handleRestart}
        />
      )}

      {/* Footer */}
      <footer className="shrink-0 py-2 text-center">
        <p className="text-xs text-muted-game opacity-50">
          Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'tap-blitz')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-cyan opacity-70 hover:opacity-100 transition-opacity"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

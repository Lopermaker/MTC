import { useGameStore } from '../store';
import { RefreshCw } from 'lucide-react';

export const Modal = () => {
  const { gameStatus, solution, resetGame, mode } = useGameStore();

  if (gameStatus === 'playing') return null;

  const isWin = gameStatus === 'won';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center animate-in zoom-in-95">
        <h2 className={`text-3xl font-black uppercase mb-2 ${isWin ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isWin ? 'Magnificent!' : 'Game Over'}
        </h2>
        
        <p className="text-slate-600 dark:text-slate-400 mb-6 text-center">
          The word was <span className="font-bold text-slate-900 dark:text-white uppercase">{solution}</span>
        </p>

        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold transition-all hover:scale-105 active:scale-95"
        >
          <RefreshCw size={20} />
          Play Again
        </button>

        <p className="text-xs text-slate-500 mt-6 text-center">
          Mode: {mode === 'classic' ? 'Classic (5 letters)' : 'Insanity (6 letters, timer)'}
        </p>
      </div>
    </div>
  );
};

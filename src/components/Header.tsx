import { useGameStore } from '../store';
import { Home } from 'lucide-react';

export const Header = () => {
  const { mode, setActiveModal, gameStatus } = useGameStore();

  const handleGoHome = () => {
    if (gameStatus === 'playing') {
      setActiveModal('leaveWarning');
    } else {
      window.location.reload();
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-2">
        <button
          onClick={handleGoHome}
          className="flex items-center justify-center p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          title="Return to Menu"
        >
          <Home size={20} />
        </button>
      </div>

      <div className="flex flex-col items-end">
        {gameStatus !== 'playing' && (
          <button
            onClick={() => setActiveModal('gameOver')}
            className="absolute top-4 right-4 flex items-center justify-center p-2 rounded-full text-emerald-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="View Results"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          </button>
        )}
        <h1 className="text-2xl font-black tracking-widest text-slate-900 dark:text-white uppercase font-serif">
          LEXICON<span className={mode === 'insanity' ? 'text-rose-500' : 'text-emerald-500'}>+</span>
        </h1>
      </div>
    </header>
  );
};

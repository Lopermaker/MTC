import { useGameStore } from '../store';
import { RefreshCw, X, LogOut } from 'lucide-react';

export const Modal = () => {
  const { gameStatus, solution, resetGame, mode, activeModal, setActiveModal } = useGameStore();

  if (activeModal === 'leaveWarning') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center relative animate-in zoom-in-95 text-center">
          <button onClick={() => setActiveModal('none')} className="absolute top-4 right-4 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={24} />
          </button>
          
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mb-4">
            <LogOut size={32} />
          </div>
          
          <h2 className="text-2xl font-black mb-2 font-serif">Leave Game?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Are you sure you want to go back to the Start Menu? Your current game progress will not be saved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => setActiveModal('none')}
              className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-full font-bold transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold transition-all active:scale-95"
            >
              Leave
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameStatus === 'playing') return null;

  const isWin = gameStatus === 'won';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center animate-in zoom-in-95 relative">
        
        {/* Added a home button here so users can exit the end screen */}
        <button 
          onClick={() => window.location.reload()} 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          title="Return to Start Menu"
        >
          <X size={24} />
        </button>

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

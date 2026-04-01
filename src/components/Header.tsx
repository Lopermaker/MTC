import { useGameStore } from '../store';
import { Flame, BrainCircuit } from 'lucide-react';

export const Header = () => {
  const { mode, setMode, timeLeft, gameStatus } = useGameStore();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMode('classic')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
            mode === 'classic' 
              ? 'bg-emerald-500 text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <BrainCircuit size={16} />
          <span className="hidden sm:inline">Classic</span>
        </button>
        <button
          onClick={() => setMode('insanity')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
            mode === 'insanity' 
              ? 'bg-rose-500 text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Flame size={16} />
          <span className="hidden sm:inline">Insanity</span>
        </button>
      </div>

      <div className="flex flex-col items-end">
        <h1 className="text-2xl font-black tracking-widest text-slate-900 dark:text-white uppercase font-serif">
          LEXICON<span className={mode === 'insanity' ? 'text-rose-500' : 'text-emerald-500'}>+</span>
        </h1>
      </div>
    </header>
  );
};

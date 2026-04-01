import { useGameStore } from '../store';

export const StartMenu = () => {
  const { startGame } = useGameStore();
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 animate-in fade-in duration-500">
      <div className="flex flex-col items-center max-w-md w-full">
        
        <div className="grid grid-cols-3 gap-1.5 w-[72px] h-[72px] mb-8">
          <div className="bg-white dark:bg-slate-900 border-[3px] border-slate-900 dark:border-slate-100 rounded-sm"></div>
          <div className="bg-white dark:bg-slate-900 border-[3px] border-slate-900 dark:border-slate-100 rounded-sm"></div>
          <div className="bg-emerald-500 border-[3px] border-slate-900 dark:border-slate-100 rounded-sm"></div>

          <div className="bg-white dark:bg-slate-900 border-[3px] border-slate-900 dark:border-slate-100 rounded-sm"></div>
          <div className="bg-amber-400 border-[3px] border-slate-900 dark:border-slate-100 rounded-sm"></div>
          <div className="bg-emerald-500 border-[3px] border-slate-900 dark:border-slate-100 rounded-sm"></div>

          <div className="bg-emerald-500 border-[3px] border-slate-900 dark:border-slate-100 rounded-sm"></div>
          <div className="bg-emerald-500 border-[3px] border-slate-900 dark:border-slate-100 rounded-sm"></div>
          <div className="bg-emerald-500 border-[3px] border-slate-900 dark:border-slate-100 rounded-sm"></div>
        </div>

        <h1 className="text-5xl font-black mb-3 font-serif tracking-tight">Lexicon</h1>
        <p className="text-2xl text-center mb-10 font-serif leading-snug">
          Get 6 chances to guess a 5-letter word.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-[260px]">
          <button
            onClick={startGame}
            className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-2xl py-3.5 rounded-full hover:scale-105 active:scale-95 transition-transform"
          >
            Play
          </button>
          <button
            onClick={startGame}
            className="w-full bg-transparent border-2 border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 font-bold text-lg py-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-95 transition-colors"
          >
            Log in
          </button>
          <button
            onClick={startGame}
            className="w-full bg-transparent border-2 border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 font-bold text-lg py-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-95 transition-colors"
          >
            How to play
          </button>
        </div>

        <div className="mt-16 text-center text-sm font-bold text-slate-800 dark:text-slate-300">
          <p>{today}</p>
          <p className="font-medium mt-0.5">No. 1</p>
          <p className="font-medium mt-0.5">Edited by Trae</p>
        </div>
      </div>
    </div>
  );
};

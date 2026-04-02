import { useGameStore } from '../store';
import { X, LogOut } from 'lucide-react';
import { Login } from './Login';

export const StartMenu = () => {
  const { startGame, activeModal, setActiveModal, mode, setMode, user, logout } = useGameStore();
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 animate-in fade-in duration-500">
      <div className="flex flex-col items-center max-w-md w-full relative">
        
        {/* Original Logo */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center group">
          {/* Background layered tiles for a "stack of letters" effect */}
          <div className="absolute inset-0 bg-emerald-500 rounded-2xl transform -rotate-6 transition-transform group-hover:-rotate-12 duration-300"></div>
          <div className="absolute inset-0 bg-amber-400 rounded-2xl transform rotate-6 transition-transform group-hover:rotate-12 duration-300 shadow-md"></div>
          
          {/* Main front tile */}
          <div className="absolute inset-0 bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-100 rounded-2xl flex items-center justify-center shadow-xl z-10">
            <span className="text-slate-900 dark:text-white font-serif font-black text-6xl tracking-tighter">L</span>
          </div>
        </div>

        <h1 className="text-5xl font-black mb-3 font-serif tracking-tight">Lexicon</h1>
        <p className="text-2xl text-center mb-10 font-serif leading-snug h-16">
          {mode === 'classic' ? (
            'Get 6 chances to guess a 5-letter word.'
          ) : (
            <span>Get 5 chances to guess a <span className="text-rose-500 font-bold">6-letter word</span> in 60s.</span>
          )}
        </p>

        <div className="flex flex-col gap-3 w-full max-w-[260px]">
          <button
            onClick={startGame}
            className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-2xl py-3.5 rounded-full hover:scale-105 active:scale-95 transition-transform"
          >
            Play
          </button>
          
          {!user ? (
            <button
              onClick={() => setActiveModal('login')}
              className="w-full bg-transparent border-2 border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 font-bold text-lg py-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-95 transition-colors"
            >
              Log in
            </button>
          ) : (
            <div className="flex gap-2">
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold text-lg py-3 px-4 rounded-full truncate text-center">
                Hi, {user.name}
              </div>
              <button
                onClick={logout}
                className="bg-transparent border-2 border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 p-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-95 transition-colors"
                title="Log out"
              >
                <LogOut size={24} />
              </button>
            </div>
          )}

          <button
            onClick={() => setActiveModal('howToPlay')}
            className="w-full bg-transparent border-2 border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 font-bold text-lg py-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-95 transition-colors"
          >
            How to play
          </button>
        </div>

        {/* Mode Toggles */}
        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={() => setMode('classic')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
              mode === 'classic' 
                ? 'bg-emerald-500 text-white shadow-md' 
                : 'bg-transparent border-2 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
            }`}
          >
            Classic
          </button>
          <button
            onClick={() => setMode('insanity')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
              mode === 'insanity' 
                ? 'bg-rose-500 text-white shadow-md' 
                : 'bg-transparent border-2 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
            }`}
          >
            Insanity
          </button>
        </div>

        <div className="mt-12 flex flex-col items-center gap-2">
          <div className="text-center text-sm font-bold text-slate-800 dark:text-slate-300 flex items-center justify-center gap-2">
            <p className="font-medium text-slate-500 dark:text-slate-400">Edited by</p>
            <div className="flex items-center text-xl font-bold tracking-[-0.08em]">
              <span className="text-slate-900 dark:text-white">TRA</span>
              <div className="relative flex items-center justify-center ml-[0.5px]">
                <span className="text-slate-900 dark:text-white">E</span>
                <div className="absolute right-[2px] w-[3px] h-[3px] bg-slate-900 dark:bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center shadow-sm">
              <div className="relative w-5 h-[14px] border-[2.5px] border-black rounded-sm flex items-center justify-center gap-1">
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="w-1 h-1 bg-black rounded-full"></div>
                {/* The bottom-left cutout to match the icon */}
                <div className="absolute -bottom-[2.5px] -left-[2.5px] w-[3px] h-[3px] bg-white"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeModal === 'howToPlay' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full relative animate-in zoom-in-95">
            <button onClick={() => setActiveModal('none')} className="absolute top-4 right-4 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black mb-4 font-serif">How To Play</h2>
            <h3 className="text-lg font-bold mb-2">Guess the Lexicon in 6 tries.</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
              <li>Each guess must be a valid 5-letter word.</li>
              <li>The color of the tiles will change to show how close your guess was to the word.</li>
            </ul>
            <div className="space-y-4">
              <div>
                <div className="flex gap-1 mb-2">
                  <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-emerald-500 text-white border-2 border-emerald-500">W</div>
                  <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-transparent border-2 border-slate-400">E</div>
                  <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-transparent border-2 border-slate-400">A</div>
                  <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-transparent border-2 border-slate-400">R</div>
                  <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-transparent border-2 border-slate-400">Y</div>
                </div>
                <p className="text-sm"><strong>W</strong> is in the word and in the correct spot.</p>
              </div>
              <div>
                <div className="flex gap-1 mb-2">
                  <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-transparent border-2 border-slate-400">P</div>
                  <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-amber-400 text-white border-2 border-amber-400">I</div>
                  <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-transparent border-2 border-slate-400">L</div>
                  <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-transparent border-2 border-slate-400">L</div>
                  <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-transparent border-2 border-slate-400">S</div>
                </div>
                <p className="text-sm"><strong>I</strong> is in the word but in the wrong spot.</p>
              </div>
              <div>
                <div className="flex gap-1 mb-2">
                  <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-transparent border-2 border-slate-400">V</div>
                  <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-transparent border-2 border-slate-400">A</div>
                  <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-transparent border-2 border-slate-400">G</div>
                  <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-slate-700 text-white border-2 border-slate-700">U</div>
                  <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-transparent border-2 border-slate-400">E</div>
                </div>
                <p className="text-sm"><strong>U</strong> is not in the word in any spot.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'login' && <Login />}
    </div>
  );
};

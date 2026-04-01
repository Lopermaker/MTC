import { useEffect } from 'react';
import { useGameStore } from './store';
import { Header } from './components/Header';
import { GameBoard } from './components/GameBoard';
import { Keyboard } from './components/Keyboard';
import { Modal } from './components/Modal';

function App() {
  const { mode, gameStatus, tickTimer, message } = useGameStore();

  useEffect(() => {
    let timer: number;
    if (mode === 'insanity' && gameStatus === 'playing') {
      timer = window.setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, gameStatus, tickTimer]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 relative">
      <Header />

      {message && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg font-bold shadow-xl animate-in slide-in-from-top-4 z-40 whitespace-nowrap">
          {message}
        </div>
      )}

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl mx-auto pb-8">
        <div className="flex-1 w-full flex items-center justify-center min-h-[400px]">
          <GameBoard />
        </div>
        
        <div className="w-full flex-none pb-4">
          <Keyboard />
        </div>
      </main>

      <Modal />
    </div>
  );
}

export default App;

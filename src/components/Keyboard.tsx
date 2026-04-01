import { useEffect, useMemo } from 'react';
import { useGameStore } from '../store';
import { Delete } from 'lucide-react';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

export const Keyboard = () => {
  const { guesses, solution, addLetter, removeLetter, submitGuess } = useGameStore();

  const keyStates = useMemo(() => {
    const states: Record<string, 'correct' | 'present' | 'absent' | 'unused'> = {};
    
    // Initialize
    KEYBOARD_ROWS.flat().forEach(key => states[key] = 'unused');

    for (const guess of guesses) {
      for (let i = 0; i < guess.length; i++) {
        const letter = guess[i];
        if (solution[i] === letter) {
          states[letter] = 'correct';
        } else if (solution.includes(letter) && states[letter] !== 'correct') {
          states[letter] = 'present';
        } else if (states[letter] !== 'correct' && states[letter] !== 'present') {
          states[letter] = 'absent';
        }
      }
    }
    return states;
  }, [guesses, solution]);

  const stateClasses = {
    correct: 'bg-emerald-500 text-white',
    present: 'bg-amber-400 text-white',
    absent: 'bg-slate-700 text-white opacity-50',
    unused: 'bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white',
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      const key = e.key.toUpperCase();
      if (key === 'ENTER') {
        submitGuess();
      } else if (key === 'BACKSPACE') {
        removeLetter();
      } else if (/^[A-Z]$/.test(key)) {
        addLetter(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addLetter, removeLetter, submitGuess]);

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-[500px] px-2 mx-auto">
      {KEYBOARD_ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 sm:gap-1.5 w-full">
          {row.map((key) => {
            const isEnter = key === 'ENTER';
            const isBackspace = key === 'BACKSPACE';
            const state = keyStates[key] || 'unused';

            return (
              <button
                key={key}
                onClick={(e) => {
                  e.currentTarget.blur();
                  if (isEnter) submitGuess();
                  else if (isBackspace) removeLetter();
                  else addLetter(key);
                }}
                className={`
                  flex items-center justify-center rounded font-bold text-sm sm:text-base select-none transition-colors
                  ${isEnter || isBackspace ? 'w-12 sm:w-16 px-1 text-xs sm:text-sm' : 'flex-1 max-w-[44px]'} 
                  h-14 sm:h-14
                  ${stateClasses[state]}
                  active:scale-95 hover:brightness-110
                `}
              >
                {isBackspace ? <Delete size={20} /> : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

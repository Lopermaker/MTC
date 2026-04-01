import { useEffect, useState } from 'react';

interface TileProps {
  letter: string;
  state: 'correct' | 'present' | 'absent' | 'empty' | 'tbd';
  animate: boolean;
  delay: number;
}

export const Tile = ({ letter, state, animate, delay }: TileProps) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [currentState, setCurrentState] = useState<'empty' | 'tbd'>(letter ? 'tbd' : 'empty');

  useEffect(() => {
    setCurrentState(letter ? 'tbd' : 'empty');
  }, [letter]);

  useEffect(() => {
    if (state !== 'empty' && state !== 'tbd') {
      if (animate) {
        const timer = setTimeout(() => {
          setIsFlipping(true);
          setTimeout(() => {
            setCurrentState(state as any);
            setIsFlipping(false);
          }, 150);
        }, delay * 200);
        return () => clearTimeout(timer);
      } else {
        setCurrentState(state as any);
      }
    }
  }, [animate, state, delay]);

  const stateClasses = {
    correct: 'bg-emerald-500 border-emerald-500 text-white',
    present: 'bg-amber-400 border-amber-400 text-white',
    absent: 'bg-slate-700 border-slate-700 text-white',
    empty: 'bg-transparent border-slate-600',
    tbd: 'bg-transparent border-slate-400 text-white',
  };

  const isFilled = letter !== '';

  return (
    <div
      className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-3xl font-bold uppercase transition-all duration-150 border-2 rounded-lg select-none
        ${isFlipping ? 'scale-y-0 opacity-50' : 'scale-y-100 opacity-100'} 
        ${stateClasses[currentState]}
        ${isFilled && currentState === 'tbd' ? 'animate-pop' : ''}
      `}
    >
      {letter}
    </div>
  );
};

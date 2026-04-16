import { useGameStore } from '../store';
import { Tile } from './Tile';

export const GameBoard = () => {
  const { guesses, currentGuess, solution, mode, invalidGuess, timeLeft } = useGameStore();

  const maxGuesses = mode === 'classic' ? 6 : 5;
  const wordLength = mode === 'classic' ? 5 : 6;

  const empties = Math.max(0, maxGuesses - 1 - guesses.length);

  return (
    <div className="flex flex-col items-center justify-center gap-2 mt-4 mb-4 relative">
      {mode === 'insanity' && (
        <div className={`absolute -top-10 font-bold text-lg ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`}>
          {timeLeft}s
        </div>
      )}
      {guesses.map((guess, i) => (
        <Row
          key={`guess-${i}`}
          word={guess}
          solution={solution}
          isCompleted={true}
          animate={i === guesses.length - 1} // Animate only the last guess
        />
      ))}

      {guesses.length < maxGuesses && (
        <div className={invalidGuess ? 'animate-shake' : ''}>
          <Row
            word={currentGuess.padEnd(wordLength, ' ')}
            solution={solution}
            isCompleted={false}
            animate={false}
          />
        </div>
      )}

      {Array.from({ length: empties }).map((_, i) => (
        <Row
          key={`empty-${i}`}
          word={' '.repeat(wordLength)}
          solution={solution}
          isCompleted={false}
          animate={false}
        />
      ))}
    </div>
  );
};

interface RowProps {
  word: string;
  solution: string;
  isCompleted: boolean;
  animate: boolean;
}

const Row = ({ word, solution, isCompleted, animate }: RowProps) => {
  const states: ('correct' | 'present' | 'absent' | 'empty' | 'tbd')[] = Array(word.length).fill('empty');

  if (!isCompleted) {
    for (let i = 0; i < word.length; i++) {
      states[i] = word[i] !== ' ' ? 'tbd' : 'empty';
    }
  } else {
    const solutionChars = solution.split('');
    const wordChars = word.split('');
    
    // First pass: find correct letters
    for (let i = 0; i < wordChars.length; i++) {
      if (wordChars[i] === solutionChars[i]) {
        states[i] = 'correct';
        solutionChars[i] = '*';
        wordChars[i] = '*'; // Mark as used
      }
    }

    // Second pass: find present letters
    for (let i = 0; i < wordChars.length; i++) {
      if (wordChars[i] !== '*') {
        const index = solutionChars.indexOf(wordChars[i]);
        if (index !== -1) {
          states[i] = 'present';
          solutionChars[index] = '*';
        } else {
          states[i] = 'absent';
        }
      }
    }
  }

  return (
    <div className="flex gap-2">
      {word.split('').map((letter, i) => (
        <Tile
          key={i}
          letter={letter !== ' ' ? letter : ''}
          state={states[i]}
          animate={animate}
          delay={i}
        />
      ))}
    </div>
  );
};

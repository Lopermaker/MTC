import { create } from 'zustand';
import wordsData from './data/words.json';

type GameMode = 'classic' | 'insanity';

interface GameState {
  mode: GameMode;
  solution: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  timeLeft: number;
  invalidGuess: boolean;
  message: string | null;

  // Actions
  setMode: (mode: GameMode) => void;
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  submitGuess: () => void;
  resetGame: () => void;
  tickTimer: () => void;
  clearMessage: () => void;
}

const getRandomWord = (mode: GameMode) => {
  const list = wordsData[mode];
  return list[Math.floor(Math.random() * list.length)];
};

const INITIAL_TIME = 60;

export const useGameStore = create<GameState>((set, get) => ({
  mode: 'classic',
  solution: getRandomWord('classic'),
  guesses: [],
  currentGuess: '',
  gameStatus: 'playing',
  timeLeft: INITIAL_TIME,
  invalidGuess: false,
  message: null,

  setMode: (mode) => {
    set({
      mode,
      solution: getRandomWord(mode),
      guesses: [],
      currentGuess: '',
      gameStatus: 'playing',
      timeLeft: mode === 'insanity' ? INITIAL_TIME : 0,
      invalidGuess: false,
      message: null,
    });
  },

  addLetter: (letter) => {
    const { currentGuess, mode, gameStatus } = get();
    if (gameStatus !== 'playing') return;
    
    const maxLength = mode === 'classic' ? 5 : 6;
    if (currentGuess.length < maxLength) {
      set({ currentGuess: currentGuess + letter });
    }
  },

  removeLetter: () => {
    const { currentGuess, gameStatus } = get();
    if (gameStatus !== 'playing') return;

    if (currentGuess.length > 0) {
      set({ currentGuess: currentGuess.slice(0, -1) });
    }
  },

  submitGuess: () => {
    const { currentGuess, mode, guesses, solution, gameStatus } = get();
    if (gameStatus !== 'playing') return;

    const maxLength = mode === 'classic' ? 5 : 6;
    const maxGuesses = mode === 'classic' ? 6 : 5;

    if (currentGuess.length !== maxLength) {
      set({ invalidGuess: true, message: 'Not enough letters' });
      setTimeout(() => set({ invalidGuess: false }), 500);
      return;
    }

    const wordList = wordsData[mode];
    if (!wordList.includes(currentGuess)) {
      set({ invalidGuess: true, message: 'Not in word list' });
      setTimeout(() => set({ invalidGuess: false }), 500);
      return;
    }

    // Insanity mode strict validation
    if (mode === 'insanity' && guesses.length > 0) {
      const prevGuess = guesses[guesses.length - 1];
      for (let i = 0; i < maxLength; i++) {
        // Correct letters must be reused
        if (prevGuess[i] === solution[i] && currentGuess[i] !== solution[i]) {
          set({ invalidGuess: true, message: `Must use ${solution[i]} in position ${i + 1}` });
          setTimeout(() => set({ invalidGuess: false }), 500);
          return;
        }
      }
      
      // Present letters must be included
      const solutionChars = solution.split('');
      const prevPresent = new Set<string>();
      for (let i = 0; i < maxLength; i++) {
        if (prevGuess[i] !== solution[i] && solutionChars.includes(prevGuess[i])) {
          prevPresent.add(prevGuess[i]);
        }
      }
      
      for (const char of prevPresent) {
        if (!currentGuess.includes(char)) {
          set({ invalidGuess: true, message: `Guess must contain ${char}` });
          setTimeout(() => set({ invalidGuess: false }), 500);
          return;
        }
      }
    }

    const newGuesses = [...guesses, currentGuess];
    let newStatus = gameStatus;

    if (currentGuess === solution) {
      newStatus = 'won';
    } else if (newGuesses.length >= maxGuesses) {
      newStatus = 'lost';
    }

    set({
      guesses: newGuesses,
      currentGuess: '',
      gameStatus: newStatus,
      message: newStatus === 'lost' ? solution : (newStatus === 'won' ? 'Magnificent!' : null)
    });
  },

  resetGame: () => {
    const { mode } = get();
    set({
      solution: getRandomWord(mode),
      guesses: [],
      currentGuess: '',
      gameStatus: 'playing',
      timeLeft: mode === 'insanity' ? INITIAL_TIME : 0,
      invalidGuess: false,
      message: null,
    });
  },

  tickTimer: () => {
    const { timeLeft, gameStatus, mode } = get();
    if (mode === 'insanity' && gameStatus === 'playing' && timeLeft > 0) {
      if (timeLeft - 1 === 0) {
        set({ timeLeft: 0, gameStatus: 'lost', message: 'Time\'s up!' });
      } else {
        set({ timeLeft: timeLeft - 1 });
      }
    }
  },

  clearMessage: () => set({ message: null })
}));

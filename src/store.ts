import { create } from 'zustand';
import wordsData from './data/words.json';
import { Filter } from 'bad-words';
import humanNames from 'human-names';

const filter = new Filter();

const lowerNames = new Set(humanNames.allEn.map((name: string) => name.toLowerCase()));

type GameMode = 'classic' | 'insanity';

interface GameState {
  hasStarted: boolean;
  mode: GameMode;
  solution: string;
  guesses: string[];
  revealedGuesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  timeLeft: number;
  invalidGuess: boolean;
  isRevealing: boolean;
  message: string | null;

  timeoutId: number | null;

  activeModal: 'none' | 'login' | 'howToPlay' | 'leaveWarning';
  
  // Actions
  startGame: () => void;
  setMode: (mode: GameMode) => void;
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  submitGuess: () => void;
  resetGame: () => void;
  tickTimer: () => void;
  clearMessage: () => void;
  setActiveModal: (modal: 'none' | 'login' | 'howToPlay' | 'leaveWarning') => void;
}

const getRandomWord = (mode: GameMode) => {
  const list = wordsData[mode];
  return list[Math.floor(Math.random() * list.length)];
};

const INITIAL_TIME = 60;

export const useGameStore = create<GameState>((set, get) => ({
  hasStarted: false,
  mode: 'classic',
  solution: getRandomWord('classic'),
  guesses: [],
  revealedGuesses: [],
  currentGuess: '',
  gameStatus: 'playing',
  timeLeft: INITIAL_TIME,
  invalidGuess: false,
  isRevealing: false,
  message: null,
  timeoutId: null,
  activeModal: 'none',

  startGame: () => set({ hasStarted: true }),

  setActiveModal: (modal) => set({ activeModal: modal }),

  setMode: (mode) => {
    const { timeoutId } = get();
    if (timeoutId) window.clearTimeout(timeoutId);
    set({
      mode,
      solution: getRandomWord(mode),
      guesses: [],
      revealedGuesses: [],
      currentGuess: '',
      gameStatus: 'playing',
      timeLeft: mode === 'insanity' ? INITIAL_TIME : 0,
      invalidGuess: false,
      isRevealing: false,
      message: null,
      timeoutId: null,
      activeModal: 'none',
    });
  },

  addLetter: (letter) => {
    const { currentGuess, mode, gameStatus, isRevealing } = get();
    if (gameStatus !== 'playing' || isRevealing) return;
    
    const maxLength = mode === 'classic' ? 5 : 6;
    if (currentGuess.length < maxLength) {
      set({ currentGuess: currentGuess + letter, message: null });
    }
  },

  removeLetter: () => {
    const { currentGuess, gameStatus, isRevealing } = get();
    if (gameStatus !== 'playing' || isRevealing) return;

    if (currentGuess.length > 0) {
      set({ currentGuess: currentGuess.slice(0, -1), message: null });
    }
  },

  submitGuess: () => {
    const { currentGuess, mode, guesses, solution, gameStatus, isRevealing } = get();
    if (gameStatus !== 'playing' || isRevealing) return;

    const maxLength = mode === 'classic' ? 5 : 6;
    const maxGuesses = mode === 'classic' ? 6 : 5;

    if (currentGuess.length !== maxLength) {
      set({ invalidGuess: true, message: 'Not enough letters' });
      setTimeout(() => set({ invalidGuess: false }), 500);
      setTimeout(() => {
        if (get().message === 'Not enough letters') set({ message: null });
      }, 1500);
      return;
    }

    if (guesses.includes(currentGuess)) {
      set({ invalidGuess: true, message: 'Already guessed' });
      setTimeout(() => set({ invalidGuess: false }), 500);
      setTimeout(() => {
        if (get().message === 'Already guessed') set({ message: null });
      }, 1500);
      return;
    }

    const wordList = wordsData[mode];

    if (filter.isProfane(currentGuess)) {
      set({ invalidGuess: true, message: 'Inappropriate' });
      setTimeout(() => set({ invalidGuess: false }), 500);
      setTimeout(() => {
        if (get().message === 'Inappropriate') set({ message: null });
      }, 1500);
      return;
    }

    if (!wordList.includes(currentGuess)) {
      if (lowerNames.has(currentGuess.toLowerCase())) {
        set({ invalidGuess: true, message: 'Names are not words' });
        setTimeout(() => {
          if (get().message === 'Names are not words') set({ message: null });
        }, 1500);
      } else {
        set({ invalidGuess: true, message: 'Invalid word' });
        setTimeout(() => {
          if (get().message === 'Invalid word') set({ message: null });
        }, 1500);
      }
      setTimeout(() => set({ invalidGuess: false }), 500);
      return;
    }

    // Insanity mode strict validation
    if (mode === 'insanity' && guesses.length > 0) {
      const prevGuess = guesses[guesses.length - 1];
      for (let i = 0; i < maxLength; i++) {
        // Correct letters must be reused
        if (prevGuess[i] === solution[i] && currentGuess[i] !== solution[i]) {
          const msg = `Must use ${solution[i]} in position ${i + 1}`;
          set({ invalidGuess: true, message: msg });
          setTimeout(() => set({ invalidGuess: false }), 500);
          setTimeout(() => { if (get().message === msg) set({ message: null }); }, 1500);
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
          const msg = `Guess must contain ${char}`;
          set({ invalidGuess: true, message: msg });
          setTimeout(() => set({ invalidGuess: false }), 500);
          setTimeout(() => { if (get().message === msg) set({ message: null }); }, 1500);
          return;
        }
      }
    }

    const newGuesses = [...guesses, currentGuess];
    let newStatus: 'playing' | 'won' | 'lost' = gameStatus;

    if (currentGuess === solution) {
      newStatus = 'won';
    } else if (newGuesses.length >= maxGuesses) {
      newStatus = 'lost';
    }

    if (newStatus !== 'playing') {
      set({
        guesses: newGuesses,
        currentGuess: '',
        isRevealing: true
      });

      // Wait for tile animations to finish before showing the modal
      // Each tile has a 200ms stagger + 150ms flip animation. 
      // max letters * 200ms + padding = ~1500ms
      const tid = window.setTimeout(() => {
        set({
          revealedGuesses: newGuesses,
          gameStatus: newStatus,
          message: newStatus === 'lost' ? solution : 'Magnificent!',
          isRevealing: false,
          timeoutId: null
        });
      }, maxLength * 200 + 400);

      set({ timeoutId: tid });
    } else {
      set({
        guesses: newGuesses,
        currentGuess: '',
        isRevealing: true
      });
      
      const tid = window.setTimeout(() => {
        set({
          revealedGuesses: newGuesses,
          isRevealing: false,
          timeoutId: null
        });
      }, maxLength * 200 + 400);

      set({ timeoutId: tid });
    }
  },

  resetGame: () => {
    const { mode, timeoutId } = get();
    if (timeoutId) window.clearTimeout(timeoutId);
    set({
      solution: getRandomWord(mode),
      guesses: [],
      revealedGuesses: [],
      currentGuess: '',
      gameStatus: 'playing',
      timeLeft: mode === 'insanity' ? INITIAL_TIME : 0,
      invalidGuess: false,
      isRevealing: false,
      message: null,
      timeoutId: null,
      activeModal: 'none',
    });
  },

  tickTimer: () => {
    const { timeLeft, gameStatus, mode, isRevealing } = get();
    if (mode === 'insanity' && gameStatus === 'playing' && !isRevealing && timeLeft > 0) {
      if (timeLeft - 1 === 0) {
        set({ timeLeft: 0, gameStatus: 'lost', message: 'Time\'s up!' });
      } else {
        set({ timeLeft: timeLeft - 1 });
      }
    }
  },

  clearMessage: () => set({ message: null })
}));

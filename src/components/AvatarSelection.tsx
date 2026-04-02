import { useGameStore } from '../store';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

const TOP_STYLES = [
  'dijon', 'turban', 'bulb01', 'plumes', 'horns', 'pyramid', 'hat01', 'hat02', 'goggles'
];

const FACE_STYLES = [
  'cyborg', 'art01', 'arthur', 'carmen', 'clares', 'glasses01', 'glasses02', 'square01', 'round01'
];

const MOUTH_STYLES = [
  'bite', 'diagram', 'grill01', 'grill02', 'smile01', 'square01', 'square02'
];

const BASE_URL = 'https://api.dicebear.com/7.x/bottts/svg';

export const AvatarSelection = () => {
  const { user, setActiveModal, updateAvatar } = useGameStore();
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize state from existing avatar URL or default
  const [topIndex, setTopIndex] = useState(0);
  const [faceIndex, setFaceIndex] = useState(0);
  const [mouthIndex, setMouthIndex] = useState(0);

  useEffect(() => {
    if (user?.avatar?.includes('?')) {
      try {
        const urlParams = new URLSearchParams(user.avatar.split('?')[1]);
        
        const top = urlParams.get('top');
        const face = urlParams.get('face');
        const mouth = urlParams.get('mouth');

        if (top) setTopIndex(Math.max(0, TOP_STYLES.indexOf(top)));
        if (face) setFaceIndex(Math.max(0, FACE_STYLES.indexOf(face)));
        if (mouth) setMouthIndex(Math.max(0, MOUTH_STYLES.indexOf(mouth)));
      } catch (e) {
        // Ignore parse errors, stick to defaults
      }
    }
  }, [user?.avatar]);

  const currentAvatarUrl = `${BASE_URL}?seed=${user?.name || 'player'}&top=${TOP_STYLES[topIndex]}&face=${FACE_STYLES[faceIndex]}&mouth=${MOUTH_STYLES[mouthIndex]}`;

  const handleSave = async () => {
    setIsUpdating(true);
    await updateAvatar(currentAvatarUrl);
    setIsUpdating(false);
    setActiveModal('none');
  };

  const cycle = (current: number, max: number, direction: 1 | -1) => {
    let next = current + direction;
    if (next >= max) next = 0;
    if (next < 0) next = max - 1;
    return next;
  };

  const SelectorRow = ({ label, onPrev, onNext }: { label: string, onPrev: () => void, onNext: () => void }) => (
    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border-2 border-slate-100 dark:border-slate-700">
      <button 
        onClick={onPrev}
        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-300"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="font-bold text-sm text-slate-700 dark:text-slate-200 uppercase tracking-wider">{label}</span>
      <button 
        onClick={onNext}
        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-300"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full relative animate-in zoom-in-95 flex flex-col items-center">
        <button 
          onClick={() => setActiveModal('none')} 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-black mb-6 font-serif text-slate-900 dark:text-white">Customize Avatar</h2>
        
        <div className="w-40 h-40 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-emerald-500 shadow-xl mb-8 overflow-hidden relative group">
          <img 
            src={currentAvatarUrl} 
            alt="Custom Avatar Preview" 
            className="w-full h-full object-cover p-3 transition-transform duration-300 group-hover:scale-110" 
          />
        </div>
        
        <div className="w-full space-y-3 mb-8">
          <SelectorRow 
            label="Hat / Top" 
            onPrev={() => setTopIndex(curr => cycle(curr, TOP_STYLES.length, -1))}
            onNext={() => setTopIndex(curr => cycle(curr, TOP_STYLES.length, 1))}
          />
          <SelectorRow 
            label="Face / Eyes" 
            onPrev={() => setFaceIndex(curr => cycle(curr, FACE_STYLES.length, -1))}
            onNext={() => setFaceIndex(curr => cycle(curr, FACE_STYLES.length, 1))}
          />
          <SelectorRow 
            label="Mouth / Grill" 
            onPrev={() => setMouthIndex(curr => cycle(curr, MOUTH_STYLES.length, -1))}
            onNext={() => setMouthIndex(curr => cycle(curr, MOUTH_STYLES.length, 1))}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold py-3.5 rounded-full hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <Check size={20} />
              Save Avatar
            </>
          )}
        </button>
      </div>
    </div>
  );
};

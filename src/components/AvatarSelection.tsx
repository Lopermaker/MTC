import { useGameStore } from '../store';
import { X } from 'lucide-react';
import { useState } from 'react';

const AVATARS = [
  'Felix', 'Aneka', 'Sam', 'Jude', 'Leo', 'Mia', 'Nala', 'Oliver', 'Zoe', 'Max', 'Ruby', 'Oscar'
].map(seed => `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`);

export const AvatarSelection = () => {
  const { user, setActiveModal, updateAvatar } = useGameStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSelect = async (avatar: string) => {
    setIsUpdating(true);
    await updateAvatar(avatar);
    setIsUpdating(false);
    setActiveModal('none');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-in zoom-in-95">
        <button 
          onClick={() => setActiveModal('none')} 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-black mb-6 font-serif text-center text-slate-900 dark:text-white">Choose Avatar</h2>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {AVATARS.map((avatar, i) => (
            <button
              key={i}
              disabled={isUpdating}
              onClick={() => handleSelect(avatar)}
              className={`relative aspect-square rounded-full overflow-hidden border-4 transition-all hover:scale-105 active:scale-95 ${user?.avatar === avatar ? 'border-emerald-500 scale-105 shadow-lg' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'} bg-slate-100 dark:bg-slate-800`}
            >
              <img src={avatar} alt={`Avatar ${i}`} className="w-full h-full object-cover p-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

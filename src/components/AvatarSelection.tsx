import { useGameStore } from '../store';
import { X, Upload, Check } from 'lucide-react';
import { useState, useRef } from 'react';

export const AvatarSelection = () => {
  const { user, setActiveModal, updateAvatar } = useGameStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Resize image to max 256x256
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 256;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to highly compressed JPEG to save local storage & DB space
          const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setPreviewUrl(resizedDataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!previewUrl) return;
    setIsUpdating(true);
    await updateAvatar(previewUrl);
    setIsUpdating(false);
    setActiveModal('none');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full relative animate-in zoom-in-95 flex flex-col items-center">
        <button 
          onClick={() => setActiveModal('none')} 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-black mb-2 font-serif text-slate-900 dark:text-white">Profile Picture</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 text-center">Upload a custom image for your avatar.</p>
        
        <div className="relative mb-8 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="w-40 h-40 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-emerald-500 shadow-xl overflow-hidden flex items-center justify-center">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              />
            ) : (
              <span className="text-6xl font-bold uppercase text-slate-400">
                {user?.name?.charAt(0) || '?'}
              </span>
            )}
          </div>
          
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
            <Upload size={32} />
            <span className="text-sm font-bold">Upload Image</span>
          </div>
        </div>

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/webp, image/gif"
          className="hidden"
        />
        
        <div className="w-full space-y-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold py-3.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
          >
            <Upload size={20} />
            Choose File
          </button>

          <button
            onClick={handleSave}
            disabled={isUpdating || !previewUrl || previewUrl === user?.avatar}
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
    </div>
  );
};

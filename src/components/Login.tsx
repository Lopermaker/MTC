import { useState } from 'react';
import { useGameStore } from '../store';
import { X, Mail, ArrowRight, Lock, User as UserIcon } from 'lucide-react';

export const Login = () => {
  const { setActiveModal, setUser } = useGameStore();
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const body = isLogin ? { email, password } : { email, password, name };

      // Try actual backend, fallback to local storage
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user, data.token);
          setActiveModal('none');
          return;
        }
      } catch (e) {
        // Backend not available (e.g. Netlify), fallback to local demo
        setTimeout(() => {
          setUser({ name: name || email.split('@')[0], email }, 'fake-jwt-token-for-demo');
          setActiveModal('none');
          setIsSubmitting(false);
        }, 500);
        return;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setError(`${provider} login requires OAuth configuration. Please use email for now.`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-slate-900 animate-in fade-in duration-300">
      <button 
        onClick={() => setActiveModal('none')} 
        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
      >
        <X size={28} />
      </button>

      <div className="w-full max-w-md px-8 flex flex-col items-center animate-in slide-in-from-bottom-8 duration-500">
        <h2 className="text-3xl font-black font-serif tracking-tight mb-2 text-slate-900 dark:text-white text-center">
          {isLogin ? 'Log in' : 'Create an account'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-8 font-medium">
          Save your stats and sync across devices.
        </p>

        <div className="w-full space-y-4">
          <button 
            type="button"
            onClick={() => handleSocialLogin('Google')}
            disabled={isSubmitting}
            className="w-full relative flex items-center justify-center gap-3 bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 font-bold py-3.5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 absolute left-6" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <button 
            type="button"
            onClick={() => handleSocialLogin('Apple')}
            disabled={isSubmitting}
            className="w-full relative flex items-center justify-center gap-3 bg-black text-white hover:bg-slate-800 font-bold py-3.5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 absolute left-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.75-1.51.05-2.002-.92-3.69-.92-1.698 0-2.242.92-3.67.96-1.52.05-2.662-1.51-3.63-2.92-2.02-2.89-3.55-8.25-1.468-11.83C4.542 6.54 6.273 5.3 8.04 5.26c1.46-.04 2.82.96 3.73.96.902 0 2.54-1.22 4.29-1.04 1.83.08 3.48 1.02 4.45 2.65-3.8 2.24-3.17 7.42.41 8.8z"/>
            </svg>
            Continue with Apple
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink-0 px-4 text-sm text-slate-400 font-bold uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {error && (
              <div className="text-sm font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-3 text-center">
                {error}
              </div>
            )}
            
            {!isLogin && (
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Display Name"
                  disabled={isSubmitting}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors disabled:opacity-50"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                disabled={isSubmitting}
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors disabled:opacity-50"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                disabled={isSubmitting}
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors disabled:opacity-50"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold py-3.5 rounded-full hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 mt-2"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Log In' : 'Create Account'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </div>

        <p className="mt-8 text-xs text-slate-400 text-center max-w-[280px]">
          By continuing, you agree to the Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
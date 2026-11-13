import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Shield, Award, BookOpen } from 'lucide-react';

export default function Navbar({ 
  darkMode, 
  setDarkMode, 
  soundEnabled, 
  setSoundEnabled, 
  activeView, 
  setActiveView,
  isExamInProgress,
  onEndTestConfirm
}) {
  const handleNavClick = (view) => {
    if (isExamInProgress) {
      if (window.confirm("പരീക്ഷ നടന്നുകൊണ്ടിരിക്കുകയാണ്. പുറത്തുപോയാൽ ഈ പരീക്ഷ അവസാനിക്കും. തീർച്ചയാണോ?")) {
        onEndTestConfirm();
        setActiveView(view);
      }
    } else {
      setActiveView(view);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      {/* Indian National Tricolor accent bar */}
      <div className="h-1.5 w-full grid grid-cols-3">
        <div className="bg-[#FF9933]"></div>
        <div className="bg-white"></div>
        <div className="bg-[#128807]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                സാരഥി <span className="text-sky-600 dark:text-sky-400">SARATHI</span>
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                Kerala MVD
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              മോട്ടോർ വാഹന വകുപ്പ് • ലേണേഴ്സ് ലൈസൻസ് മോക്ക് പരീക്ഷാ പോർട്ടൽ
            </p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs sm:text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeView === 'home'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-sky-500" />
              <span>മോക്ക് പരീക്ഷ</span>
            </button>
            <button
              onClick={() => handleNavClick('practice-menu')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeView === 'practice-menu' || activeView === 'practice'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              <span>പഠന മോഡ്</span>
            </button>
          </nav>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={soundEnabled ? "ശബ്ദം നിശബ്ദമാക്കുക (Mute)" : "ശബ്ദം ഓണാക്കുക (Unmute)"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? "ലൈറ്റ് മോഡ് (Light Mode)" : "ഡാർക്ക് മോഡ് (Dark Mode)"}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

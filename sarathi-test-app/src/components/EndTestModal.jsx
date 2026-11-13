import React from 'react';
import { AlertTriangle, LogOut, X } from 'lucide-react';

export default function EndTestModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
        <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            പരീക്ഷ അവസാനിപ്പിക്കണോ?
          </h3>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          തീർച്ചയാണോ? ഇപ്പോൾ പരീക്ഷ അവസാനിപ്പിച്ചാൽ ബാക്കിയുള്ള ചോദ്യങ്ങൾ ഉത്തരം നൽകാത്തതായി രേഖപ്പെടുത്തുകയും നിലവിലെ സ്കോർ കണക്കാക്കുകയും ചെയ്യും.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors"
          >
            തുടരുക (Continue Test)
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/20 transition-all"
          >
            അവസാനിപ്പിക്കുക (End Test)
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { 
  Play, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  User,
  Hash,
  Award
} from 'lucide-react';

export default function HomeView({ 
  candidateInfo, 
  setCandidateInfo, 
  onStartExam, 
  onStartPractice 
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-900 text-white p-6 sm:p-10 shadow-xl shadow-sky-950/20">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>യഥാർത്ഥ സാരഥി പരീക്ഷാ മാതൃക • Official Sarathi Exam Replica</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            കേരള ലേണേഴ്സ് ലൈസൻസ് <br className="hidden sm:inline" />
            <span className="text-amber-300">കംപ്യൂട്ടർ അധിഷ്ഠിത മോക്ക് ടെസ്റ്റ്</span>
          </h1>

          <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed font-normal">
            മോട്ടോർ വാഹന വകുപ്പിന്റെ (MVD) ഒഫീഷ്യൽ 942 ചോദ്യശേഖരവും 310 ട്രാഫിക് ചിഹ്ന ചിത്രങ്ങളും അടങ്ങിയ സാരഥി മാതൃകാ പരീക്ഷയും സ്വയം പഠന സംവിധാനവും.
          </p>
        </div>
      </div>

      {/* Candidate Profile Setup (Sarathi Style) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-sky-600" />
          <span>അപേക്ഷകന്റെ വിവരങ്ങൾ (Candidate Details)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              അപേക്ഷകന്റെ പേര് (Candidate Name)
            </label>
            <div className="relative">
              <input
                type="text"
                value={candidateInfo.name}
                onChange={(e) => setCandidateInfo({ ...candidateInfo, name: e.target.value })}
                className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="ഉദാ: അനിൽ കുമാർ (ANIL KUMAR)"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              അപേക്ഷാ നമ്പർ (Application Number)
            </label>
            <div className="relative">
              <input
                type="text"
                value={candidateInfo.appNo}
                onChange={(e) => setCandidateInfo({ ...candidateInfo, appNo: e.target.value })}
                className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                placeholder="KL-01/2026/0014298"
              />
              <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Choice Cards: Mock Exam vs Practice Mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Official Mock Exam */}
        <div className="relative flex flex-col justify-between bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-sky-500/30 dark:border-sky-500/20 hover:border-sky-500 transition-all shadow-lg hover:shadow-xl group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-current" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                സാരഥി മാതൃക
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              മോക്ക് പരീക്ഷ (Mock Exam)
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              യഥാർത്ഥ RTO പരീക്ഷാ മുറികളിലെ അതേ നിയമങ്ങൾ. 30 ചോദ്യങ്ങൾ, ഓരോന്നിനും 30 സെക്കൻഡ് വീതം സമയം.
            </p>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-500 shrink-0" />
                <span>30 സെക്കൻഡ് ടൈമർ (ഓട്ടോമാറ്റിക് സബ്മിഷൻ)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>പാസ് മാർക്ക്: 18 / 30 (60% സ്കോർ)</span>
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>ബാക്ക് നാവിഗേഷൻ അനുവദനീയമല്ല</span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>കീബോർഡ് ഷോർട്ട്കട്ട്: 1-4 ഓപ്ഷൻ, Enter സ്ഥിരീകരിക്കാൻ</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={onStartExam}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-sky-600/25 transition-all transform active:scale-[0.98]"
            >
              <span>പരീക്ഷ ആരംഭിക്കുക (Start Exam)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 2: Interactive Practice Mode */}
        <div className="relative flex flex-col justify-between bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all shadow-md hover:shadow-xl group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                പഠന ട്രാക്കിംഗ് മോഡ്
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              വിഷയാധിഷ്ഠിത പരിശീലനം (Study Mode)
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              ടൈം പ്രഷർ ഇല്ലാതെ ചോദ്യങ്ങൾ പരിശീലിച്ച് പുരോഗതി സേവ് ചെയ്യാം. തെറ്റിയ ചോദ്യങ്ങൾ വീണ്ടും പഠിക്കാം.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button 
                onClick={() => onStartPractice("Road Signs & Traffic Signals")}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-left transition-all"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200">ട്രാഫിക് ചിഹ്നങ്ങൾ</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">178 ചിത്ര ചോദ്യങ്ങൾ</div>
              </button>

              <button 
                onClick={() => onStartPractice("Driving Rules & Regulations")}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-left transition-all"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200">ഡ്രൈവിംഗ് നിയമങ്ങൾ</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">650 ചോദ്യങ്ങൾ</div>
              </button>

              <button 
                onClick={() => onStartPractice("Penalties, Fines & Offenses")}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-left transition-all"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200">പിഴകളും ശിക്ഷകളും</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">67 പ്രധാന ചോദ്യങ്ങൾ</div>
              </button>

              <button 
                onClick={() => onStartPractice(null)}
                className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 hover:border-emerald-500 text-left transition-all"
              >
                <div className="font-semibold text-emerald-800 dark:text-emerald-200">പഠന ഡാഷ്‌ബോർഡ്</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400">പുരോഗതി പരിശോധിക്കാൻ →</div>
              </button>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => onStartPractice(null)}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all transform active:scale-[0.98]"
            >
              <span>പഠന ഡാഷ്‌ബോർഡ് തുറക്കുക (Study Dashboard)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Trust & Bank Overview Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-2xl font-black text-sky-600 dark:text-sky-400">942</div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">മലയാളം ചോദ്യങ്ങൾ</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-2xl font-black text-amber-500">310</div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">ട്രാഫിക് ചിഹ്ന ചിത്രങ്ങൾ</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">18 / 30</div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">പാസ് മാർക്ക് (60%)</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">100%</div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">ഓഫ്‌ലൈൻ പുരോഗതി</div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Sparkles, 
  Flame, 
  Play, 
  Layers, 
  TrendingUp,
  XCircle,
  HelpCircle,
  Trash2
} from 'lucide-react';
import { 
  getStudyProgress, 
  calculateProgressStats, 
  calculateTopicStats, 
  resetStudyProgress 
} from '../utils/studyProgress';

export default function PracticeMenu({ allQuestions, onSelectTopic, onStartCustomList }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const stats = calculateProgressStats(allQuestions);
  const { history } = getStudyProgress();

  // Buckets for interactive filtering
  const nextUnattempted = allQuestions.find(q => !history[q.id] || history[q.id].attempts === 0);
  const unattemptedQuestions = allQuestions.filter(q => !history[q.id] || history[q.id].attempts === 0);
  const masteredQuestions = allQuestions.filter(q => history[q.id] && history[q.id].status === 'mastered');
  const learningQuestions = allQuestions.filter(q => history[q.id] && history[q.id].status === 'learning');
  const mistakeQuestions = allQuestions.filter(q => history[q.id] && history[q.id].status === 'mistake');

  // Topics configuration
  const topics = [
    {
      id: 'Road Signs & Traffic Signals',
      title: 'ട്രാഫിക് ചിഹ്നങ്ങളും സിഗ്നലുകളും',
      subtitle: 'Traffic Signs, Hand Signals & Road Markings',
      color: 'from-amber-500 to-orange-600',
      description: 'സൂചനാ ബോർഡുകൾ, നിരോധിത ചിഹ്നങ്ങൾ, റോഡ് ലൈനുകൾ എന്നിവ അടങ്ങിയ ചിത്ര ചോദ്യങ്ങൾ.'
    },
    {
      id: 'Driving Rules & Regulations',
      title: 'ഡ്രൈവിംഗ് നിയമങ്ങളും സുരക്ഷയും',
      subtitle: 'Driving Rules, Speed Limits & Overtaking',
      color: 'from-sky-500 to-indigo-600',
      description: 'റോഡ് അവകാശങ്ങൾ, ജംഗ്ഷൻ നിയമങ്ങൾ, കാൽനടയാത്രക്കാരുടെ മുൻഗണന, ഗതാഗത ചിട്ടകൾ.'
    },
    {
      id: 'Penalties, Fines & Offenses',
      title: 'പിഴകളും ശിക്ഷകളും (MVD Penalties)',
      subtitle: 'MVD Sections, Fines & Punishments',
      color: 'from-rose-500 to-red-600',
      description: 'മദ്യപിച്ചുള്ള ഡ്രൈവിംഗ്, ഹെൽമെറ്റ്/സീറ്റ്ബെൽറ്റ് നിയമലംഘനങ്ങൾ, ഭാരപരിധി പിഴകൾ.'
    },
    {
      id: 'Road Safety & First Aid',
      title: 'റോഡ് സുരക്ഷയും പ്രഥമശുശ്രൂഷയും',
      subtitle: 'Road Safety, First Aid & Good Samaritan',
      color: 'from-teal-500 to-emerald-600',
      description: 'ഗോൾഡൻ അവർ, അപകടങ്ങളിൽ ചെയ്യേണ്ട കാര്യങ്ങൾ, പ്രഥമശുശ്രൂഷാ രീതികൾ.'
    },
    {
      id: 'Licensing & Documentation',
      title: 'ലൈസൻസും വാഹന രേഖകളും',
      subtitle: 'Learner License Rules & Vehicle Documents',
      color: 'from-violet-500 to-purple-600',
      description: 'ലേണേഴ്സ് ലൈസൻസ് കാലാവധി, ആർസി ബുക്ക്, ഇൻഷുറൻസ്, പിയുസിസി രേഖകൾ.'
    },
    {
      id: 'ALL',
      title: 'സമ്പൂർണ്ണ ചോദ്യശേഖരം (942 ചോദ്യങ്ങൾ)',
      subtitle: 'Complete Question Bank Practice',
      color: 'from-blue-600 to-cyan-600',
      description: 'മോട്ടോർ വാഹന വകുപ്പിന്റെ മുഴുവൻ ഒഫീഷ്യൽ ചോദ്യങ്ങളും തുടർച്ചയായി പരിശീലിക്കാം.'
    }
  ];

  const handleReset = () => {
    if (window.confirm("നിങ്ങളുടെ പഠന പുരോഗതി (Progress) പൂർണ്ണമായും റീസെറ്റ് ചെയ്യണോ?")) {
      resetStudyProgress();
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleResume = () => {
    if (nextUnattempted) {
      const unattemptedIndex = allQuestions.findIndex(q => q.id === nextUnattempted.id);
      onStartCustomList(allQuestions, unattemptedIndex, "പഠനം തുടരുക (Continue Learning)");
    } else {
      onStartCustomList(allQuestions, 0, "സമ്പൂർണ്ണ ചോദ്യശേഖരം");
    }
  };

  const handlePracticeBucket = (type) => {
    if (type === 'mastered' && masteredQuestions.length > 0) {
      onStartCustomList(masteredQuestions, 0, "നന്നായി പഠിച്ചവയുടെ റിവിഷൻ (Mastered Questions)");
    } else if (type === 'learning' && learningQuestions.length > 0) {
      onStartCustomList(learningQuestions, 0, "പഠിക്കുന്നവയുടെ പരിശീലനം (Learning Questions)");
    } else if (type === 'mistakes' && mistakeQuestions.length > 0) {
      onStartCustomList(mistakeQuestions, 0, "തെറ്റിയ ചോദ്യങ്ങളുടെ റിവിഷൻ (Mistakes Revision)");
    } else if (type === 'unattempted' && unattemptedQuestions.length > 0) {
      onStartCustomList(unattemptedQuestions, 0, "ബാക്കിയുള്ള ചോദ്യങ്ങൾ (Unattempted Questions)");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3.5 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fadeIn overflow-x-hidden" key={refreshKey}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>സ്വയം പഠന മോഡ് • STUDY & MASTERY TRACKING</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white break-words">
            പഠന പുരോഗതിയും വിഷയങ്ങളും
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            ഓരോ ചോദ്യത്തിന്റെയും പുരോഗതി സേവ് ചെയ്ത് നിങ്ങളുടെ വേഗതയിൽ പരിശീലിക്കുക.
          </p>
        </div>

        {stats.attempted > 0 && (
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>റീസെറ്റ് (Reset Progress)</span>
          </button>
        )}
      </div>

      {/* Main Study Progress Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              ആകെ പഠന പുരോഗതി (OVERALL STUDY PROGRESS)
            </div>
            <div className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 break-words">
              <span>{stats.attempted}</span>
              <span className="text-slate-400 text-base sm:text-xl font-bold"> / {stats.total} ചോദ്യങ്ങൾ</span>
              <span className="ml-2 sm:ml-3 text-sm sm:text-lg font-bold text-sky-600 dark:text-sky-400">
                ({stats.percentCompleted}%)
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={handleResume}
              className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20 transition-all transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-current shrink-0" />
              <span>തുടരുക (Continue Learning)</span>
            </button>

            {mistakeQuestions.length > 0 && (
              <button
                onClick={() => handlePracticeBucket('mistakes')}
                className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>തെറ്റിയവ ({mistakeQuestions.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Multi-Color Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 sm:h-3 rounded-full overflow-hidden flex">
          <div 
            className="bg-emerald-500 h-full transition-all duration-500" 
            style={{ width: `${(stats.mastered / stats.total) * 100}%` }}
            title={`Mastered: ${stats.mastered}`}
          ></div>
          <div 
            className="bg-amber-400 h-full transition-all duration-500" 
            style={{ width: `${(stats.learning / stats.total) * 100}%` }}
            title={`Learning: ${stats.learning}`}
          ></div>
          <div 
            className="bg-rose-500 h-full transition-all duration-500" 
            style={{ width: `${(stats.mistakes / stats.total) * 100}%` }}
            title={`Mistakes: ${stats.mistakes}`}
          ></div>
        </div>

        {/* Interactive 4-Card Mastery Grid (Fully responsive on phone screens) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Card 1: Mastered */}
          <div 
            onClick={() => handlePracticeBucket('mastered')}
            className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer min-w-0 overflow-hidden ${
              masteredQuestions.length > 0 
                ? 'bg-emerald-50/70 hover:bg-emerald-100/70 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 active:scale-95' 
                : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40 opacity-80'
            }`}
            title="നന്നായി പഠിച്ചവ പരിശീലിക്കാൻ ക്ലിക്ക് ചെയ്യുക"
          >
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 text-[11px] sm:text-xs font-bold mb-1 min-w-0">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">നന്നായി പഠിച്ചവ</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-800 dark:text-emerald-200 my-0.5">
              {stats.mastered}
            </div>
            <div className="text-[10px] sm:text-[11px] text-emerald-600/80 dark:text-emerald-400/80 truncate">
              2+ തവണ ശരിയുത്തരം
            </div>
          </div>

          {/* Card 2: Learning (Fixed: text shortened to 'പഠിക്കുന്നവ' so it never spills outside) */}
          <div 
            onClick={() => handlePracticeBucket('learning')}
            className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer min-w-0 overflow-hidden ${
              learningQuestions.length > 0 
                ? 'bg-amber-50/70 hover:bg-amber-100/70 dark:bg-amber-950/40 dark:hover:bg-amber-950/60 border-amber-300 dark:border-amber-800 active:scale-95' 
                : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/40 opacity-80'
            }`}
            title="പഠിക്കുന്നവ പരിശീലിക്കാൻ ക്ലിക്ക് ചെയ്യുക"
          >
            <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 text-[11px] sm:text-xs font-bold mb-1 min-w-0">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">പഠിക്കുന്നവ</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-800 dark:text-amber-200 my-0.5">
              {stats.learning}
            </div>
            <div className="text-[10px] sm:text-[11px] text-amber-600/80 dark:text-amber-400/80 truncate">
              1 തവണ ശരിയായവ
            </div>
          </div>

          {/* Card 3: Mistakes */}
          <div 
            onClick={() => handlePracticeBucket('mistakes')}
            className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer min-w-0 overflow-hidden ${
              mistakeQuestions.length > 0 
                ? 'bg-rose-50/70 hover:bg-rose-100/70 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 border-rose-300 dark:border-rose-800 active:scale-95' 
                : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-900/40 opacity-80'
            }`}
            title="തെറ്റിയവ റിവൈസ് ചെയ്യാൻ ക്ലിക്ക് ചെയ്യുക"
          >
            <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300 text-[11px] sm:text-xs font-bold mb-1 min-w-0">
              <XCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">തെറ്റിയവ (റിവിഷൻ)</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-800 dark:text-rose-200 my-0.5">
              {stats.mistakes}
            </div>
            <div className="text-[10px] sm:text-[11px] text-rose-600/80 dark:text-rose-400/80 truncate">
              വീണ്ടും പഠിക്കേണ്ടവ
            </div>
          </div>

          {/* Card 4: Unattempted */}
          <div 
            onClick={() => handlePracticeBucket('unattempted')}
            className="p-3 sm:p-3.5 rounded-2xl bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer min-w-0 overflow-hidden active:scale-95"
            title="തുടങ്ങാത്ത ചോദ്യങ്ങൾ ആരംഭിക്കാൻ ക്ലിക്ക് ചെയ്യുക"
          >
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs font-bold mb-1 min-w-0">
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">ബാക്കിയുള്ളവ</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-200 my-0.5">
              {stats.unattempted}
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
              തുടങ്ങാത്ത ചോദ്യങ്ങൾ
            </div>
          </div>
        </div>
      </div>

      {/* Topic Selection Grid with Individual Progress Bars */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-sky-600 shrink-0" />
          <span>വിഷയാടിസ്ഥാനത്തിൽ തിരഞ്ഞെടുക്കുക (Select Topic)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {topics.map((t) => {
            const topicQuestions = t.id === 'ALL' 
              ? allQuestions 
              : allQuestions.filter(q => q.topic === t.id);
            const topicStat = calculateTopicStats(topicQuestions);

            return (
              <div
                key={t.id}
                onClick={() => onSelectTopic(t.id)}
                className="cursor-pointer group relative overflow-hidden rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[11px] sm:text-xs font-bold text-white bg-gradient-to-r ${t.color}`}>
                      {topicStat.total} ചോദ്യങ്ങൾ
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {topicStat.percent}%
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {t.title}
                    </h3>
                    <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-2">
                      {t.subtitle}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {t.description}
                    </p>
                  </div>
                </div>

                {/* Topic Progress Bar */}
                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-600 dark:bg-sky-500 h-full transition-all"
                      style={{ width: `${topicStat.percent}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{topicStat.attempted} / {topicStat.total} പൂർത്തിയായി</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      പഠിക്കുക <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

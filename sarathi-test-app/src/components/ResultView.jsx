import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  RotateCcw, 
  Home, 
  Filter, 
  ArrowRight,
  Shield,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playPassFanfare, playFailTone } from '../utils/audio';

export default function ResultView({
  answersLog,
  candidateInfo,
  onRetakeExam,
  onBackToHome,
  soundEnabled
}) {
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'WRONG', 'CORRECT'

  const totalQuestions = answersLog.length;
  const correctCount = answersLog.filter(a => a.isCorrect).length;
  const wrongCount = answersLog.filter(a => !a.isCorrect && a.selected !== null).length;
  const skippedCount = answersLog.filter(a => a.selected === null).length;

  const isPassed = correctCount >= 18; // Kerala MVD Sarathi pass threshold is 18/30

  // Trigger celebration or fail tone
  useEffect(() => {
    if (isPassed) {
      playPassFanfare(soundEnabled);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // canvas-confetti fallback
      }
    } else {
      playFailTone(soundEnabled);
    }
  }, [isPassed, soundEnabled]);

  const filteredLogs = answersLog.filter(item => {
    if (filter === 'WRONG') return !item.isCorrect;
    if (filter === 'CORRECT') return item.isCorrect;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Official Assessment Header Banner */}
      <div className={`rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden ${
        isPassed 
          ? 'bg-gradient-to-r from-emerald-600 via-teal-700 to-sky-800 shadow-emerald-950/20'
          : 'bg-gradient-to-r from-rose-600 via-rose-700 to-amber-800 shadow-rose-950/20'
      }`}>
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>സാരഥി പരീക്ഷാ ഫലം • Sarathi Assessment Report</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black">
              {isPassed ? "അഭിനന്ദനങ്ങൾ! നിങ്ങൾ വിജയിച്ചു" : "പരീക്ഷ പരാജയപ്പെട്ടു"}
            </h1>
            <p className="text-sm sm:text-base text-white/90 font-medium">
              {isPassed 
                ? "നിങ്ങൾ കേരള മോട്ടോർ വാഹന വകുപ്പിന്റെ ലേണേഴ്സ് ലൈസൻസ് പരീക്ഷാ യോഗ്യത നേടി."
                : "വിഷമിക്കേണ്ട, തെറ്റുകൾ തിരുത്തി വീണ്ടും പരിശീലിച്ച് പരീക്ഷ എഴുതാം."}
            </p>
            <div className="text-xs text-white/80 font-mono pt-1">
              അപേക്ഷകൻ: {candidateInfo.name || "Candidate"} • App No: {candidateInfo.appNo || "KL-01/2026/0014298"}
            </div>
          </div>

          {/* Score Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-3xl p-6 text-center shrink-0 w-44">
            <div className="text-xs font-bold uppercase tracking-wider text-white/80">ആകെ സ്കോർ</div>
            <div className="text-4xl sm:text-5xl font-black my-1">
              {correctCount}
              <span className="text-xl sm:text-2xl text-white/70">/{totalQuestions}</span>
            </div>
            <div className={`inline-block px-3 py-0.5 rounded-full text-xs font-extrabold uppercase ${
              isPassed ? 'bg-white text-emerald-800' : 'bg-white text-rose-800'
            }`}>
              {isPassed ? "PASSED (യോഗ്യത)" : "FAILED (പരാജയം)"}
            </div>
          </div>
        </div>
      </div>

      {/* Metric Breakdown Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center mb-1">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{correctCount}</div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">ശരിയായ ഉത്തരങ്ങൾ</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 mx-auto flex items-center justify-center mb-1">
            <XCircle className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{wrongCount}</div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">തെറ്റിയ ഉത്തരങ്ങൾ</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 mx-auto flex items-center justify-center mb-1">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{skippedCount}</div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">ഉത്തരം നൽകാത്തവ</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onRetakeExam}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>മോക്ക് പരീക്ഷ വീണ്ടും എഴുതുക (Retake Exam)</span>
        </button>

        <button
          onClick={onBackToHome}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>ഹോം പേജിലേക്ക് (Home)</span>
        </button>
      </div>

      {/* Detailed Question-by-Question Review Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-600" />
              <span>ഉത്തരങ്ങളുടെ സമഗ്ര അവലോകനം (Question Review)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ഓരോ ചോദ്യത്തിനും നൽകിയ ഉത്തരവും യഥാർത്ഥ ഉത്തരവും പരിശോധിക്കാം.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium self-stretch sm:self-auto justify-center">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === 'ALL'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              എല്ലാം ({totalQuestions})
            </button>
            <button
              onClick={() => setFilter('WRONG')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === 'WRONG'
                  ? 'bg-rose-500 text-white shadow-sm font-bold'
                  : 'text-rose-600 dark:text-rose-400 hover:text-rose-700'
              }`}
            >
              തെറ്റിയവ ({wrongCount + skippedCount})
            </button>
            <button
              onClick={() => setFilter('CORRECT')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === 'CORRECT'
                  ? 'bg-emerald-500 text-white shadow-sm font-bold'
                  : 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700'
              }`}
            >
              ശരിയായവ ({correctCount})
            </button>
          </div>
        </div>

        {/* Filtered Question Cards */}
        <div className="space-y-4">
          {filteredLogs.map((item, idx) => {
            const q = item.question;
            const chosenOpt = q.options.find(o => o.key === item.selected);
            const correctOpt = q.options.find(o => o.key === q.answer);

            return (
              <div
                key={idx}
                className={`rounded-2xl p-5 border transition-all ${
                  item.isCorrect
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    : 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        #{q.number || q.id}
                      </span>
                      {item.isCorrect ? (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> ശരി
                        </span>
                      ) : (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> തെറ്റ്
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                      {q.question}
                    </h3>
                  </div>

                  {/* Sign Image if any */}
                  {q.question_image && (
                    <div className="shrink-0 p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <img
                        src={`/${q.question_image}`}
                        alt="Sign"
                        className="max-h-16 max-w-[80px] object-contain"
                      />
                    </div>
                  )}
                </div>

                {/* Answers Comparison */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Your Answer */}
                  <div className={`p-3 rounded-xl border ${
                    item.isCorrect
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  }`}>
                    <span className="font-bold block mb-1">നിങ്ങൾ നൽകിയ ഉത്തരം:</span>
                    {chosenOpt ? (
                      chosenOpt.image ? (
                        <img src={`/${chosenOpt.image}`} alt="Chosen" className="max-h-12 object-contain" />
                      ) : (
                        <span>{chosenOpt.text}</span>
                      )
                    ) : (
                      <span className="italic text-slate-500">ഉത്തരം നൽകിയില്ല (സമയം കഴിഞ്ഞു)</span>
                    )}
                  </div>

                  {/* Correct Answer */}
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100">
                    <span className="font-bold block mb-1 text-emerald-700 dark:text-emerald-300">
                      ശരിയായ ഉത്തരം:
                    </span>
                    {correctOpt ? (
                      correctOpt.image ? (
                        <img src={`/${correctOpt.image}`} alt="Correct" className="max-h-12 object-contain" />
                      ) : (
                        <span className="font-semibold">{correctOpt.text}</span>
                      )
                    ) : (
                      <span>{q.answer_text}</span>
                    )}
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

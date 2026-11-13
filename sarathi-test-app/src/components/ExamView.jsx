import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  Check, 
  X, 
  AlertCircle, 
  User, 
  Hash, 
  Volume2, 
  ArrowRight, 
  ArrowLeft,
  LogOut,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Award
} from 'lucide-react';
import { playTick, playUrgentBeep, playSelectSound, playConfirmSound } from '../utils/audio';
import { saveQuestionAttempt, getStudyProgress } from '../utils/studyProgress';

export default function ExamView({
  questions,
  candidateInfo,
  isPracticeMode,
  initialIndex = 0,
  customTitle = null,
  soundEnabled,
  onFinishExam,
  onEndTestRequest
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [selectedOption, setSelectedOption] = useState(null); // 'A', 'B', 'C', 'D'
  const [answersLog, setAnswersLog] = useState([]); // array of { question, selected, isCorrect, timeSpent }
  const [timeLeft, setTimeLeft] = useState(30);
  const [hasSubmittedPractice, setHasSubmittedPractice] = useState(false);
  const [masteryBadge, setMasteryBadge] = useState(null);

  const currentQuestion = questions[currentIndex] || null;
  const timerRef = useRef(null);

  // Sync initialIndex if prop changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Reset timer & option when question changes
  useEffect(() => {
    setSelectedOption(null);
    setHasSubmittedPractice(false);
    setMasteryBadge(null);
    setTimeLeft(30);

    // If mock exam (30s timer)
    if (!isPracticeMode) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmitOnTimeout();
            return 0;
          }
          if (prev <= 6 && prev > 1) {
            playUrgentBeep(soundEnabled);
          } else if (prev <= 10) {
            playTick(soundEnabled);
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPracticeMode]);

  // Handle timeout (auto submit with null answer)
  const handleAutoSubmitOnTimeout = () => {
    commitAnswer(null);
  };

  // Keyboard shortcut listener: 1-4 to select, Enter to confirm
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const keyMap = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
        const optKey = keyMap[e.key];
        if (currentQuestion && currentQuestion.options.some(o => o.key === optKey)) {
          setSelectedOption(optKey);
          playSelectSound(soundEnabled);
        }
      } else if (e.key === 'Enter') {
        if (isPracticeMode && !hasSubmittedPractice) {
          if (selectedOption) handlePracticeCheck();
        } else if (selectedOption) {
          handleConfirm();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, isPracticeMode, hasSubmittedPractice, currentQuestion]);

  // Select Option
  const handleSelectOption = (key) => {
    if (isPracticeMode && hasSubmittedPractice) return;
    setSelectedOption(key);
    playSelectSound(soundEnabled);
  };

  // Practice Mode Check
  const handlePracticeCheck = () => {
    if (!selectedOption) return;
    const isCorrect = selectedOption === currentQuestion.answer;
    setHasSubmittedPractice(true);
    playConfirmSound(soundEnabled);

    // Save progress to LocalStorage
    const qHist = saveQuestionAttempt(currentQuestion.id, isCorrect);
    if (isCorrect) {
      if (qHist.status === 'mastered') {
        setMasteryBadge({ text: "Mastered (നന്നായി പഠിച്ചു)", color: "emerald", icon: Award });
      } else {
        setMasteryBadge({ text: "Correct (ശരിയായി)", color: "emerald", icon: CheckCircle2 });
      }
    } else {
      setMasteryBadge({ text: "Added to Mistakes Revision (തെറ്റിയവയിൽ ചേർത്തു)", color: "rose", icon: XCircle });
    }
  };

  // Commit Answer to Log and Move Next
  const commitAnswer = (chosenKey) => {
    const isCorrect = chosenKey === currentQuestion.answer;
    const record = {
      question: currentQuestion,
      selected: chosenKey,
      isCorrect,
      timeSpent: 30 - timeLeft
    };

    // If in practice mode, also save to LocalStorage if not already saved via Check
    if (isPracticeMode && !hasSubmittedPractice) {
      saveQuestionAttempt(currentQuestion.id, isCorrect);
    }

    const newLog = [...answersLog, record];
    setAnswersLog(newLog);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      onFinishExam(newLog);
    }
  };

  // Confirm Button Clicked
  const handleConfirm = () => {
    if (!selectedOption) return;
    playConfirmSound(soundEnabled);
    commitAnswer(selectedOption);
  };

  if (!currentQuestion) return null;

  const getTimerStyles = () => {
    if (timeLeft > 10) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700";
    if (timeLeft > 5) return "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700";
    return "bg-rose-100 text-rose-700 dark:bg-rose-950/90 dark:text-rose-300 border-rose-300 dark:border-rose-700 animate-warning-pulse font-bold";
  };

  const isPictureOption = currentQuestion.options.some(o => o.image !== null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn select-none">
      {/* Sarathi Top Bar: Candidate Info + Question Counter + Timer */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Candidate Info / Mode Title */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
            <User className="w-6 h-6 text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span>{customTitle || candidateInfo.name || "അപേക്ഷകൻ (Applicant)"}</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                KL-MVD
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              App No: {candidateInfo.appNo || "KL-01/2026/0014298"}
            </div>
          </div>
        </div>

        {/* Progress & Timer */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          {/* Question Index Badge */}
          <div className="text-right">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              ചോദ്യം (Question)
            </div>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              <span className="text-sky-600 dark:text-sky-400">{currentIndex + 1}</span>
              <span className="text-slate-400 text-sm"> / {questions.length}</span>
            </div>
          </div>

          {/* 30-Second Countdown Timer (Mock Mode) */}
          {!isPracticeMode && (
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all ${getTimerStyles()}`}>
              <Clock className="w-4 h-4 shrink-0" />
              <div className="text-right">
                <span className="text-base sm:text-lg font-black font-mono leading-none">
                  {timeLeft.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] font-semibold uppercase ml-1">Sec</span>
              </div>
            </div>
          )}

          {/* Practice Mode Tag */}
          {isPracticeMode && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
              പഠന മോഡ് (Study Mode)
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-gradient-to-r from-sky-500 to-indigo-600 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        {/* Question Header & Category */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-block bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono">
              #{currentQuestion.number || currentQuestion.id}
            </span>
            {currentQuestion.topic && (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md">
                {currentQuestion.topic}
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Question Sign Image (if any) */}
          {currentQuestion.question_image && (
            <div className="flex justify-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <img
                src={`/${currentQuestion.question_image}`}
                alt="Traffic Sign"
                className="max-h-48 max-w-full object-contain drop-shadow-md rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Options Grid */}
        <div className={`grid gap-3 ${isPictureOption ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedOption === opt.key;
            const isCorrectOption = opt.key === currentQuestion.answer;

            let stateStyle = "border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 bg-white dark:bg-slate-900";
            if (isSelected) {
              stateStyle = "border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 ring-2 ring-sky-500/20";
            }
            if (isPracticeMode && hasSubmittedPractice) {
              if (isCorrectOption) {
                stateStyle = "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 ring-2 ring-emerald-500/30";
              } else if (isSelected && !isCorrectOption) {
                stateStyle = "border-rose-500 bg-rose-50/80 dark:bg-rose-950/60 ring-2 ring-rose-500/30";
              }
            }

            return (
              <div
                key={opt.key}
                onClick={() => handleSelectOption(opt.key)}
                className={`cursor-pointer rounded-2xl p-4 border transition-all flex items-center justify-between gap-4 group ${stateStyle}`}
              >
                <div className="flex items-center gap-3.5 flex-1">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                    isSelected 
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-sky-100 dark:group-hover:bg-slate-700'
                  }`}>
                    {idx + 1}
                  </span>

                  {opt.image ? (
                    <div className="flex justify-center w-full py-2">
                      <img
                        src={`/${opt.image}`}
                        alt={`Option ${idx + 1}`}
                        className="max-h-28 object-contain drop-shadow"
                      />
                    </div>
                  ) : (
                    <span className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                      {opt.text}
                    </span>
                  )}
                </div>

                {isPracticeMode && hasSubmittedPractice && (
                  <div className="shrink-0">
                    {isCorrectOption ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                        <Check className="w-4 h-4" />
                      </div>
                    ) : isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow">
                        <X className="w-4 h-4" />
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Practice Mode Feedback Banner with Mastery Status */}
        {isPracticeMode && hasSubmittedPractice && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                ശരിയായ ഉത്തരം (Correct Answer):
              </span>
              {masteryBadge && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                  masteryBadge.color === 'emerald'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  <masteryBadge.icon className="w-3.5 h-3.5" />
                  <span>{masteryBadge.text}</span>
                </span>
              )}
            </div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {currentQuestion.answer_text || `Option ${currentQuestion.answer}`}
            </div>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
            ഷോർട്ട്കട്ടുകൾ: <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border text-[10px] font-mono">1-4</kbd> തിരഞ്ഞെടുക്കാൻ • <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border text-[10px] font-mono">Enter</kbd> ഉറപ്പിക്കാൻ
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* End Test / Exit Practice Button */}
            <button
              onClick={onEndTestRequest}
              className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isPracticeMode ? "പഠനം നിർത്തുക (Exit)" : "പരീക്ഷ അവസാനിപ്പിക്കുക (End Test)"}</span>
            </button>

            {/* Confirm or Next Button */}
            {isPracticeMode && !hasSubmittedPractice ? (
              <button
                onClick={handlePracticeCheck}
                disabled={!selectedOption}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>പരിശോധിക്കുക (Check)</span>
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={!selectedOption}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 disabled:hover:bg-sky-600 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-all flex items-center gap-2"
              >
                <span>അടുത്ത ചോദ്യം (Next)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

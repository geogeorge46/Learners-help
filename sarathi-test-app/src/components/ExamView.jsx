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
  const [lastAnswerResult, setLastAnswerResult] = useState(null); // feedback for previous question

  const currentQuestion = questions[currentIndex] || null;
  const timerRef = useRef(null);

  // Live score counters
  const correctCount = answersLog.filter(a => a.isCorrect).length;
  const wrongCount = answersLog.filter(a => !a.isCorrect && a.selected !== null).length;
  const timedOutCount = answersLog.filter(a => a.selected === null).length;

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
    const correctOptIndex = currentQuestion.options.findIndex(o => o.key === currentQuestion.answer) + 1;
    const correctOpt = currentQuestion.options.find(o => o.key === currentQuestion.answer);

    // Record last answer result for live feedback on screen
    const resultInfo = {
      number: currentQuestion.number || currentQuestion.id,
      isCorrect,
      isTimeout: chosenKey === null,
      chosenKey,
      correctKey: currentQuestion.answer,
      correctOptionIndex: correctOptIndex,
      correctText: correctOpt?.text || `ഓപ്ഷൻ ${correctOptIndex}`
    };
    setLastAnswerResult(resultInfo);

    const record = {
      question: currentQuestion,
      selected: chosenKey,
      isCorrect,
      timeSpent: 30 - timeLeft
    };

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
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 py-5 sm:py-6 space-y-5 animate-fadeIn select-none overflow-x-hidden">
      {/* Sarathi Top Bar: Candidate Info + Live Score Counter + Question Counter + Timer */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Candidate Info / Mode Title */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 truncate">
              <span>{customTitle || candidateInfo.name || "അപേക്ഷകൻ (Applicant)"}</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                KL-MVD
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
              App No: {candidateInfo.appNo || "KL-01/2026/0014298"}
            </div>
          </div>
        </div>

        {/* Live Counters, Progress & Timer */}
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end flex-wrap sm:flex-nowrap">
          {/* Live Correct Answers Counter (Requested Feature) */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/80 dark:text-emerald-400/80 leading-none">
                ശരി (Score)
              </div>
              <div className="text-base sm:text-lg font-black leading-none mt-0.5">
                <span>{correctCount}</span>
                <span className="text-xs text-emerald-600/60 dark:text-emerald-400/60 font-semibold"> / {currentIndex}</span>
              </div>
            </div>
          </div>

          {/* Question Index Badge */}
          <div className="text-right">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              ചോദ്യം (Question)
            </div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-none mt-0.5">
              <span className="text-sky-600 dark:text-sky-400">{currentIndex + 1}</span>
              <span className="text-slate-400 text-xs"> / {questions.length}</span>
            </div>
          </div>

          {/* 30-Second Countdown Timer (Mock Mode) */}
          {!isPracticeMode && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${getTimerStyles()}`}>
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
              പഠന മോഡ്
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

      {/* Previous Question Feedback Toast / Banner (Shows after moving to next question) */}
      {lastAnswerResult && (
        <div className={`p-3 px-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 animate-fadeIn ${
          lastAnswerResult.isCorrect
            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            {lastAnswerResult.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <div className="break-words">
              {lastAnswerResult.isCorrect ? (
                <span>
                  കഴിഞ്ഞ ചോദ്യം ശരിയാണ്! <strong className="text-emerald-700 dark:text-emerald-300">(+1 മാർക്ക് ലഭിച്ചു)</strong>
                </span>
              ) : lastAnswerResult.isTimeout ? (
                <span>
                  കഴിഞ്ഞ ചോദ്യത്തിന് സമയം കഴിഞ്ഞു. ശരിയായ ഉത്തരം: <strong>ഓപ്ഷൻ {lastAnswerResult.correctOptionIndex} ({lastAnswerResult.correctText})</strong>
                </span>
              ) : (
                <span>
                  കഴിഞ്ഞ ചോദ്യം തെറ്റി. ശരിയായ ഉത്തരം: <strong>ഓപ്ഷൻ {lastAnswerResult.correctOptionIndex} ({lastAnswerResult.correctText})</strong>
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0 text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:block">
            നിലവിലെ സ്കോർ: {correctCount} / {currentIndex}
          </div>
        </div>
      )}

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-5 sm:space-y-6">
        {/* Question Header & Category */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="inline-block bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono">
              #{currentQuestion.number || currentQuestion.id}
            </span>
            {currentQuestion.topic && (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md truncate max-w-[220px]">
                {currentQuestion.topic}
              </span>
            )}
          </div>

          <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed break-words">
            {currentQuestion.question}
          </h2>

          {/* Question Sign Image (if any) */}
          {currentQuestion.question_image && (
            <div className="flex justify-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <img
                src={`/${currentQuestion.question_image}`}
                alt="Traffic Sign"
                className="max-h-40 sm:max-h-48 max-w-full object-contain drop-shadow-md rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Options Grid */}
        <div className={`grid gap-2.5 sm:gap-3 ${isPictureOption ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
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
                className={`cursor-pointer rounded-2xl p-3.5 sm:p-4 border transition-all flex items-center justify-between gap-3 group min-w-0 ${stateStyle}`}
              >
                <div className="flex items-center gap-3 sm:gap-3.5 flex-1 min-w-0">
                  <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 transition-colors ${
                    isSelected 
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-sky-100 dark:group-hover:bg-slate-700'
                  }`}>
                    {idx + 1}
                  </span>

                  {opt.image ? (
                    <div className="flex justify-center w-full py-1">
                      <img
                        src={`/${opt.image}`}
                        alt={`Option ${idx + 1}`}
                        className="max-h-24 sm:max-h-28 object-contain drop-shadow"
                      />
                    </div>
                  ) : (
                    <span className="text-xs sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed break-words flex-1">
                      {opt.text}
                    </span>
                  )}
                </div>

                {isPracticeMode && hasSubmittedPractice && (
                  <div className="shrink-0">
                    {isCorrectOption ? (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : isSelected ? (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow">
                        <X className="w-3.5 h-3.5" />
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
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
            ഷോർട്ട്കട്ടുകൾ: <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border text-[10px] font-mono">1-4</kbd> തിരഞ്ഞെടുക്കാൻ • <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border text-[10px] font-mono">Enter</kbd> ഉറപ്പിക്കാൻ
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-end">
            {/* End Test / Exit Button */}
            <button
              onClick={onEndTestRequest}
              className="px-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isPracticeMode ? "പഠനം നിർത്തുക" : "അവസാനിപ്പിക്കുക"}</span>
            </button>

            {/* Confirm or Next Button */}
            {isPracticeMode && !hasSubmittedPractice ? (
              <button
                onClick={handlePracticeCheck}
                disabled={!selectedOption}
                className="px-5 sm:px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>പരിശോധിക്കുക (Check)</span>
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={!selectedOption}
                className="px-5 sm:px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 disabled:hover:bg-sky-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 transition-all flex items-center gap-2"
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

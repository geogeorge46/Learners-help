import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import ExamView from './components/ExamView';
import ResultView from './components/ResultView';
import PracticeMenu from './components/PracticeMenu';
import EndTestModal from './components/EndTestModal';
import { Loader2, AlertCircle } from 'lucide-react';

export default function App() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeView, setActiveView] = useState('home'); // 'home' | 'exam' | 'practice' | 'practice-menu' | 'result'
  const [candidateInfo, setCandidateInfo] = useState({
    name: 'അനിൽ കുമാർ (ANIL KUMAR)',
    appNo: 'KL-01/2026/0014298'
  });

  const [activeQuestions, setActiveQuestions] = useState([]);
  const [initialIndex, setInitialIndex] = useState(0);
  const [customTitle, setCustomTitle] = useState(null);
  const [answersLog, setAnswersLog] = useState([]);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);

  // Settings: Default to clean light mode everywhere unless saved explicitly
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sarathi_theme');
      if (saved) return saved === 'dark';
      return false; // Default to white theme across all phones and desktops
    }
    return false;
  });

  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync dark mode class to html element and save preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      try { localStorage.setItem('sarathi_theme', 'dark'); } catch (e) {}
    } else {
      document.documentElement.classList.remove('dark');
      try { localStorage.setItem('sarathi_theme', 'light'); } catch (e) {}
    }
  }, [darkMode]);

  // Load questions on initial mount
  useEffect(() => {
    fetch('/questions.json')
      .then((res) => {
        if (!res.ok) throw new Error('ചോദ്യശേഖരം ലഭ്യമാക്കാൻ കഴിഞ്ഞില്ല.');
        return res.json();
      })
      .then((data) => {
        setAllQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Shuffle & pick 30 random distinct questions for Mock Exam
  const startMockExam = () => {
    if (!allQuestions.length) return;
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected30 = shuffled.slice(0, 30);
    setActiveQuestions(selected30);
    setInitialIndex(0);
    setCustomTitle(null);
    setAnswersLog([]);
    setActiveView('exam');
  };

  // Start Practice Mode with selected topic
  const startPracticeMode = (topic) => {
    if (!allQuestions.length) return;
    let filtered = allQuestions;
    if (topic !== 'ALL') {
      filtered = allQuestions.filter(q => q.topic === topic);
    }
    setActiveQuestions(filtered);
    setInitialIndex(0);
    setCustomTitle(topic === 'ALL' ? 'സമ്പൂർണ്ണ ചോദ്യശേഖരം' : topic);
    setAnswersLog([]);
    setActiveView('practice');
  };

  // Start Custom Practice List (e.g. Mistakes or Continue where left off)
  const startCustomList = (list, startIndex = 0, title = null) => {
    setActiveQuestions(list);
    setInitialIndex(startIndex);
    setCustomTitle(title);
    setAnswersLog([]);
    setActiveView('practice');
  };

  // Handle Exam Completion
  const handleFinishExam = (finalLog) => {
    setAnswersLog(finalLog);
    setActiveView('result');
  };

  // Handle Early End Test Request
  const handleEndTestConfirm = () => {
    setIsEndModalOpen(false);
    if (activeView === 'practice') {
      setActiveView('practice-menu');
      return;
    }
    const currentCompleted = answersLog.length;
    const remaining = activeQuestions.slice(currentCompleted).map(q => ({
      question: q,
      selected: null,
      isCorrect: false,
      timeSpent: 0
    }));
    setAnswersLog([...answersLog, ...remaining]);
    setActiveView('result');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white p-4">
        <Loader2 className="w-10 h-10 animate-spin text-sky-600 mb-4" />
        <h2 className="text-lg font-bold">സാരഥി പരീക്ഷാ പോർട്ടൽ ലോഡ് ചെയ്യുന്നു...</h2>
        <p className="text-xs text-slate-500 mt-1">942 ചോദ്യങ്ങളും 310 ട്രാഫിക് ചിഹ്നങ്ങളും തയ്യാറാക്കുന്നു</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 max-w-md text-center space-y-3">
          <AlertCircle className="w-8 h-8 mx-auto text-rose-600" />
          <h2 className="text-lg font-bold">ഡാറ്റ ലോഡ് ചെയ്യുന്നതിൽ പിശക് സംഭവിച്ചു</h2>
          <p className="text-xs">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
          >
            വീണ്ടും ശ്രമിക്കുക (Reload)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        activeView={activeView}
        setActiveView={setActiveView}
        isExamInProgress={activeView === 'exam'}
        onEndTestConfirm={handleEndTestConfirm}
      />

      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {activeView === 'home' && (
          <HomeView
            candidateInfo={candidateInfo}
            setCandidateInfo={setCandidateInfo}
            onStartExam={startMockExam}
            onStartPractice={(topic) => {
              if (topic) startPracticeMode(topic);
              else setActiveView('practice-menu');
            }}
          />
        )}

        {activeView === 'practice-menu' && (
          <PracticeMenu
            allQuestions={allQuestions}
            onSelectTopic={(topic) => startPracticeMode(topic)}
            onStartCustomList={startCustomList}
          />
        )}

        {(activeView === 'exam' || activeView === 'practice') && (
          <ExamView
            questions={activeQuestions}
            candidateInfo={candidateInfo}
            isPracticeMode={activeView === 'practice'}
            initialIndex={initialIndex}
            customTitle={customTitle}
            soundEnabled={soundEnabled}
            onFinishExam={handleFinishExam}
            onEndTestRequest={() => {
              if (activeView === 'practice') {
                setActiveView('practice-menu');
              } else {
                setIsEndModalOpen(true);
              }
            }}
          />
        )}

        {activeView === 'result' && (
          <ResultView
            answersLog={answersLog}
            candidateInfo={candidateInfo}
            onRetakeExam={startMockExam}
            onBackToHome={() => setActiveView('home')}
            soundEnabled={soundEnabled}
          />
        )}
      </main>

      {/* Safety End Test Modal for Mock Exam */}
      <EndTestModal
        isOpen={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        onConfirm={handleEndTestConfirm}
      />

      {/* Official Parivahan Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-6 px-4 bg-white dark:bg-slate-900 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          കേരള മോട്ടോർ വാഹന വകുപ്പ് • ലേണേഴ്സ് ലൈസൻസ് പരീക്ഷാ പരിശീലന പോർട്ടൽ
        </p>
        <p className="text-[11px]">
          Kerala Motor Vehicles Department (MVD) • Sarathi Parivahan Simulation Prototype
        </p>
      </footer>
    </div>
  );
}

// LocalStorage Study Progress & Mastery Tracking Utility

const STORAGE_KEY = 'sarathi_study_progress_v1';

export function getStudyProgress() {
  if (typeof window === 'undefined') {
    return { history: {}, lastQuestionId: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { history: {}, lastQuestionId: null };
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load study progress:', e);
    return { history: {}, lastQuestionId: null };
  }
}

export function saveQuestionAttempt(questionId, isCorrect) {
  const current = getStudyProgress();
  const qHistory = current.history[questionId] || {
    attempts: 0,
    correctCount: 0,
    wrongCount: 0,
    lastResult: null,
    status: 'unattempted'
  };

  qHistory.attempts += 1;
  qHistory.lastAttempted = Date.now();
  qHistory.lastResult = isCorrect ? 'correct' : 'wrong';

  if (isCorrect) {
    qHistory.correctCount += 1;
    // Mastered if answered correctly at least 2 times and last attempt is correct
    if (qHistory.correctCount >= 2) {
      qHistory.status = 'mastered';
    } else {
      qHistory.status = 'learning';
    }
  } else {
    qHistory.wrongCount += 1;
    qHistory.correctCount = Math.max(0, qHistory.correctCount - 1);
    qHistory.status = 'mistake';
  }

  current.history[questionId] = qHistory;
  current.lastQuestionId = questionId;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save study progress:', e);
  }

  return qHistory;
}

export function calculateProgressStats(allQuestions = []) {
  const { history } = getStudyProgress();
  const total = allQuestions.length;

  let attempted = 0;
  let mastered = 0;
  let learning = 0;
  let mistakes = 0;

  allQuestions.forEach((q) => {
    const h = history[q.id];
    if (h && h.attempts > 0) {
      attempted += 1;
      if (h.status === 'mastered') mastered += 1;
      else if (h.status === 'mistake') mistakes += 1;
      else learning += 1;
    }
  });

  const unattempted = total - attempted;
  const percentCompleted = total > 0 ? Math.round((attempted / total) * 100) : 0;
  const percentMastered = total > 0 ? Math.round((mastered / total) * 100) : 0;

  return {
    total,
    attempted,
    mastered,
    learning,
    mistakes,
    unattempted,
    percentCompleted,
    percentMastered
  };
}

export function calculateTopicStats(questions = []) {
  const { history } = getStudyProgress();
  const total = questions.length;
  let attempted = 0;
  let mastered = 0;

  questions.forEach((q) => {
    const h = history[q.id];
    if (h && h.attempts > 0) {
      attempted += 1;
      if (h.status === 'mastered') mastered += 1;
    }
  });

  const percent = total > 0 ? Math.round((attempted / total) * 100) : 0;
  return { total, attempted, mastered, percent };
}

export function resetStudyProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to reset progress:', e);
  }
}

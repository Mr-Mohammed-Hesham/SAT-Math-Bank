import React, { useState, useEffect } from 'react';
import { QuestionItem } from '../types';
import { QuestionCard } from './QuestionCard';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';
import {
  X,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface PracticeQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuestionItem[];
  bookmarkedIds: Set<string>;
  onToggleBookmark: (id: string) => void;
}

export const PracticeQuizModal: React.FC<PracticeQuizModalProps> = ({
  isOpen,
  onClose,
  questions,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const { t, language, isRTL } = useLanguage();
  const [selectedModule, setSelectedModule] = useState<'all' | 1 | 2>(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(35 * 60); // 35 minutes per module standard
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const filteredQuestions = questions.filter((q) => {
    if (selectedModule === 'all') return true;
    return q.module === selectedModule;
  });

  const activeQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];

  // Timer effect
  useEffect(() => {
    if (!isOpen || isSubmitted || !isTimerRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isSubmitted, isTimerRunning]);

  // Reset when module changes
  useEffect(() => {
    setCurrentIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setTimeLeft(selectedModule === 'all' ? 70 * 60 : 35 * 60);
    setIsTimerRunning(true);
  }, [selectedModule, isOpen]);

  if (!isOpen) return null;

  const handleAnswer = (qId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: answer,
    }));
  };

  const handleFinishTest = () => {
    setIsSubmitted(true);
    setIsTimerRunning(false);
    // calculate score
    let correctCount = 0;
    filteredQuestions.forEach((q) => {
      const uAns = userAnswers[q.id];
      if (q.format === 'MCQ') {
        if (uAns === q.correctAnswer) correctCount++;
      } else {
        if (q.acceptableAnswers?.some((a) => a.trim().toLowerCase() === uAns?.trim().toLowerCase())) {
          correctCount++;
        }
      }
    });

    if (correctCount / filteredQuestions.length > 0.7) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const calculateScore = () => {
    let correct = 0;
    filteredQuestions.forEach((q) => {
      const uAns = userAnswers[q.id];
      if (!uAns) return;
      if (q.format === 'MCQ') {
        if (uAns === q.correctAnswer) correct++;
      } else {
        if (q.acceptableAnswers?.some((a) => a.trim().toLowerCase() === uAns?.trim().toLowerCase())) {
          correct++;
        }
      }
    });

    // Approximate scaled math score (200 - 800)
    const ratio = correct / (filteredQuestions.length || 1);
    const scaledScore = Math.round(200 + ratio * 600);

    return {
      correct,
      total: filteredQuestions.length,
      percentage: Math.round(ratio * 100),
      scaledScore,
    };
  };

  const scoreStats = calculateScore();

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-sm">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                {language === 'ar' ? 'محاكي اختبار DSAT Math الحقيقي' : 'DSAT Math Real Exam Simulator'}
                <span className="text-xs font-normal text-indigo-400">
                  (Dec 2024 US 2)
                </span>
              </h3>
            </div>
          </div>

          {/* Module Selector */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-xs">
            <button
              onClick={() => setSelectedModule(1)}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedModule === 1 ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Module 1 (22)
            </button>
            <button
              onClick={() => setSelectedModule(2)}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedModule === 2 ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Module 2 (22)
            </button>
            <button
              onClick={() => setSelectedModule('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedModule === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              {language === 'ar' ? 'الامتحان كاملاً (44)' : 'Full Exam (44)'}
            </button>
          </div>

          {/* Timer & Controls */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-amber-400" dir="ltr">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatTimer(timeLeft)}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Banner (if submitted) */}
        {isSubmitted && (
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-4 border-b border-indigo-500/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                {scoreStats.scaledScore}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  {language === 'ar' ? `النتيجة التقديرية للاختبار: ${scoreStats.scaledScore} / 800` : `Estimated Scaled Score: ${scoreStats.scaledScore} / 800`}
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h4>
                <p className="text-xs text-slate-300">
                  {language === 'ar'
                    ? `الإجابات الصحيحة: ${scoreStats.correct} من إجمالي ${scoreStats.total} سؤال (${scoreStats.percentage}%)`
                    : `Correct answers: ${scoreStats.correct} out of ${scoreStats.total} questions (${scoreStats.percentage}%)`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setUserAnswers({});
                  setIsSubmitted(false);
                  setTimeLeft(selectedModule === 'all' ? 70 * 60 : 35 * 60);
                  setIsTimerRunning(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {language === 'ar' ? 'إعادة المحاولة' : 'Retake Exam'}
              </button>
            </div>
          </div>
        )}

        {/* Body Layout: Question Left/Center + Navigator Right */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Main Question View */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {activeQuestion && (
              <QuestionCard
                question={activeQuestion}
                viewMode={isSubmitted ? 'study' : 'quiz'}
                isBookmarked={bookmarkedIds.has(activeQuestion.id)}
                onToggleBookmark={onToggleBookmark}
                userAnswer={userAnswers[activeQuestion.id]}
                onAnswer={handleAnswer}
                showQuizResults={isSubmitted}
              />
            )}

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 transition-colors"
              >
                <PrevIcon className="w-4 h-4" />
                {language === 'ar' ? 'السؤال السابق' : 'Previous Question'}
              </button>

              <span className="text-xs text-slate-400 font-medium font-mono" dir="ltr">
                Question {currentIndex + 1} of {filteredQuestions.length}
              </span>

              {currentIndex < filteredQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors"
                >
                  {language === 'ar' ? 'السؤال التالي' : 'Next Question'}
                  <NextIcon className="w-4 h-4" />
                </button>
              ) : (
                !isSubmitted && (
                  <button
                    onClick={handleFinishTest}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors shadow-lg shadow-emerald-600/30"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {language === 'ar' ? 'تسليم الاختبار وعرض النتيجة' : 'Submit & View Score'}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Quick Navigator Sidebar / Grid */}
          <div className="w-full md:w-64 bg-slate-950/70 border-t md:border-t-0 md:border-s border-slate-800 p-4 flex flex-col overflow-y-auto">
            <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center justify-between">
              <span>{language === 'ar' ? 'خريطة الأسئلة (Answer Grid)' : 'Answer Grid'}</span>
              <span className="text-[11px] text-slate-500 font-mono" dir="ltr">
                {Object.keys(userAnswers).length}/{filteredQuestions.length} {language === 'ar' ? 'تمت الإجابة' : 'answered'}
              </span>
            </h4>

            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-4 gap-2">
              {filteredQuestions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAns = Boolean(userAnswers[q.id]);
                const isCorrect =
                  q.format === 'MCQ'
                    ? userAnswers[q.id] === q.correctAnswer
                    : q.acceptableAnswers?.some(
                        (a) => a.trim().toLowerCase() === userAnswers[q.id]?.trim().toLowerCase()
                      );

                let btnColor = 'bg-slate-800/80 text-slate-400 border-slate-700';
                if (isSubmitted) {
                  if (isCorrect) {
                    btnColor = 'bg-emerald-600 text-white border-emerald-500';
                  } else if (isAns) {
                    btnColor = 'bg-rose-600 text-white border-rose-500';
                  } else {
                    btnColor = 'bg-slate-800 text-slate-500 border-slate-700';
                  }
                } else if (isAns) {
                  btnColor = 'bg-indigo-600 text-white border-indigo-500 font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg border text-xs font-mono transition-all flex items-center justify-center relative ${btnColor} ${
                      isCurrent ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900 scale-105' : ''
                    }`}
                  >
                    {q.questionNumber}
                    {bookmarkedIds.has(q.id) && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {!isSubmitted ? (
              <div className="mt-auto pt-4 space-y-3">
                <button
                  onClick={handleFinishTest}
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {language === 'ar' ? 'إنهاء وتصحيح الاختبار' : 'Finish & Grade Exam'}
                </button>
                <div className="text-center text-[10px] text-slate-500 font-mono">
                  Prepared by: Mr. Mohammed Hesham
                </div>
              </div>
            ) : (
              <div className="mt-auto pt-4 text-center text-[10px] text-slate-500 font-mono">
                Supervised by: Mr. Mohammed Hesham
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

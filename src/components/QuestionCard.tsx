import React, { useState } from 'react';
import { QuestionItem } from '../types';
import { QuestionVisual } from './QuestionVisual';
import { MathRenderer } from './MathRenderer';
import { useLanguage } from '../context/LanguageContext';
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  BookOpen,
  Copy,
  Check,
  Bookmark,
  Sparkles,
  Calculator,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface QuestionCardProps {
  question: QuestionItem;
  viewMode: 'study' | 'quiz' | 'print';
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  userAnswer?: string;
  onAnswer?: (questionId: string, answer: string) => void;
  showQuizResults?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  viewMode,
  isBookmarked,
  onToggleBookmark,
  userAnswer,
  onAnswer,
  showQuizResults = false,
}) => {
  const { t, language } = useLanguage();
  const [showSolution, setShowSolution] = useState(viewMode === 'study');
  const [copied, setCopied] = useState(false);
  const [customInput, setCustomInput] = useState(userAnswer || '');
  const [langView, setLangView] = useState<'both' | 'en' | 'ar'>('both');

  const isAnswered = Boolean(userAnswer);
  const isCorrect =
    question.format === 'MCQ'
      ? userAnswer === question.correctAnswer
      : question.acceptableAnswers?.some(
          (ans) => ans.trim().toLowerCase() === userAnswer?.trim().toLowerCase()
        );

  const handleCopy = () => {
    const text = `DSAT 2024 Math - Module ${question.module} - Q${question.questionNumber} (${question.category})\n\n${question.questionText}\n\n${
      question.options
        ? question.options.map((o) => `${o.label}) ${o.text}`).join('\n')
        : `Answer: ${question.correctAnswer}`
    }\n\nExplanation:\n${question.explanation.en}\n\nArabic Notes:\n${question.explanation.ar}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSprSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim() && onAnswer) {
      onAnswer(question.id, customInput.trim());
    }
  };

  const difficultyText =
    question.difficulty === 'Easy'
      ? t.qDifficultyEasy
      : question.difficulty === 'Medium'
      ? t.qDifficultyMedium
      : t.qDifficultyHard;

  return (
    <div
      id={`question-${question.id}`}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        showQuizResults
          ? isCorrect
            ? 'bg-emerald-950/20 border-emerald-500/40'
            : isAnswered
            ? 'bg-rose-950/20 border-rose-500/40'
            : 'bg-slate-900/60 border-slate-800'
          : isBookmarked
          ? 'bg-slate-900/90 border-amber-500/50 shadow-lg shadow-amber-500/5'
          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700/80'
      }`}
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 bg-slate-950/60 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 font-bold text-sm font-mono">
            {question.questionNumber}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {t.qModulePrefix} {question.module}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
                {language === 'ar' ? question.categoryAr : question.category}
              </span>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  question.difficulty === 'Easy'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                    : question.difficulty === 'Medium'
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
                    : 'bg-rose-950/80 text-rose-300 border border-rose-800/50'
                }`}
              >
                {difficultyText}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
              {language === 'ar' ? question.category : question.categoryAr}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Language Switch for this Question */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60 text-xs">
            <button
              onClick={() => setLangView('both')}
              className={`px-2 py-1 rounded-md transition-colors ${
                langView === 'both' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
              title={t.qLanguageViewBoth}
            >
              {language === 'ar' ? 'الكل' : 'Both'}
            </button>
            <button
              onClick={() => setLangView('en')}
              className={`px-2 py-1 rounded-md transition-colors ${
                langView === 'en' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
              title={t.qLanguageViewEn}
            >
              EN
            </button>
            <button
              onClick={() => setLangView('ar')}
              className={`px-2 py-1 rounded-md transition-colors ${
                langView === 'ar' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
              title={t.qLanguageViewAr}
            >
              عربي
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(question.id)}
            className={`p-2 rounded-lg transition-colors border ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={isBookmarked ? t.qBookmarkedBtn : t.qBookmarkBtn}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title={copied ? t.qCopySuccess : t.qCopyBtn}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Question Text in English */}
        {(langView === 'both' || langView === 'en') && (
          <div className="text-slate-100 font-medium leading-relaxed text-base" dir="ltr">
            <span className="text-indigo-400 font-bold mr-2">Q{question.questionNumber}.</span>
            {question.questionText}
          </div>
        )}

        {/* Question Text in Arabic */}
        {(langView === 'both' || langView === 'ar') && question.questionTextAr && (
          <div className="text-slate-300 text-sm leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
            <span className="text-indigo-400 font-bold ml-1.5">{language === 'ar' ? 'الترجمة العربية:' : 'Arabic Translation:'}</span>
            {question.questionTextAr}
          </div>
        )}

        {/* Equation if standalone */}
        {question.equation && (
          <div className="my-3 py-3 px-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-center" dir="ltr">
            <MathRenderer math={question.equation} inline={false} className="text-lg text-indigo-200 font-semibold" />
          </div>
        )}

        {/* Visual Graph / Diagram */}
        <QuestionVisual visual={question.visual} questionId={question.id} />

        {/* Options for MCQ */}
        {question.format === 'MCQ' && question.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2" dir="ltr">
            {question.options.map((opt) => {
              const isSelected = userAnswer === opt.label;
              const isOptionCorrect = opt.isCorrect || opt.label === question.correctAnswer;

              let optionStyle = 'bg-slate-950/50 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850';
              if (showQuizResults) {
                if (isOptionCorrect) {
                  optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                } else if (isSelected && !isOptionCorrect) {
                  optionStyle = 'bg-rose-950/60 border-rose-500 text-rose-200 line-through';
                }
              } else if (isSelected) {
                optionStyle = 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold';
              } else if (viewMode === 'study' && isOptionCorrect && showSolution) {
                optionStyle = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200';
              }

              return (
                <button
                  key={opt.label}
                  disabled={viewMode === 'print'}
                  onClick={() => onAnswer && onAnswer(question.id, opt.label)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${optionStyle}`}
                >
                  <span
                    className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                      showQuizResults && isOptionCorrect
                        ? 'bg-emerald-600 text-white'
                        : isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-sm font-mono flex-1">{opt.text}</span>
                  {showQuizResults && isOptionCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {showQuizResults && isSelected && !isOptionCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Student-Produced Response (SPR/Grid-in) Input */}
        {question.format === 'SPR' && (
          <div className="pt-2">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between gap-2 mb-2">
                <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-indigo-400" />
                  {language === 'ar' ? 'إجابة كتابية (Student-Produced Response / Grid-in):' : 'Student-Produced Response (Grid-in):'}
                </label>
                {viewMode === 'study' && showSolution && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800/60" dir="ltr">
                    Correct: {question.correctAnswer}
                  </span>
                )}
              </div>
              <form onSubmit={handleSprSubmit} className="flex gap-2" dir="ltr">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => {
                    setCustomInput(e.target.value);
                    if (onAnswer) onAnswer(question.id, e.target.value);
                  }}
                  placeholder={t.qSprInputPlaceholder}
                  className="flex-1 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-indigo-500"
                />
                {viewMode === 'quiz' && (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    {t.qSprSubmitBtn}
                  </button>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Action Toggle Solution Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 py-1.5 px-3 rounded-lg bg-indigo-950/40 hover:bg-indigo-950/70 border border-indigo-800/40 transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{showSolution ? t.qHideSolution : t.qShowSolution}</span>
            {showSolution ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">
              {language === 'ar' ? `الصفحة ${question.pageInPdf} من الامتحان الأصلي` : `Page ${question.pageInPdf} of original test`}
            </span>
          </div>
        </div>

        {/* Collapsible Solution Section */}
        {showSolution && (
          <div className="mt-3 space-y-3.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 animate-fadeIn">
            {/* Correct Answer Banner */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-300">{t.qCorrectAnswer}</span>
              </div>
              <span className="text-base font-mono font-black text-emerald-400 bg-emerald-950 px-3 py-0.5 rounded-md border border-emerald-600/50" dir="ltr">
                {question.correctAnswer}
              </span>
            </div>

            {/* Teacher Note Transcript */}
            {question.explanation.teacherNote && (
              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-amber-300 mb-0.5">
                    {language === 'ar' ? 'ملاحظة ومفتاح الحل السريع:' : 'Key Strategy & Teacher Note:'}
                  </h5>
                  <p className="text-xs text-amber-200/90 font-mono" dir="ltr">
                    {question.explanation.teacherNote}
                  </p>
                </div>
              </div>
            )}

            {/* Desmos Tip */}
            {question.explanation.desmosTip && (
              <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-2.5">
                <Calculator className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-cyan-300 mb-0.5">
                    {t.qDesmosTip}
                  </h5>
                  <p className="text-xs text-cyan-200/90">
                    {question.explanation.desmosTip}
                  </p>
                </div>
              </div>
            )}

            {/* Step-by-Step Arabic Steps */}
            {question.explanation.steps && (
              <div className="space-y-1.5">
                <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  {t.qSolutionSteps}
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300 pr-2">
                  {question.explanation.steps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <span className="font-sans">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* English Explanation */}
            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 leading-relaxed font-sans" dir="ltr">
              <strong className="text-slate-300">English Solution:</strong> {question.explanation.en}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

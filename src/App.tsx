import React, { useState, useMemo } from 'react';
import { allExams } from './data/examsData';
import { FilterState, QuestionCategory } from './types';
import { QuestionCard } from './components/QuestionCard';
import { DesmosSimulator } from './components/DesmosSimulator';
import { PracticeQuizModal } from './components/PracticeQuizModal';
import { DiagnosticSection } from './components/DiagnosticSection';
import { AppLogo } from './components/AppLogo';
import { useLanguage } from './context/LanguageContext';
import {
  BookOpen,
  Search,
  Filter,
  Award,
  Calculator,
  Bookmark,
  Layers,
  Sparkles,
  HelpCircle,
  GraduationCap,
  FileSpreadsheet,
  Globe,
} from 'lucide-react';

export default function App() {
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const [activeMainTab, setActiveMainTab] = useState<'diagnostic' | 'full-exams'>('diagnostic');
  const [selectedExamId, setSelectedExamId] = useState<string>('test-1-dec-2024');

  const [filterState, setFilterState] = useState<FilterState>({
    testId: 'test-1-dec-2024',
    module: 'all',
    category: 'all',
    format: 'all',
    searchQuery: '',
    bookmarkedOnly: false,
    viewMode: 'study',
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => new Set());
  const [isDesmosOpen, setIsDesmosOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Currently active exam object
  const currentExam = useMemo(() => {
    return allExams.find((e) => e.id === selectedExamId) || allExams[0];
  }, [selectedExamId]);

  // Questions source based on exam selection
  const activeExamQuestions = useMemo(() => {
    if (selectedExamId === 'all') {
      return allExams.flatMap((e) => e.questions);
    }
    return currentExam.questions;
  }, [selectedExamId, currentExam]);

  // Filtered list of questions
  const filteredQuestions = useMemo(() => {
    return activeExamQuestions.filter((q) => {
      // Module filter
      if (filterState.module !== 'all' && q.module !== filterState.module) return false;
      // Category filter
      if (filterState.category !== 'all' && q.category !== filterState.category) return false;
      // Format filter
      if (filterState.format !== 'all' && q.format !== filterState.format) return false;
      // Bookmarked filter
      if (filterState.bookmarkedOnly && !bookmarkedIds.has(q.id)) return false;
      // Search query filter
      if (filterState.searchQuery.trim()) {
        const query = filterState.searchQuery.toLowerCase().trim();
        const matchText = q.questionText.toLowerCase().includes(query);
        const matchTextAr = q.questionTextAr?.toLowerCase().includes(query);
        const matchCat = q.category.toLowerCase().includes(query) || q.categoryAr.toLowerCase().includes(query);
        const matchQNum = `q${q.questionNumber}`.includes(query) || `${q.questionNumber}` === query;
        const matchAns = q.correctAnswer.toLowerCase() === query;
        return matchText || matchTextAr || matchCat || matchQNum || matchAns;
      }
      return true;
    });
  }, [activeExamQuestions, filterState, bookmarkedIds]);

  const categories: { label: string; labelAr: string; value: QuestionCategory }[] = [
    { label: 'Algebra', labelAr: 'الجبر', value: 'Algebra' },
    { label: 'Advanced Math', labelAr: 'الرياضيات المتقدمة', value: 'Advanced Math' },
    { label: 'Problem-Solving & Data Analysis', labelAr: 'حل المشكلات والإحصاء', value: 'Problem-Solving and Data Analysis' },
    { label: 'Geometry & Trig', labelAr: 'الهندسة والمثلثات', value: 'Geometry and Trigonometry' },
  ];

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white ${isRTL ? "font-['Cairo',sans-serif]" : "font-['Plus_Jakarta_Sans',sans-serif]"}`}>
      {/* Top Banner Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AppLogo size={44} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {t.appTitle}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 text-[11px] font-semibold border border-emerald-700/60 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>{t.appBadge}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Quick Tool Actions, Section Switcher & Language Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Bilingual Switch Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-sm active:scale-95 group"
              title={language === 'ar' ? 'Switch to English' : 'التحويل إلى اللغة العربية'}
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-45 transition-transform" />
              <span>{t.btnLangToggle}</span>
            </button>

            {/* Primary Platform Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveMainTab('diagnostic')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeMainTab === 'diagnostic'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{t.tabDiagnostic}</span>
              </button>

              <button
                onClick={() => setActiveMainTab('full-exams')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeMainTab === 'full-exams'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{t.tabFullExams}</span>
              </button>
            </div>

            {/* Quiz Mode trigger */}
            <button
              onClick={() => setIsQuizOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-xs font-bold transition-all active:scale-95"
            >
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">{t.btnQuizMode}</span>
            </button>

            {/* Desmos trigger */}
            <button
              onClick={() => setIsDesmosOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 text-xs font-bold border border-emerald-700/60 transition-colors shadow-sm"
              title="Desmos Grapher & Calculator"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.btnDesmos}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Conditional Rendering based on activeMainTab */}
        {activeMainTab === 'diagnostic' ? (
          <DiagnosticSection onOpenDesmos={() => setIsDesmosOpen(true)} />
        ) : (
          <>
            {/* Multi-Exam Switcher Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/95 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-slate-300">{t.examsSelectTitle}</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {t.examsActiveLabel} <strong className="text-indigo-300">{language === 'ar' ? currentExam.titleAr : currentExam.title}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {allExams.map((exam, idx) => {
                  const isSelected = selectedExamId === exam.id;
                  return (
                    <button
                      key={exam.id}
                      onClick={() => {
                        setSelectedExamId(exam.id);
                        setFilterState((prev) => ({ ...prev, testId: exam.id, module: 'all' }));
                      }}
                      className={`p-3.5 rounded-xl border text-start transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-br from-indigo-950/80 to-slate-900 border-indigo-500 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500/50'
                          : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-white leading-snug">
                            {language === 'ar' ? exam.titleAr : exam.title}
                          </span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                          exam.difficulty === 'Advanced'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        }`}>
                          {exam.difficulty === 'Advanced' ? t.examDifficultyAdvanced : t.examDifficultyStandard}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {language === 'ar' ? exam.descriptionAr : exam.description}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-800/60">
                        <span>{exam.totalQuestions} {t.examTwoModules}</span>
                        <span className="text-indigo-400 font-semibold">{isSelected ? t.examSelectedBadge : t.examClickToView}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Metric Cards Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400">{t.examsTotalQuestions}</p>
                  <h3 className="text-2xl font-black text-white mt-1">{activeExamQuestions.length}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Layers className="w-5 h-5" />
                </div>
              </div>

              <div
                onClick={() => setFilterState((prev) => ({ ...prev, module: 1 }))}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  filterState.module === 1
                    ? 'bg-indigo-950/40 border-indigo-500'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">{t.examsModule1Title}</p>
                    <h3 className="text-2xl font-black text-indigo-400 mt-1">22</h3>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    Q1 - Q22
                  </span>
                </div>
              </div>

              <div
                onClick={() => setFilterState((prev) => ({ ...prev, module: 2 }))}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  filterState.module === 2
                    ? 'bg-indigo-950/40 border-indigo-500'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">{t.examsModule2Title}</p>
                    <h3 className="text-2xl font-black text-indigo-400 mt-1">22</h3>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    Q1 - Q22
                  </span>
                </div>
              </div>

              <div
                onClick={() => setFilterState((prev) => ({ ...prev, bookmarkedOnly: !prev.bookmarkedOnly }))}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  filterState.bookmarkedOnly
                    ? 'bg-amber-950/40 border-amber-500'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">{t.examsBookmarkedTitle}</p>
                    <h3 className="text-2xl font-black text-amber-400 mt-1">{bookmarkedIds.size}</h3>
                  </div>
                  <Bookmark className={`w-5 h-5 ${bookmarkedIds.size > 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
                </div>
              </div>
            </div>

            {/* Filter Controls & Search */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 pointer-events-none`} />
                  <input
                    type="text"
                    value={filterState.searchQuery}
                    onChange={(e) => setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }))}
                    placeholder={t.examsSearchPlaceholder}
                    className={`w-full ${isRTL ? 'pl-4 pr-10' : 'pr-4 pl-10'} py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors`}
                  />
                  {filterState.searchQuery && (
                    <button
                      onClick={() => setFilterState((prev) => ({ ...prev, searchQuery: '' }))}
                      className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200`}
                    >
                      {t.examsClearSearch}
                    </button>
                  )}
                </div>

                {/* Module Buttons */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setFilterState((prev) => ({ ...prev, module: 'all' }))}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                      filterState.module === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.examsAllModules}
                  </button>
                  <button
                    onClick={() => setFilterState((prev) => ({ ...prev, module: 1 }))}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                      filterState.module === 1 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.examsModule1Btn}
                  </button>
                  <button
                    onClick={() => setFilterState((prev) => ({ ...prev, module: 2 }))}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                      filterState.module === 2 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.examsModule2Btn}
                  </button>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5" />
                  {t.examsTopicLabel}
                </span>
                <button
                  onClick={() => setFilterState((prev) => ({ ...prev, category: 'all' }))}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    filterState.category === 'all'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {t.examsAllTopics} ({activeExamQuestions.length})
                </button>
                {categories.map((cat) => {
                  const count = activeExamQuestions.filter((q) => {
                    const matchMod = filterState.module === 'all' || q.module === filterState.module;
                    return matchMod && q.category === cat.value;
                  }).length;

                  return (
                    <button
                      key={cat.value}
                      onClick={() => setFilterState((prev) => ({ ...prev, category: cat.value }))}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        filterState.category === cat.value
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span>{language === 'ar' ? cat.labelAr : cat.label}</span>
                      <span className="text-[10px] text-slate-500 mx-1 font-mono">({count})</span>
                    </button>
                  );
                })}

                {/* Format Filter (MCQ vs SPR) */}
                <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} flex items-center gap-1.5`}>
                  <button
                    onClick={() => setFilterState((prev) => ({ ...prev, format: prev.format === 'MCQ' ? 'all' : 'MCQ' }))}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      filterState.format === 'MCQ'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {t.examsMcqBtn}
                  </button>
                  <button
                    onClick={() => setFilterState((prev) => ({ ...prev, format: prev.format === 'SPR' ? 'all' : 'SPR' }))}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      filterState.format === 'SPR'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {t.examsSprBtn}
                  </button>
                </div>
              </div>
            </div>

            {/* Results Counter & Actions */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <div>
                {t.examsShowingCount} <strong className="text-white">{filteredQuestions.length}</strong> {t.examsOfTotal} {activeExamQuestions.length} {t.examsQuestionsIn} {language === 'ar' ? currentExam.titleAr : currentExam.title}
                {filterState.bookmarkedOnly && t.examsBookmarkedOnlySuffix}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setFilterState({
                      testId: selectedExamId,
                      module: 'all',
                      category: 'all',
                      format: 'all',
                      searchQuery: '',
                      bookmarkedOnly: false,
                      viewMode: 'study',
                    });
                  }}
                  className="hover:text-indigo-400 underline underline-offset-4"
                >
                  {t.examsResetFilters}
                </button>
              </div>
            </div>

            {/* Questions List */}
            {filteredQuestions.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                <HelpCircle className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-300">{t.examsNoQuestionsFound}</h4>
                <p className="text-xs text-slate-400">{t.examsNoQuestionsDesc}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredQuestions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    viewMode="study"
                    isBookmarked={bookmarkedIds.has(q.id)}
                    onToggleBookmark={toggleBookmark}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Global Application Footer with Mr. Mohammed Hesham Signature & Transparent Logo */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/90 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
          <div className="flex items-center gap-3">
            <AppLogo size={40} />
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-slate-300">{t.footerDevTitle}</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300 font-extrabold text-base tracking-wide font-sans">
                  Mr. Mohammed Hesham
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {t.footerPlatformDesc}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-medium font-mono" dir="ltr">
              Prepared by: Mr. Mohammed Hesham
            </span>
            <span className="text-slate-500 font-mono" dir="ltr">
              &copy; {new Date().getFullYear()} {t.footerAllRightsReserved}
            </span>
          </div>
        </div>
      </footer>

      {/* Desmos Simulator & Grapher Modal */}
      <DesmosSimulator isOpen={isDesmosOpen} onClose={() => setIsDesmosOpen(false)} />

      {/* Timed Practice Quiz Modal */}
      <PracticeQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        questions={currentExam.questions}
        bookmarkedIds={bookmarkedIds}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  );
}

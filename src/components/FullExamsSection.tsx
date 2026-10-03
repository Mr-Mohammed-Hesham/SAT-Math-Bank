import React, { useState, useMemo } from 'react';
import { interactiveRevisionExams, InteractiveMockExam, questionBankExams } from '../data/fullExamsData';
import { TestExam, QuestionCategory, FilterState } from '../types';
import { QuestionCard } from './QuestionCard';
import { useLanguage } from '../context/LanguageContext';
import {
  FileSpreadsheet,
  Search,
  RotateCcw,
  Maximize2,
  Minimize2,
  Calculator,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  BookOpen,
  Filter,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  PlayCircle,
} from 'lucide-react';

interface FullExamsSectionProps {
  onOpenDesmos: () => void;
  onLaunchSimulator: (examQuestions?: any) => void;
}

export const FullExamsSection: React.FC<FullExamsSectionProps> = ({
  onOpenDesmos,
  onLaunchSimulator,
}) => {
  const { t, language, isRTL } = useLanguage();

  // Active embedded interactive exam
  const [activeInteractiveExam, setActiveInteractiveExam] = useState<InteractiveMockExam | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoadingIframe, setIsLoadingIframe] = useState<boolean>(true);

  // Active tab inside full exams: 'all' | 'interactive' | 'question-banks'
  const [examTypeFilter, setExamTypeFilter] = useState<'all' | 'interactive' | 'banks'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // For Question Bank sub-view
  const [selectedBankExamId, setSelectedBankExamId] = useState<string>(questionBankExams[0].id);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => new Set());
  const [activeBankTab, setActiveBankTab] = useState<boolean>(false); // false = catalog, true = exploring bank questions

  const [filterState, setFilterState] = useState<FilterState>({
    testId: questionBankExams[0].id,
    module: 'all',
    category: 'all',
    format: 'all',
    searchQuery: '',
    bookmarkedOnly: false,
    viewMode: 'study',
  });

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Currently selected question bank exam
  const currentBankExam = useMemo(() => {
    return questionBankExams.find((e) => e.id === selectedBankExamId) || questionBankExams[0];
  }, [selectedBankExamId]);

  // Filtered question bank questions
  const filteredBankQuestions = useMemo(() => {
    return currentBankExam.questions.filter((q) => {
      if (filterState.module !== 'all' && q.module !== filterState.module) return false;
      if (filterState.category !== 'all' && q.category !== filterState.category) return false;
      if (filterState.format !== 'all' && q.format !== filterState.format) return false;
      if (filterState.bookmarkedOnly && !bookmarkedIds.has(q.id)) return false;
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
  }, [currentBankExam, filterState, bookmarkedIds]);

  // Filtered interactive exams
  const filteredInteractive = useMemo(() => {
    if (examTypeFilter === 'banks') return [];
    return interactiveRevisionExams.filter((exam) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        exam.title.toLowerCase().includes(q) ||
        exam.titleAr.toLowerCase().includes(q) ||
        exam.code.toLowerCase().includes(q) ||
        exam.description.toLowerCase().includes(q) ||
        exam.descriptionAr.toLowerCase().includes(q) ||
        exam.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [examTypeFilter, searchQuery]);

  // Filtered question bank exams in catalog
  const filteredBanks = useMemo(() => {
    if (examTypeFilter === 'interactive') return [];
    return questionBankExams.filter((exam) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        exam.title.toLowerCase().includes(q) ||
        exam.titleAr.toLowerCase().includes(q) ||
        exam.description.toLowerCase().includes(q) ||
        exam.descriptionAr.toLowerCase().includes(q)
      );
    });
  }, [examTypeFilter, searchQuery]);

  const totalExamsCount = interactiveRevisionExams.length + questionBankExams.length;

  const handleStartInteractive = (exam: InteractiveMockExam) => {
    setActiveInteractiveExam(exam);
    setIsLoadingIframe(true);
    setIframeKey((prev) => prev + 1);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleCloseInteractive = () => {
    setActiveInteractiveExam(null);
    setIsFullscreen(false);
  };

  const handleReloadIframe = () => {
    setIsLoadingIframe(true);
    setIframeKey((prev) => prev + 1);
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const categories: { label: string; labelAr: string; value: QuestionCategory }[] = [
    { label: 'Algebra', labelAr: 'الجبر', value: 'Algebra' },
    { label: 'Advanced Math', labelAr: 'الرياضيات المتقدمة', value: 'Advanced Math' },
    { label: 'Problem-Solving & Data Analysis', labelAr: 'حل المشكلات والإحصاء', value: 'Problem-Solving and Data Analysis' },
    { label: 'Geometry & Trig', labelAr: 'الهندسة والمثلثات', value: 'Geometry and Trigonometry' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. ACTIVE EMBEDDED INTERACTIVE EXAM (OPENS IN-PAGE) */}
      {activeInteractiveExam ? (
        <div
          className={`rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            isFullscreen
              ? 'fixed inset-0 z-50 rounded-none border-0 h-screen'
              : 'min-h-[750px] h-[85vh]'
          }`}
        >
          {/* Top Control Navigation Bar */}
          <div className="px-4 sm:px-6 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCloseInteractive}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 active:scale-95"
              >
                <BackIcon className="w-4 h-4 text-emerald-400" />
                <span>{language === 'ar' ? 'العودة لقائمة النماذج' : 'Back to Mock Exams'}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 font-mono font-bold text-xs border border-emerald-700/60">
                  {activeInteractiveExam.code}
                </span>

                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>{language === 'ar' ? activeInteractiveExam.titleAr : activeInteractiveExam.title}</span>
                  </h2>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="text-emerald-400 font-medium">
                      {language === 'ar' ? activeInteractiveExam.subtitleAr : activeInteractiveExam.subtitle}
                    </span>
                    <span>&bull;</span>
                    <span className="text-sky-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activeInteractiveExam.durationMinutes} {language === 'ar' ? 'دقيقة (44 سؤالاً)' : 'mins (44 Qs)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Desmos, Reload, Fullscreen */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenDesmos}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 text-xs font-bold border border-emerald-700/60 transition-colors shadow-sm"
                title={t.diagDesmosHelperBtn}
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{t.btnDesmos}</span>
              </button>

              <button
                onClick={handleReloadIframe}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors border border-slate-700"
                title={t.diagReloadBtn}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsFullscreen((prev) => !prev)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors border border-slate-700"
                title={isFullscreen ? 'Exit Fullscreen' : t.diagFullscreenBtn}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Embedded Test Container - CRITICAL: NEVER SHOW LINK WHEN LOADING */}
          <div className="flex-1 relative bg-slate-950">
            {isLoadingIframe && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 z-20 gap-4 backdrop-blur-sm">
                <div className="relative flex items-center justify-center">
                  <div className="w-14 h-14 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                  <div className="absolute w-8 h-8 border-4 border-cyan-400/20 border-b-cyan-400 rounded-full animate-spin [animation-direction:reverse]"></div>
                </div>
                <div className="text-center space-y-1.5 px-4">
                  <p className="text-base font-bold text-white tracking-wide">
                    {language === 'ar' ? '(جار تحضير الإمتحان)' : '(Preparing Exam...)'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {language === 'ar' ? 'يرجى الانتظار ثوانٍ معدودة، يتم تجهيز نموذج المحاكاة الكامل...' : 'Please wait a moment, loading full simulation mock exam...'}
                  </p>
                </div>
              </div>
            )}

            <iframe
              key={iframeKey}
              src={activeInteractiveExam.url}
              title={`SAT Full Mock Exam - ${activeInteractiveExam.title}`}
              className="w-full h-full border-0 bg-white"
              allow="clipboard-write; clipboard-read; fullscreen"
              onLoad={() => setIsLoadingIframe(false)}
            />
          </div>

          {/* Bottom Bar Info */}
          <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'النموذج مفتوح ومباشر داخل المنصة' : 'Exam active in-page'}</span>
            </span>
            <span className="font-mono text-slate-400">
              Prepared by: Mr. Mohammed Hesham
            </span>
          </div>
        </div>
      ) : activeBankTab ? (
        /* 2. QUESTION BANK EXPLORER FOR THE 3 DETAILED EXAMS */
        <div className="space-y-6">
          {/* Top Return Banner */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveBankTab(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 active:scale-95"
              >
                <BackIcon className="w-4 h-4 text-indigo-400" />
                <span>{language === 'ar' ? 'العودة لجميع النماذج' : 'Back to Mock Catalog'}</span>
              </button>
              <div>
                <h3 className="text-base font-bold text-white">
                  {language === 'ar' ? currentBankExam.titleAr : currentBankExam.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'ar' ? currentBankExam.descriptionAr : currentBankExam.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => onLaunchSimulator(currentBankExam.questions)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-900/30 transition-all active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>{language === 'ar' ? 'بدء محاكاة هذا النموذج في التايمر' : 'Launch in Timed Simulator'}</span>
            </button>
          </div>

          {/* Exam Selector pills among the 3 bank exams */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {questionBankExams.map((exam, idx) => {
              const isSelected = selectedBankExamId === exam.id;
              return (
                <button
                  key={exam.id}
                  onClick={() => {
                    setSelectedBankExamId(exam.id);
                    setFilterState((prev) => ({ ...prev, testId: exam.id, module: 'all' }));
                  }}
                  className={`p-3.5 rounded-xl border text-start transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-indigo-950/90 to-slate-900 border-indigo-500 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500/50'
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
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-mono bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                      44 Qs
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-800/60">
                    <span>{exam.totalQuestions} {t.examTwoModules}</span>
                    <span className="text-indigo-400 font-semibold">{isSelected ? t.examSelectedBadge : t.examClickToView}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  value={filterState.searchQuery}
                  onChange={(e) => setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }))}
                  placeholder={t.examsSearchPlaceholder}
                  className={`w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors ${
                    isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'
                  }`}
                />
              </div>

              {/* Module Toggle */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs shrink-0">
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

            {/* Categories & Question Type */}
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
                {t.examsAllTopics} ({currentBankExam.questions.length})
              </button>
              {categories.map((cat) => {
                const count = currentBankExam.questions.filter((q) => {
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

          {/* Questions List */}
          <div className="space-y-6">
            {filteredBankQuestions.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                <HelpCircle className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-300">{t.examsNoQuestionsFound}</h4>
                <p className="text-xs text-slate-400">{t.examsNoQuestionsDesc}</p>
              </div>
            ) : (
              filteredBankQuestions.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  viewMode="study"
                  isBookmarked={bookmarkedIds.has(q.id)}
                  onToggleBookmark={toggleBookmark}
                />
              ))
            )}
          </div>
        </div>
      ) : (
        /* 3. FULL MOCK EXAMS CATALOG (17 FULL EXAMS) */
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/30 p-6 sm:p-8 shadow-2xl">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {language === 'ar' ? '17 نموذج اختبار كامل محاكي للسات الرقمي' : '17 Complete Digital SAT Mock Exams'}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {language === 'ar' ? 'نماذج الاختبارات الكاملة المحاكية' : 'Full Simulated Mock Exams'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {language === 'ar'
                    ? 'تدرب على 17 نموذجاً كاملاً (14 نموذج مراجعة تفاعلي يفتح داخل الصفحة + 3 نماذج امتحانات رسمية مع الحلول المفصلة وحيل ديسموس ومحاكي التايمر).'
                    : 'Practice with 17 complete exams (14 interactive in-page revision mock models + 3 official standard exams with detailed solutions, Desmos tricks, and timed simulator).'}
                </p>
              </div>

              {/* Metrics Highlights */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center min-w-[100px]">
                  <span className="block text-2xl font-black text-emerald-400">17</span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {language === 'ar' ? 'نموذج كامل' : 'Full Mocks'}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center min-w-[100px]">
                  <span className="block text-2xl font-black text-cyan-400">748+</span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {language === 'ar' ? 'سؤالاً للسات' : 'SAT Questions'}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center min-w-[100px]">
                  <span className="block text-2xl font-black text-amber-400">70</span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {language === 'ar' ? 'دقيقة لكل نموذج' : 'Mins per Mock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Type Filter Buttons */}
              <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs shrink-0">
                <button
                  onClick={() => setExamTypeFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                    examTypeFilter === 'all'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {language === 'ar' ? `جميع النماذج (${totalExamsCount})` : `All Exams (${totalExamsCount})`}
                </button>
                <button
                  onClick={() => setExamTypeFilter('interactive')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                    examTypeFilter === 'interactive'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {language === 'ar' ? `نماذج المراجعة التفاعلية (${interactiveRevisionExams.length})` : `Revision Mocks (${interactiveRevisionExams.length})`}
                </button>
                <button
                  onClick={() => setExamTypeFilter('banks')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                    examTypeFilter === 'banks'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {language === 'ar' ? `نماذج الشرح التفصيلي (${questionBankExams.length})` : `Question Banks (${questionBankExams.length})`}
                </button>
              </div>

              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ar' ? 'ابحث في النماذج الكاملة بالرقم (M4, M8...) أو الاسم...' : 'Search mock exams by code (M4, M8...) or name...'}
                  className={`w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors ${
                    isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 3.1. Interactive Revision Exams Grid (The 14 Mocks) */}
          {(examTypeFilter === 'all' || examTypeFilter === 'interactive') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-base font-bold text-white">
                    {language === 'ar'
                      ? 'نماذج المراجعة التفاعلية (14 نموذجاً - تفتح داخل الصفحة)'
                      : 'Interactive Revision Mocks (14 Models - In-Page)'}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {filteredInteractive.length} / {interactiveRevisionExams.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInteractive.map((exam) => (
                  <div
                    key={exam.id}
                    className="group rounded-2xl border border-slate-800/80 bg-slate-900/90 hover:border-emerald-500/60 transition-all duration-300 p-5 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-950/20 hover:-translate-y-0.5"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-950/90 text-emerald-300 font-mono font-bold text-xs border border-emerald-700/60">
                          {exam.code}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                            exam.difficulty === 'Advanced'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                              : exam.difficulty === 'Adaptive'
                              ? 'bg-purple-950 text-purple-300 border border-purple-800/60'
                              : 'bg-blue-950 text-blue-300 border border-blue-800/60'
                          }`}>
                            {language === 'ar' ? exam.difficultyAr : exam.difficulty}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                            {exam.durationMinutes}m
                          </span>
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                        {language === 'ar' ? exam.titleAr : exam.title}
                      </h4>
                      <p className="text-xs text-emerald-400/90 font-medium mt-0.5 mb-2 line-clamp-1">
                        {language === 'ar' ? exam.subtitleAr : exam.subtitle}
                      </p>

                      {/* Description */}
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {language === 'ar' ? exam.descriptionAr : exam.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {exam.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 text-[10px] border border-slate-800 font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom CTA Action Button - Opens in Page */}
                    <button
                      onClick={() => handleStartInteractive(exam)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition-all active:scale-95 group/btn"
                    >
                      <PlayCircle className="w-4 h-4 text-emerald-200 group-hover/btn:scale-110 transition-transform" />
                      <span>{language === 'ar' ? 'بدء نموذج الامتحان داخل الصفحة' : 'Start Exam In-Page'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3.2. Detailed Question Bank Exams (The 3 Official Standard Exams) */}
          {(examTypeFilter === 'all' || examTypeFilter === 'banks') && (
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  <h3 className="text-base font-bold text-white">
                    {language === 'ar'
                      ? 'نماذج الشرح التفصيلي وبنوك الأسئلة (3 نماذج - 132 سؤالاً مع الحلول وحيل ديسموس)'
                      : 'Detailed Question Bank Exams (3 Exams - 132 Questions with Desmos Steps)'}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {filteredBanks.length} / {questionBankExams.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredBanks.map((exam, idx) => (
                  <div
                    key={exam.id}
                    className="group rounded-2xl border border-slate-800/80 bg-slate-900/90 hover:border-indigo-500/60 transition-all duration-300 p-5 flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-950/20"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-950/90 text-indigo-300 font-mono font-bold text-xs border border-indigo-700/60">
                          Official #{idx + 1}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                          {exam.totalQuestions} Qs (2 Modules)
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                        {language === 'ar' ? exam.titleAr : exam.title}
                      </h4>

                      <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed mb-4">
                        {language === 'ar' ? exam.descriptionAr : exam.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setSelectedBankExamId(exam.id);
                          setFilterState((prev) => ({ ...prev, testId: exam.id, module: 'all' }));
                          setActiveBankTab(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all active:scale-95"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'عرض الأسئلة وشروحات ديسموس' : 'Browse Questions & Solutions'}</span>
                      </button>

                      <button
                        onClick={() => onLaunchSimulator(exam.questions)}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all active:scale-95"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{language === 'ar' ? 'اختبار مؤقت في المحاكي' : 'Timed Simulator Test'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { questionBankExams, InteractiveMockExam } from './data/fullExamsData';
import { HomeHub } from './components/HomeHub';
import { FullExamsSection } from './components/FullExamsSection';
import { DiagnosticSection } from './components/DiagnosticSection';
import { CalculatorWorkstation } from './components/CalculatorWorkstation';
import { SimulatorSection } from './components/SimulatorSection';
import { DesmosSimulator } from './components/DesmosSimulator';
import { PracticeQuizModal } from './components/PracticeQuizModal';
import { AppLogo } from './components/AppLogo';
import { useLanguage } from './context/LanguageContext';
import {
  FileSpreadsheet,
  GraduationCap,
  Calculator,
  Award,
  Globe,
  Sparkles,
  Home,
  CheckCircle2,
} from 'lucide-react';

export type MainTabType = 'home' | 'full-exams' | 'diagnostic' | 'calculator' | 'simulator';

export default function App() {
  const { t, language, toggleLanguage, isRTL } = useLanguage();

  // Primary active view
  const [activeTab, setActiveTab] = useState<MainTabType>('home');

  // Modals state
  const [isDesmosModalOpen, setIsDesmosModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState(questionBankExams[0].questions);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => new Set());

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleLaunchQuiz = (questionsToQuiz?: any[]) => {
    if (questionsToQuiz && questionsToQuiz.length > 0) {
      setQuizQuestions(questionsToQuiz);
    } else {
      setQuizQuestions(questionBankExams[0].questions);
    }
    setIsQuizModalOpen(true);
  };

  const handleLaunchInteractiveFromSimulator = (exam: InteractiveMockExam) => {
    setActiveTab('full-exams');
    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white ${
        isRTL ? "font-['Cairo',sans-serif]" : "font-['Plus_Jakarta_Sans',sans-serif]"
      }`}
    >
      {/* Top Banner Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/95 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Platform Title */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <AppLogo size={42} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                  {t.appTitle}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 text-[11px] font-semibold border border-emerald-700/60 flex items-center gap-1 font-mono">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>{t.appBadge}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Navigation Tabs Bar & Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Primary Navigation Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('home')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeTab === 'home'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={t.tabHome}
              >
                <Home className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">{t.tabHome}</span>
              </button>

              {/* 1. Full Mock Exams */}
              <button
                onClick={() => setActiveTab('full-exams')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeTab === 'full-exams'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{t.tabFullExams}</span>
              </button>

              {/* 2. Diagnostic Tests */}
              <button
                onClick={() => setActiveTab('diagnostic')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeTab === 'diagnostic'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{t.tabDiagnostic}</span>
              </button>

              {/* 3. Calculator */}
              <button
                onClick={() => setActiveTab('calculator')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeTab === 'calculator'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.tabCalculator}</span>
              </button>

              {/* 4. Exam Simulator */}
              <button
                onClick={() => setActiveTab('simulator')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeTab === 'simulator'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.tabSimulator}</span>
              </button>
            </div>

            {/* Quick Desmos Trigger Modal */}
            <button
              onClick={() => setIsDesmosModalOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-300 border border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5"
              title={t.btnDesmos}
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xl:inline">{t.btnDesmos}</span>
            </button>

            {/* Bilingual Switch Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-sm active:scale-95 group"
              title={language === 'ar' ? 'Switch to English' : 'التحويل إلى اللغة العربية'}
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-45 transition-transform" />
              <span>{t.btnLangToggle}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* HOMEPAGE: 4 Primary Portal Icons */}
        {activeTab === 'home' && (
          <HomeHub
            onSelectFeature={(feature) => {
              setActiveTab(feature);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 1. Full Mock Exams (17 Full Exams) */}
        {activeTab === 'full-exams' && (
          <FullExamsSection
            onOpenDesmos={() => setIsDesmosModalOpen(true)}
            onLaunchSimulator={(questions) => handleLaunchQuiz(questions)}
          />
        )}

        {/* 2. Diagnostic Tests per Lesson (25 Tests) */}
        {activeTab === 'diagnostic' && (
          <DiagnosticSection onOpenDesmos={() => setIsDesmosModalOpen(true)} />
        )}

        {/* 3. Calculator Workstation */}
        {activeTab === 'calculator' && (
          <CalculatorWorkstation onBackToHome={() => setActiveTab('home')} />
        )}

        {/* 4. Timed Exam Simulator */}
        {activeTab === 'simulator' && (
          <SimulatorSection
            onBackToHome={() => setActiveTab('home')}
            onLaunchPracticeQuiz={(questions) => handleLaunchQuiz(questions)}
            onLaunchInteractiveExam={handleLaunchInteractiveFromSimulator}
          />
        )}
      </main>

      {/* Global Application Footer with Mr. Mohammed Hesham Signature & Transparent Vector Logo */}
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
            <span
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-medium font-mono"
              dir="ltr"
            >
              Prepared by: Mr. Mohammed Hesham
            </span>
            <span className="text-slate-500 font-mono" dir="ltr">
              &copy; {new Date().getFullYear()} {t.footerAllRightsReserved}
            </span>
          </div>
        </div>
      </footer>

      {/* Desmos Quick Popup Simulator */}
      <DesmosSimulator isOpen={isDesmosModalOpen} onClose={() => setIsDesmosModalOpen(false)} />

      {/* Timed Practice Quiz Modal */}
      <PracticeQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        questions={quizQuestions}
        bookmarkedIds={bookmarkedIds}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  );
}

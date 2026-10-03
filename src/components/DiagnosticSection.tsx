import React, { useState, useMemo } from 'react';
import {
  allDiagnosticTests,
  diagnosticDomains,
  DiagnosticTest,
} from '../data/diagnosticTestsData';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  Play,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Calculator,
  Clock,
  Layers,
  GraduationCap,
} from 'lucide-react';

interface DiagnosticSectionProps {
  onOpenDesmos: () => void;
}

export const DiagnosticSection: React.FC<DiagnosticSectionProps> = ({ onOpenDesmos }) => {
  const { t, language, isRTL } = useLanguage();
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTest, setActiveTest] = useState<DiagnosticTest | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoadingIframe, setIsLoadingIframe] = useState<boolean>(true);

  // Filtered diagnostic tests
  const filteredTests = useMemo(() => {
    return allDiagnosticTests.filter((test) => {
      // Domain filter
      if (selectedDomain !== 'all' && test.domainId !== selectedDomain) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = test.code.toLowerCase().includes(q) || test.repoId.toLowerCase().includes(q);
        const matchTitle = test.title.toLowerCase().includes(q) || test.titleAr.toLowerCase().includes(q);
        const matchDesc = test.descriptionAr.toLowerCase().includes(q) || test.description.toLowerCase().includes(q);
        const matchTopic = test.topics.some((t) => t.toLowerCase().includes(q));
        return matchCode || matchTitle || matchDesc || matchTopic;
      }
      return true;
    });
  }, [selectedDomain, searchQuery]);

  const handleStartTest = (test: DiagnosticTest) => {
    setActiveTest(test);
    setIsLoadingIframe(true);
    setIframeKey((prev) => prev + 1);
    // Scroll smoothly to top of active test area
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleReloadIframe = () => {
    setIsLoadingIframe(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleCloseActiveTest = () => {
    setActiveTest(null);
    setIsFullscreen(false);
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-6">
      {/* If an active test is chosen, show embedded in-page test runner */}
      {activeTest ? (
        <div
          className={`rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            isFullscreen
              ? 'fixed inset-0 z-50 rounded-none border-0 h-screen'
              : 'min-h-[750px] h-[85vh]'
          }`}
        >
          {/* Top Control Navigation Bar for Active Test */}
          <div className="px-4 sm:px-6 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCloseActiveTest}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 active:scale-95"
              >
                <BackIcon className="w-4 h-4 text-indigo-400" />
                <span>{t.diagBackBtn}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 font-mono font-bold text-xs border border-indigo-700/60">
                  {t.diagUnitPrefix} {activeTest.code}
                </span>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>{language === 'ar' ? activeTest.titleAr : activeTest.title}</span>
                    <span className="text-xs font-normal text-slate-400 hidden md:inline">
                      ({language === 'ar' ? activeTest.title : activeTest.titleAr})
                    </span>
                  </h2>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="text-indigo-400 font-medium">
                      {language === 'ar' ? activeTest.domainNameAr : activeTest.domainName}
                    </span>
                    <span>&bull;</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activeTest.estimatedTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Right Actions */}
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

          {/* Embedded Test Iframe Container */}
          <div className="flex-1 relative bg-slate-950">
            {isLoadingIframe && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 z-20 gap-4 backdrop-blur-sm">
                <div className="relative flex items-center justify-center">
                  <div className="w-14 h-14 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  <div className="absolute w-8 h-8 border-4 border-cyan-400/20 border-b-cyan-400 rounded-full animate-spin [animation-direction:reverse]"></div>
                </div>
                <div className="text-center space-y-1.5 px-4">
                  <p className="text-base font-bold text-white tracking-wide">
                    {language === 'ar' ? '(جار تحضير الإمتحان)' : '(Preparing Exam...)'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {language === 'ar' ? 'يرجى الانتظار لحظات، يتم تجهيز بيئة الاختبار التفاعلية...' : 'Please wait a moment, loading interactive testing environment...'}
                  </p>
                </div>
              </div>
            )}

            <iframe
              key={iframeKey}
              src={activeTest.url}
              title={`SAT Diagnostic Test - ${activeTest.title}`}
              className="w-full h-full border-0 bg-white"
              allow="clipboard-write; clipboard-read; fullscreen"
              onLoad={() => setIsLoadingIframe(false)}
            />
          </div>

          {/* Embedded Footer */}
          <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>
                {t.diagEmbeddedNotice} &bull; {t.diagAuthorCredit}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-500 hidden sm:inline" dir="ltr">
                {activeTest.repoId}
              </span>
              <button
                onClick={handleCloseActiveTest}
                className="text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                {t.diagExitTest}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Diagnostic Tests Directory & Domain Grid */
        <>
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-700/60 text-indigo-300 text-xs font-bold flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{t.diagBadge}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[11px] font-semibold border border-emerald-700/50">
                      {t.diagInPageBadge}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {t.diagTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1">
                    {t.diagSubtitle}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[110px]">
                    <div className="text-2xl font-black text-indigo-400 font-mono">25</div>
                    <div className="text-[11px] text-slate-400">{t.diagTestsCountLabel}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[110px]">
                    <div className="text-2xl font-black text-emerald-400 font-mono">4</div>
                    <div className="text-[11px] text-slate-400">{t.diagDomainsCountLabel}</div>
                  </div>
                </div>
              </div>

              {/* 4 Domain Shortcut Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {diagnosticDomains.map((domain) => {
                  const isSelected = selectedDomain === domain.id;
                  return (
                    <button
                      key={domain.id}
                      onClick={() => setSelectedDomain(domain.id)}
                      className={`p-3.5 rounded-2xl border text-start transition-all flex flex-col justify-between gap-2.5 ${
                        isSelected
                          ? `${domain.bgColor} ${domain.borderColor} ring-2 ring-indigo-500/50 shadow-lg`
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-xs font-bold font-mono ${domain.color}`}>
                          {domain.code}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 text-[10px] font-bold border border-slate-800">
                          {domain.testsCount} {language === 'ar' ? 'اختبارات' : 'Tests'}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-100">
                          {language === 'ar' ? domain.nameAr : domain.name}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                          {language === 'ar' ? domain.descriptionAr : domain.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Search & Domain Filter Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Domain Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              <button
                onClick={() => setSelectedDomain('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedDomain === 'all'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {t.diagAllDomains}
              </button>
              {diagnosticDomains.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDomain(d.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedDomain === d.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>{language === 'ar' ? d.nameAr.split(' ')[0] : d.name.split(' ')[0]}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-300">
                    {d.testsCount}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.diagSearchPlaceholder}
                className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 placeholder:text-slate-500`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute ${isRTL ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs`}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Diagnostic Tests Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-5 flex flex-col justify-between gap-4 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-950/20 group"
              >
                <div className="space-y-3">
                  {/* Top Header of Card */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-indigo-950 text-indigo-300 font-mono font-bold text-xs border border-indigo-700/60 shadow-sm">
                        {t.diagUnitPrefix} {test.code}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {language === 'ar' ? test.domainNameAr : test.domainName}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800" dir="ltr">
                      {test.repoId}
                    </span>
                  </div>

                  {/* Titles */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {language === 'ar' ? test.titleAr : test.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans mt-0.5" dir="ltr">
                      {language === 'ar' ? test.title : test.titleAr}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {language === 'ar' ? test.descriptionAr : test.description}
                  </p>

                  {/* Key Topic Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {test.topics.map((topic, tidx) => (
                      <span
                        key={tidx}
                        className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 text-[10px] font-medium border border-slate-800/80"
                        dir="ltr"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{test.estimatedTime}</span>
                  </div>

                  <button
                    onClick={() => handleStartTest(test)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 active:scale-95 group-hover:shadow-indigo-600/40"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{t.diagOpenTestBtn}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTests.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <Layers className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">{t.diagNoTestsFound}</p>
              <p className="text-xs text-slate-500">{t.diagNoTestsDesc}</p>
              <button
                onClick={() => {
                  setSelectedDomain('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                {t.diagResetFilters}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};


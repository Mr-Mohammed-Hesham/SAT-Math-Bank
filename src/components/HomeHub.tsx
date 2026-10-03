import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  FileSpreadsheet,
  GraduationCap,
  Calculator,
  Award,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Zap,
  TrendingUp,
  Cpu,
} from 'lucide-react';

interface HomeHubProps {
  onSelectFeature: (feature: 'full-exams' | 'diagnostic' | 'calculator' | 'simulator') => void;
}

export const HomeHub: React.FC<HomeHubProps> = ({ onSelectFeature }) => {
  const { t, language, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-8 py-2">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-900/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-1/4 -mt-16 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-16 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-200 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>
              {language === 'ar'
                ? 'المنصة المتكاملة لاجتياز اختبار Digital SAT Math بأعلى الدرجات'
                : 'Complete High-Score Training Platform for Digital SAT Math'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {language === 'ar' ? (
              <>
                بنك الأسئلة في <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300">Digital SAT Math</span>
              </>
            ) : (
              <>
                Question Bank for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300">Digital SAT Math</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {language === 'ar'
              ? 'اختر من البوابات التفاعلية أدناه: نماذج محاكاة كاملة، اختبارات تشخيصية لكل درس تفتح داخل الصفحة، حاسبة ديسموس المعتمدة، ومحاكي الامتحان بالزمن الفعلي.'
              : 'Choose from the 4 primary portals below: full practice mock exams, in-page lesson diagnostic tests, Desmos graphing calculator, and the real-time exam simulator.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {language === 'ar' ? '17 نموذجاً كاملاً' : '17 Full Mocks'}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              {language === 'ar' ? '25 اختباراً تشخيصياً' : '25 Diagnostics'}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              {language === 'ar' ? 'حاسبة Desmos المتكاملة' : 'Desmos Calculator'}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
              {language === 'ar' ? 'محاكي مؤقت' : 'Timed Simulator'}
            </span>
          </div>
        </div>
      </div>

      {/* THE 4 PRIMARY MAIN PORTAL ICONS / CARDS REQUESTED BY USER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* 1. نماذج اختبارات كاملة محاكية */}
        <div
          onClick={() => onSelectFeature('full-exams')}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/30 p-6 sm:p-8 transition-all duration-300 hover:border-emerald-500/80 hover:shadow-2xl hover:shadow-emerald-950/30 hover:-translate-y-1 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

          <div>
            {/* Top Icon & Badge Header */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <FileSpreadsheet className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                </div>
              </div>

              <div className="text-end">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-xs font-bold font-mono">
                  {language === 'ar' ? '17 نموذجاً محاكياً' : '17 Mock Exams'}
                </span>
                <span className="block text-[11px] text-slate-400 mt-1 font-mono">
                  14 Revision + 3 Official
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-300 transition-colors">
              {language === 'ar' ? 'نماذج اختبارات كاملة محاكية' : 'Full Simulated Mock Exams'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
              {language === 'ar'
                ? 'امتحانات كاملة تحاكي تجربة اختبار السات الحقيقي بدقة: 14 نموذج مراجعة تفاعلي يفتح داخل الصفحة (M4 إلى M11.1) وثلاثة امتحانات رسمية كاملة مع تفاصيل الحلول والخطوات وحيل ديسموس.'
                : 'Complete full-length 44-question exams simulating real testing conditions: 14 interactive in-page revision mocks (M4 through M11.1) plus 3 official detailed question-bank exams with Desmos tricks.'}
            </p>

            {/* Mini Feature Highlights */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-emerald-400 text-xs border border-emerald-900/40 font-medium flex items-center gap-1.5">
                <Zap className="w-3 h-3" />
                {language === 'ar' ? 'تفتح داخل الصفحة مباشرة' : 'In-Page Interactive'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-slate-300 text-xs border border-slate-800 font-medium">
                {language === 'ar' ? 'زمن 70 دقيقة للنموذج' : '70 Mins Standard'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-slate-300 text-xs border border-slate-800 font-medium">
                {language === 'ar' ? 'Hard Module 2 Focus' : 'Hard Module 2 Focus'}
              </span>
            </div>
          </div>

          {/* Action Footer Button */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-2">
              <span>{language === 'ar' ? 'استعراض وبدء النماذج الكاملة' : 'Explore & Launch Full Mocks'}</span>
              <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Prepared by: Mr. Mohammed Hesham
            </span>
          </div>
        </div>

        {/* 2. الاختبارات التشخيصية الموجودة على كل درس */}
        <div
          onClick={() => onSelectFeature('diagnostic')}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/30 p-6 sm:p-8 transition-all duration-300 hover:border-indigo-500/80 hover:shadow-2xl hover:shadow-indigo-950/30 hover:-translate-y-1 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />

          <div>
            {/* Top Icon & Badge Header */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 p-0.5 shadow-lg shadow-indigo-900/30 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                </div>
              </div>

              <div className="text-end">
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700/60 text-xs font-bold font-mono">
                  {language === 'ar' ? '25 اختباراً تشخيصياً' : '25 Diagnostic Tests'}
                </span>
                <span className="block text-[11px] text-slate-400 mt-1 font-mono">
                  4 Core Domains (1.1 - 4.6)
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-indigo-300 transition-colors">
              {language === 'ar' ? 'الاختبارات التشخيصية لكل درس' : 'Diagnostic Tests Per Lesson'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
              {language === 'ar'
                ? 'اختبارات تشخيصية مركزة ومفصلة على كل معيار ووحدة دراسية (الجبر الخطي، الرياضيات المتقدمة، تحليل البيانات، والهندسة وحساب المثلثات) تفتح مباشرة داخل المنصة لمعرفة مستواك فورياً.'
                : 'Targeted in-page diagnostic tests covering every standard & lesson across Algebra, Advanced Math, Problem-Solving & Data Analysis, and Geometry/Trig to pinpoint strengths and weaknesses.'}
            </p>

            {/* Mini Feature Highlights */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-indigo-400 text-xs border border-indigo-900/40 font-medium flex items-center gap-1.5">
                <Layers className="w-3 h-3" />
                {language === 'ar' ? '4 أقسام رئيسية معتمدة' : '4 Official Domains'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-slate-300 text-xs border border-slate-800 font-medium">
                {language === 'ar' ? 'تحميل مباشر بدون نوافذ خارجية' : 'Embedded In-Page'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-slate-300 text-xs border border-slate-800 font-medium">
                {language === 'ar' ? 'زمن 20-30 دقيقة' : '20-30 Mins'}
              </span>
            </div>
          </div>

          {/* Action Footer Button */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-2">
              <span>{language === 'ar' ? 'فتح بنك الاختبارات التشخيصية' : 'Open Lesson Diagnostics'}</span>
              <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Prepared by: Mr. Mohammed Hesham
            </span>
          </div>
        </div>

        {/* 3. الحاسبة */}
        <div
          onClick={() => onSelectFeature('calculator')}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/30 p-6 sm:p-8 transition-all duration-300 hover:border-amber-500/80 hover:shadow-2xl hover:shadow-amber-950/30 hover:-translate-y-1 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

          <div>
            {/* Top Icon & Badge Header */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-lg shadow-amber-900/30 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Calculator className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 group-hover:text-amber-300 transition-colors" />
                </div>
              </div>

              <div className="text-end">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-700/60 text-xs font-bold font-mono">
                  {language === 'ar' ? 'ديسموس المعتمدة' : 'Official Desmos'}
                </span>
                <span className="block text-[11px] text-slate-400 mt-1 font-mono">
                  Graphing & Scientific
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300 transition-colors">
              {language === 'ar' ? 'الآلة الحاسبة ورسام Desmos' : 'Desmos Graphing Calculator'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
              {language === 'ar'
                ? 'الحاسبة الرسومية والعلمية المعتمدة رسمياً في امتحان Digital SAT مع أدوات رسم المنحنيات، إيجاد نقاط التقاطع، حل المعادلات التربيعية، والجداول البيانية.'
                : 'The official graphing & scientific calculator tool tailored for the Digital SAT with multi-curve plotting, intersection finding, regression, and fast calculation.'}
            </p>

            {/* Mini Feature Highlights */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-amber-400 text-xs border border-amber-900/40 font-medium flex items-center gap-1.5">
                <Cpu className="w-3 h-3" />
                {language === 'ar' ? 'رسم تفاعلي للمنحنيات' : 'Interactive Plotting'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-slate-300 text-xs border border-slate-800 font-medium">
                {language === 'ar' ? 'أسرار الحل السريع للسات' : 'Speed Shortcuts'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-slate-300 text-xs border border-slate-800 font-medium">
                {language === 'ar' ? 'لوحة علمية متطورة' : 'Scientific Engine'}
              </span>
            </div>
          </div>

          {/* Action Footer Button */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-2">
              <span>{language === 'ar' ? 'فتح الآلة الحاسبة ورسام المنحنيات' : 'Launch Desmos Calculator'}</span>
              <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Prepared by: Mr. Mohammed Hesham
            </span>
          </div>
        </div>

        {/* 4. محاكي الاختبار */}
        <div
          onClick={() => onSelectFeature('simulator')}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-rose-950/30 p-6 sm:p-8 transition-all duration-300 hover:border-rose-500/80 hover:shadow-2xl hover:shadow-rose-950/30 hover:-translate-y-1 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all pointer-events-none" />

          <div>
            {/* Top Icon & Badge Header */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 p-0.5 shadow-lg shadow-rose-900/30 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Award className="w-7 h-7 sm:w-8 sm:h-8 text-rose-400 group-hover:text-rose-300 transition-colors" />
                </div>
              </div>

              <div className="text-end">
                <span className="inline-block px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-700/60 text-xs font-bold font-mono">
                  {language === 'ar' ? 'محاكاة حقيقية مؤقتة' : 'Timed Simulator'}
                </span>
                <span className="block text-[11px] text-slate-400 mt-1 font-mono">
                  Module 1 & 2 Adaptive
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-rose-300 transition-colors">
              {language === 'ar' ? 'محاكي الامتحان المؤقت' : 'Real-Time Exam Simulator'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
              {language === 'ar'
                ? 'عش أجواء الامتحان الحقيقي لـ Digital SAT مع عداد تنازلي دقيق (35 دقيقة لكل موديول)، إمكانية تحديد الأسئلة للمراجعة (Flag)، شبكة الإجابات، والتقييم الفوري للنتيجة.'
                : 'Experience authentic Digital SAT test day conditions: timed 35-minute modules, question flagging for review, instant score breakdown, and step-by-step post-test analysis.'}
            </p>

            {/* Mini Feature Highlights */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-rose-400 text-xs border border-rose-900/40 font-medium flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {language === 'ar' ? 'تايمر 35 دقيقة لكل قسم' : '35-Min Module Timer'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-slate-300 text-xs border border-slate-800 font-medium">
                {language === 'ar' ? 'تقييم فوري وتحديد للمراجعة' : 'Instant Score & Flagging'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-slate-300 text-xs border border-slate-800 font-medium">
                {language === 'ar' ? 'مراجعة تفصيلية للإجابات' : 'Complete Review Mode'}
              </span>
            </div>
          </div>

          {/* Action Footer Button */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 group-hover:text-rose-300 flex items-center gap-2">
              <span>{language === 'ar' ? 'دخول محاكي الامتحان' : 'Launch Exam Simulator'}</span>
              <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Prepared by: Mr. Mohammed Hesham
            </span>
          </div>
        </div>
      </div>

      {/* Quick Summary Strip */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>
            {language === 'ar'
              ? 'جميع الاختبارات تفتح مباشرة داخل المنصة دون الخروج لصفحات جديدة.'
              : 'All tests open directly in-page without navigating to external windows.'}
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-500">Curator:</span>
          <span className="text-slate-200 font-bold">Mr. Mohammed Hesham</span>
        </div>
      </div>
    </div>
  );
};

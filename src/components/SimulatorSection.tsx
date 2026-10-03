import React, { useState } from 'react';
import { questionBankExams, interactiveRevisionExams, InteractiveMockExam } from '../data/fullExamsData';
import { TestExam } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Award,
  Clock,
  PlayCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Layers,
  Zap,
  ShieldAlert,
} from 'lucide-react';

interface SimulatorSectionProps {
  onBackToHome: () => void;
  onLaunchPracticeQuiz: (examQuestions: any[]) => void;
  onLaunchInteractiveExam: (exam: InteractiveMockExam) => void;
}

export const SimulatorSection: React.FC<SimulatorSectionProps> = ({
  onBackToHome,
  onLaunchPracticeQuiz,
  onLaunchInteractiveExam,
}) => {
  const { language, isRTL } = useLanguage();
  const [selectedExamId, setSelectedExamId] = useState<string>(questionBankExams[0].id);

  const selectedBankExam = questionBankExams.find((e) => e.id === selectedExamId) || questionBankExams[0];

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 active:scale-95"
          >
            <BackIcon className="w-4 h-4 text-rose-400" />
            <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                {language === 'ar' ? 'محاكي الامتحان المؤقت (Digital SAT Simulator)' : 'Digital SAT Timed Exam Simulator'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 text-[10px] font-bold border border-rose-700/60 font-mono">
                Official Timing (35m / 70m)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'ar'
                ? 'محاكاة بيئة اختبار السات الحقيقي تحت ضغط الوقت، إمكانية مراجعة الأسئلة وتحديد الصعب وحساب السكور فورياً'
                : 'Experience real test-day pressure with module timers, review flags, and instant score analysis'}
            </p>
          </div>
        </div>
      </div>

      {/* Simulator Launch Control Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Test Selector for Timed Simulator */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-400" />
                <span>
                  {language === 'ar'
                    ? 'اختر النموذج لاختباره في محاكي التايمر وشبكة الإجابات:'
                    : 'Select Exam to launch in the Timed Simulator:'}
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {questionBankExams.map((exam, idx) => {
                const isSelected = selectedExamId === exam.id;
                return (
                  <button
                    key={exam.id}
                    onClick={() => setSelectedExamId(exam.id)}
                    className={`p-4 rounded-xl border text-start transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-br from-rose-950/80 to-slate-900 border-rose-500 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          Model #{idx + 1}
                        </span>
                        <span className="text-[10px] text-rose-300 font-mono">44 Qs</span>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                        {language === 'ar' ? exam.titleAr : exam.title}
                      </h4>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Module 1 & 2</span>
                      <span className="text-rose-400 font-bold">{isSelected ? '✓ محدد' : 'اختيار'}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Launch Button for Selected Test */}
            <div className="pt-2">
              <button
                onClick={() => onLaunchPracticeQuiz(selectedBankExam.questions)}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-rose-950/50 flex items-center justify-center gap-2 transition-all active:scale-95 group"
              >
                <PlayCircle className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <span>
                  {language === 'ar'
                    ? `بدء محاكاة ${selectedBankExam.titleAr} بالتايمر الآن`
                    : `Start Timed Simulator for ${selectedBankExam.title}`}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Access to the 14 Interactive Revision Exams */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>
                {language === 'ar'
                  ? 'أو اختر أحد نماذج المراجعة التفاعلية الـ 14 (تفتح داخل الصفحة):'
                  : 'Or choose from the 14 Interactive Revision Mocks (In-Page):'}
              </span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {interactiveRevisionExams.map((mock) => (
                <button
                  key={mock.id}
                  onClick={() => onLaunchInteractiveExam(mock)}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/60 text-start transition-all text-xs group"
                >
                  <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono font-bold">
                    <span>{mock.code}</span>
                    <span>70m</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-200 group-hover:text-emerald-300 transition-colors truncate mt-1">
                    {language === 'ar' ? mock.titleAr : mock.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Simulator Features & Tips */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-rose-950/30 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'مزايا محاكي السات المؤقت' : 'Simulator Capabilities'}</span>
            </h3>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>تايمر دقيق:</strong> 35 دقيقة لكل موديول (22 سؤالاً) يحاكي زمن اختبار السات الحقيقي.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>تحديد للمراجعة (Flag):</strong> تمييز الأسئلة الصعبة أو المشكوك فيها للعودة إليها قبل التسليم.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>شبكة الأسئلة التفاعلية:</strong> رؤية الأسئلة المجابة والمتروكة والمحددة بلون مميز.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>تقييم وحلول مفصلة:</strong> استعراض الإجابات الصحيحة وشروحات ديسموس بعد إنهاء الامتحان.
                </span>
              </li>
            </ul>

            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>نصيحة: لا تترك أي سؤال فارغاً في السات لعدم وجود خصم على الإجابات الخاطئة.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

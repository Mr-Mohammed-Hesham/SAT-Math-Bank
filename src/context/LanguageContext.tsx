import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ar' | 'en';

export interface Translations {
  // Global & Header
  appTitle: string;
  appSubtitle: string;
  appBadge: string;
  tabDiagnostic: string;
  tabFullExams: string;
  btnQuizMode: string;
  btnDesmos: string;
  btnLangToggle: string;
  activeLanguageName: string;

  // Diagnostic Section
  diagBadge: string;
  diagInPageBadge: string;
  diagTitle: string;
  diagSubtitle: string;
  diagTestsCountLabel: string;
  diagDomainsCountLabel: string;
  diagAllDomains: string;
  diagSearchPlaceholder: string;
  diagClearSearch: string;
  diagNoTestsFound: string;
  diagNoTestsDesc: string;
  diagResetFilters: string;
  diagOpenTestBtn: string;
  diagUnitPrefix: string;
  diagEstimatedTime: string;
  diagBackBtn: string;
  diagDesmosHelperBtn: string;
  diagReloadBtn: string;
  diagFullscreenBtn: string;
  diagLoadingTest: string;
  diagEmbeddedNotice: string;
  diagAuthorCredit: string;
  diagExitTest: string;

  // Full Exams Section
  examsSelectTitle: string;
  examsActiveLabel: string;
  examsTotalQuestions: string;
  examsModule1Title: string;
  examsModule2Title: string;
  examsBookmarkedTitle: string;
  examsSearchPlaceholder: string;
  examsClearSearch: string;
  examsAllModules: string;
  examsModule1Btn: string;
  examsModule2Btn: string;
  examsTopicLabel: string;
  examsAllTopics: string;
  examsMcqBtn: string;
  examsSprBtn: string;
  examsShowingCount: string;
  examsOfTotal: string;
  examsQuestionsIn: string;
  examsBookmarkedOnlySuffix: string;
  examsResetFilters: string;
  examsNoQuestionsFound: string;
  examsNoQuestionsDesc: string;
  examDifficultyAdvanced: string;
  examDifficultyStandard: string;
  examSelectedBadge: string;
  examClickToView: string;
  examTwoModules: string;

  // Question Card
  qModulePrefix: string;
  qQuestionPrefix: string;
  qDifficultyEasy: string;
  qDifficultyMedium: string;
  qDifficultyHard: string;
  qShowSolution: string;
  qHideSolution: string;
  qCorrectAnswer: string;
  qSolutionSteps: string;
  qDesmosTip: string;
  qCopySuccess: string;
  qCopyBtn: string;
  qBookmarkBtn: string;
  qBookmarkedBtn: string;
  qLanguageViewBoth: string;
  qLanguageViewEn: string;
  qLanguageViewAr: string;
  qSprInputPlaceholder: string;
  qSprSubmitBtn: string;
  qYourAnswer: string;
  qCorrectStatus: string;
  qIncorrectStatus: string;

  // Quiz Modal
  quizModalTitle: string;
  quizTimeRemaining: string;
  quizSubmitExam: string;
  quizQuestionOf: string;
  quizNext: string;
  quizPrev: string;
  quizFlagForReview: string;
  quizFlagged: string;
  quizFinishConfirm: string;
  quizScoreSummary: string;
  quizScoreOutOf: string;
  quizRestart: string;
  quizClose: string;
  quizReviewMode: string;

  // Desmos Modal
  desmosModalTitle: string;
  desmosModalDesc: string;
  desmosOpenExternal: string;
  desmosClose: string;

  // Footer
  footerDevTitle: string;
  footerAuthorName: string;
  footerPlatformDesc: string;
  footerPreparedBy: string;
  footerAllRightsReserved: string;
}

export const translations: Record<Language, Translations> = {
  ar: {
    // Global & Header
    appTitle: 'منصة بنوك واختبارات Digital SAT Math',
    appSubtitle: 'اختبارات تشخيصية بالمعايير تفتح داخل الصفحة، نماذج محاكاة رسمية، وحيل Desmos',
    appBadge: '25 اختباراً تشخيصياً + 3 نماذج كاملة',
    tabDiagnostic: 'الاختبارات التشخيصية (25)',
    tabFullExams: 'النماذج الكاملة (3)',
    btnQuizMode: 'محاكي الامتحان',
    btnDesmos: 'حاسبة Desmos',
    btnLangToggle: 'English',
    activeLanguageName: 'العربية',

    // Diagnostic Section
    diagBadge: 'بنك الاختبارات التشخيصية حسب المعايير (25 اختباراً)',
    diagInPageBadge: 'تفتح داخل الصفحة مباشرة',
    diagTitle: 'الاختبارات التشخيصية المركّزة لكل موضوع ووحدة في Digital SAT Math',
    diagSubtitle: 'اختبر مستواك بدقة في كل معيار على حدة، حدد نقاط ضعفك وقوتك، وتدرب على كافة أفكار الجبر والرياضيات المتقدمة والإحصاء والهندسة وحساب المثلثات.',
    diagTestsCountLabel: 'اختباراً تشخيصياً',
    diagDomainsCountLabel: 'أقسام ومحاور رئيسية',
    diagAllDomains: 'جميع الأقسام (25)',
    diagSearchPlaceholder: 'ابحث بالرقم (مثل 2.7) أو اسم الموضوع...',
    diagClearSearch: 'مسح',
    diagNoTestsFound: 'لا توجد اختبارات تشخيصية مطابقة للبحث',
    diagNoTestsDesc: 'جرب تغيير كلمات البحث أو اختيار قسم مختلف.',
    diagResetFilters: 'إعادة ضبط الفلاتر',
    diagOpenTestBtn: 'فتح الاختبار داخل الصفحة',
    diagUnitPrefix: 'Unit',
    diagEstimatedTime: 'المدة المقدرة:',
    diagBackBtn: 'العودة للاختبارات التشخيصية',
    diagDesmosHelperBtn: 'حاسبة Desmos المساعدة',
    diagReloadBtn: 'إعادة التحميل',
    diagFullscreenBtn: 'ملء الشاشة داخل الصفحة',
    diagLoadingTest: 'جاري تحميل الاختبار التشخيصي التفاعلي...',
    diagEmbeddedNotice: 'الاختبار مفتوح مباشرة داخل المنصة',
    diagAuthorCredit: 'إعداد وتطوير: Mr. Mohammed Hesham',
    diagExitTest: 'إنهاء والعودة',

    // Full Exams Section
    examsSelectTitle: 'اختر نموذج الاختبار للتدريب والدراسة:',
    examsActiveLabel: 'الاختبار النشط:',
    examsTotalQuestions: 'أسئلة الاختبار الحالي',
    examsModule1Title: 'Module 1 (القسم الأول)',
    examsModule2Title: 'Module 2 (القسم الثاني)',
    examsBookmarkedTitle: 'الأسئلة المحفوظة',
    examsSearchPlaceholder: 'ابحث في أسئلة هذا الاختبار (مثال: parabola, circle, triangle, bacteria)...',
    examsClearSearch: 'مسح',
    examsAllModules: 'جميع الأقسام (44)',
    examsModule1Btn: 'Module 1 (22)',
    examsModule2Btn: 'Module 2 (22)',
    examsTopicLabel: 'الموضوع:',
    examsAllTopics: 'الكل',
    examsMcqBtn: 'اختيار من متعدد (MCQ)',
    examsSprBtn: 'كتابة رقمية (Grid-in)',
    examsShowingCount: 'عرض',
    examsOfTotal: 'من أصل',
    examsQuestionsIn: 'سؤالاً في',
    examsBookmarkedOnlySuffix: ' (المحفوظة فقط)',
    examsResetFilters: 'إعادة ضبط الفلاتر',
    examsNoQuestionsFound: 'لم يتم العثور على أسئلة مطابقة',
    examsNoQuestionsDesc: 'جرب تعديل كلمات البحث أو الفلاتر المحددة',
    examDifficultyAdvanced: 'متقدم 700+',
    examDifficultyStandard: 'قياسي',
    examSelectedBadge: '✓ تم التحديد',
    examClickToView: 'انقر للعرض',
    examTwoModules: 'سؤالاً (قسمان)',

    // Question Card
    qModulePrefix: 'Module',
    qQuestionPrefix: 'سؤال',
    qDifficultyEasy: 'سهل',
    qDifficultyMedium: 'متوسط',
    qDifficultyHard: 'متقدم',
    qShowSolution: 'إظهار الحل النموذجي والخطوات',
    qHideSolution: 'إخفاء الحل',
    qCorrectAnswer: 'الإجابة الصحيحة:',
    qSolutionSteps: 'خطوات الحل المفصلة:',
    qDesmosTip: 'طريقة الحل السريع عبر حاسبة Desmos:',
    qCopySuccess: 'تم النسخ!',
    qCopyBtn: 'نسخ السؤال',
    qBookmarkBtn: 'حفظ السؤال',
    qBookmarkedBtn: 'محفوظ',
    qLanguageViewBoth: 'الكل (ثنائي اللغة)',
    qLanguageViewEn: 'English Only',
    qLanguageViewAr: 'عربي فقط',
    qSprInputPlaceholder: 'أدخل إجابتك الرقمية هنا...',
    qSprSubmitBtn: 'تأكيد الإجابة',
    qYourAnswer: 'إجابتك:',
    qCorrectStatus: 'إجابة صحيحة ✓',
    qIncorrectStatus: 'إجابة خاطئة ✗',

    // Quiz Modal
    quizModalTitle: 'محاكي الامتحان المؤقت (Digital SAT Simulator)',
    quizTimeRemaining: 'الوقت المتبقي:',
    quizSubmitExam: 'تسليم الاختبار',
    quizQuestionOf: 'سؤال',
    quizNext: 'التالي',
    quizPrev: 'السابق',
    quizFlagForReview: 'تحديد للمراجعة',
    quizFlagged: 'تم التحديد',
    quizFinishConfirm: 'هل أنت متأكد من تسليم الاختبار ورؤية النتيجة؟',
    quizScoreSummary: 'ملخص النتيجة والأداء',
    quizScoreOutOf: 'من أصل',
    quizRestart: 'إعادة الاختبار',
    quizClose: 'إغلاق',
    quizReviewMode: 'مراجعة الإجابات والحلول',

    // Desmos Modal
    desmosModalTitle: 'حاسبة ورسام Desmos الرسومي المتطور',
    desmosModalDesc: 'أداة حاسبة الرسوم البيانية المعتمدة في Digital SAT مع أهم الدوال والمعادلات السريعة.',
    desmosOpenExternal: 'فتح في نافذة مستقلة',
    desmosClose: 'إغلاق الحاسبة',

    // Footer
    footerDevTitle: 'إعداد وتطوير المحتوى:',
    footerAuthorName: 'Mr. Mohammed Hesham',
    footerPlatformDesc: 'منصة التدريب التفاعلية الشاملة لاختبارات Digital SAT Math',
    footerPreparedBy: 'Prepared by: Mr. Mohammed Hesham',
    footerAllRightsReserved: 'جميع الحقوق محفوظة',
  },
  en: {
    // Global & Header
    appTitle: '4U - Digital SAT Math Practice & Diagnostics Platform',
    appSubtitle: 'Standardized in-page diagnostic tests, official mock exams, step-by-step solutions & Desmos shortcuts',
    appBadge: '25 Diagnostic Tests + 3 Full Exams (132 Questions)',
    tabDiagnostic: 'Diagnostic Tests (25)',
    tabFullExams: 'Full Practice Exams (3)',
    btnQuizMode: 'Exam Simulator',
    btnDesmos: 'Desmos Calculator',
    btnLangToggle: 'العربية',
    activeLanguageName: 'English',

    // Diagnostic Section
    diagBadge: 'Standard-Aligned Diagnostic Test Bank (25 Tests)',
    diagInPageBadge: 'Opens Directly In-Page',
    diagTitle: 'Targeted Diagnostic Tests for Every Digital SAT Math Domain',
    diagSubtitle: 'Accurately assess your level on each standard, pinpoint weaknesses & strengths, and master algebra, advanced math, data analysis, and trigonometry.',
    diagTestsCountLabel: 'Diagnostic Tests',
    diagDomainsCountLabel: 'Core Math Domains',
    diagAllDomains: 'All Domains (25)',
    diagSearchPlaceholder: 'Search by unit (e.g. 2.7) or topic name...',
    diagClearSearch: 'Clear',
    diagNoTestsFound: 'No diagnostic tests matching your search',
    diagNoTestsDesc: 'Try adjusting your search terms or selecting another domain.',
    diagResetFilters: 'Reset Filters',
    diagOpenTestBtn: 'Open In-Page Test',
    diagUnitPrefix: 'Unit',
    diagEstimatedTime: 'Est. Time:',
    diagBackBtn: 'Back to Diagnostic Directory',
    diagDesmosHelperBtn: 'Desmos Helper Calculator',
    diagReloadBtn: 'Reload',
    diagFullscreenBtn: 'In-Page Fullscreen',
    diagLoadingTest: 'Loading interactive diagnostic test...',
    diagEmbeddedNotice: 'Test embedded directly inside the platform',
    diagAuthorCredit: 'Prepared & Developed by: Mr. Mohammed Hesham',
    diagExitTest: 'Finish & Exit',

    // Full Exams Section
    examsSelectTitle: 'Select Practice Exam for Study & Training:',
    examsActiveLabel: 'Active Exam:',
    examsTotalQuestions: 'Current Exam Questions',
    examsModule1Title: 'Module 1 (First Section)',
    examsModule2Title: 'Module 2 (Second Section)',
    examsBookmarkedTitle: 'Bookmarked Questions',
    examsSearchPlaceholder: 'Search questions in this exam (e.g., parabola, circle, triangle, bacteria)...',
    examsClearSearch: 'Clear',
    examsAllModules: 'All Modules (44)',
    examsModule1Btn: 'Module 1 (22)',
    examsModule2Btn: 'Module 2 (22)',
    examsTopicLabel: 'Topic:',
    examsAllTopics: 'All',
    examsMcqBtn: 'Multiple Choice (MCQ)',
    examsSprBtn: 'Grid-in (SPR)',
    examsShowingCount: 'Showing',
    examsOfTotal: 'of',
    examsQuestionsIn: 'questions in',
    examsBookmarkedOnlySuffix: ' (Bookmarked Only)',
    examsResetFilters: 'Reset Filters',
    examsNoQuestionsFound: 'No matching questions found',
    examsNoQuestionsDesc: 'Try modifying your search query or selected filters.',
    examDifficultyAdvanced: 'Advanced 700+',
    examDifficultyStandard: 'Standard',
    examSelectedBadge: '✓ Selected',
    examClickToView: 'Click to view',
    examTwoModules: 'questions (2 modules)',

    // Question Card
    qModulePrefix: 'Module',
    qQuestionPrefix: 'Question',
    qDifficultyEasy: 'Easy',
    qDifficultyMedium: 'Medium',
    qDifficultyHard: 'Hard',
    qShowSolution: 'Show Step-by-Step Solution',
    qHideSolution: 'Hide Solution',
    qCorrectAnswer: 'Correct Answer:',
    qSolutionSteps: 'Detailed Solution Steps:',
    qDesmosTip: 'Fast Desmos Grapher Strategy:',
    qCopySuccess: 'Copied!',
    qCopyBtn: 'Copy Question',
    qBookmarkBtn: 'Bookmark',
    qBookmarkedBtn: 'Saved',
    qLanguageViewBoth: 'Bilingual (Both)',
    qLanguageViewEn: 'English Only',
    qLanguageViewAr: 'Arabic Only',
    qSprInputPlaceholder: 'Enter your numeric answer...',
    qSprSubmitBtn: 'Submit Answer',
    qYourAnswer: 'Your Answer:',
    qCorrectStatus: 'Correct Answer ✓',
    qIncorrectStatus: 'Incorrect Answer ✗',

    // Quiz Modal
    quizModalTitle: 'Timed Digital SAT Exam Simulator',
    quizTimeRemaining: 'Time Remaining:',
    quizSubmitExam: 'Submit Exam',
    quizQuestionOf: 'Question',
    quizNext: 'Next',
    quizPrev: 'Previous',
    quizFlagForReview: 'Flag for Review',
    quizFlagged: 'Flagged',
    quizFinishConfirm: 'Are you sure you want to submit your exam and view results?',
    quizScoreSummary: 'Score & Performance Summary',
    quizScoreOutOf: 'out of',
    quizRestart: 'Retake Exam',
    quizClose: 'Close',
    quizReviewMode: 'Review Questions & Explanations',

    // Desmos Modal
    desmosModalTitle: 'Desmos Advanced Graphing Calculator',
    desmosModalDesc: 'The official digital graphing calculator used in the Digital SAT with fast function grapher.',
    desmosOpenExternal: 'Open in New Window',
    desmosClose: 'Close Calculator',

    // Footer
    footerDevTitle: 'Content Development & Authoring:',
    footerAuthorName: 'Mr. Mohammed Hesham',
    footerPlatformDesc: 'Comprehensive Interactive Training Platform for Digital SAT Math',
    footerPreparedBy: 'Prepared by: Mr. Mohammed Hesham',
    footerAllRightsReserved: 'All Rights Reserved',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('dsat_lang') as Language;
    return saved === 'en' || saved === 'ar' ? saved : 'ar';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('dsat_lang', lang);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(nextLang);
  };

  useEffect(() => {
    // Update HTML dir and lang tags
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    if (language === 'ar') {
      document.body.classList.remove('font-sans');
      document.body.classList.add("font-['Cairo',sans-serif]");
    } else {
      document.body.classList.remove("font-['Cairo',sans-serif]");
      document.body.classList.add('font-sans');
    }
  }, [language]);

  const isRTL = language === 'ar';
  const t = translations[language];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isRTL,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

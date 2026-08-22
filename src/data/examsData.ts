import { TestExam } from '../types';
import { questionsData as test1Questions } from './questionsData';
import { test2Questions } from './test2Data';
import { test3Questions } from './test3Data';

export const allExams: TestExam[] = [
  {
    id: 'test-1-dec-2024',
    title: 'Digital SAT Math Official - Dec 2024 (US 2)',
    titleAr: 'اختبار ديجيتال سات الرسمي - ديسمبر 2024 (النموذج الثاني)',
    description: 'Complete 44 questions from the December 2024 US Digital SAT Math section (Modules 1 & 2) with detailed steps and Desmos shortcuts.',
    descriptionAr: 'الاختبار الكامل المكون من 44 سؤالاً لامتحان ديسمبر 2024 الرسمي (الوحدتان الأولى والثانية) مع شروحات وخطوات وحيل ديسموس.',
    date: 'December 2024',
    totalQuestions: 44,
    modules: 2,
    difficulty: 'Balanced',
    questions: test1Questions,
  },
  {
    id: 'test-2-standard-2025',
    title: 'Digital SAT Math Practice Exam 2 - Standard 2025',
    titleAr: 'اختبار ديجيتال سات التجريبي 2 - النمط القياسي 2025',
    description: 'Full 44 questions covering linear systems, quadratic functions, circle equations, exponential growth, and trigonometry.',
    descriptionAr: 'اختبار كامل 44 سؤالاً يحاكي النمط الحقيقي للسات: أنظمة المعادلات، الدوال التربيعية، الدوائر، النمو الأسي، وحساب المثلثات.',
    date: 'Practice 2025',
    totalQuestions: 44,
    modules: 2,
    difficulty: 'Balanced',
    questions: test2Questions,
  },
  {
    id: 'test-3-advanced-2025',
    title: 'Digital SAT Math Practice Exam 3 - Advanced Adaptive (700-800 Focus)',
    titleAr: 'اختبار ديجيتال سات التجريبي 3 - المستوى المتقدم (تركيز 700-800)',
    description: 'Challenging 44 questions targeting high scorers: non-linear systems, circle tangents, rational asymptotes, and 3D geometry.',
    descriptionAr: 'اختبار متقدم مكون من 44 سؤالاً يستهدف العلامات العالية: الأنظمة غير الخطية، مماسات الدوائر، الفجوات وخطوط التقارب، والهندسة الفضائية.',
    date: 'Advanced 2025',
    totalQuestions: 44,
    modules: 2,
    difficulty: 'Advanced',
    questions: test3Questions,
  },
];

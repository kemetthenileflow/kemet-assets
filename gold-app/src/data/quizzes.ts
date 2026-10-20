import { QuizQuestion } from '../types/kemet';

export const SCRIBE_CHALLENGE_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which sacred Egyptian symbol represents eternal life and was carried by gods and pharaohs?',
    arabicQuestion: 'أي رمز مصري مقدس يمثل الحياة الأبدية وكان يحمله الآلهة والملوك؟',
    glyphPrompt: '𓋹',
    options: [
      { label: 'Ankh (Key of Life)', arabicLabel: 'عنخ (مفتاح الحياة)', isCorrect: true },
      { label: 'Djed (Stability)', arabicLabel: 'جد (عمود الاستقرار)', isCorrect: false },
      { label: 'Was Scepter (Dominion)', arabicLabel: 'صولجان واس (القوة)', isCorrect: false },
      { label: 'Shen Ring (Eternity)', arabicLabel: 'حلقة شن (الخلود)', isCorrect: false },
    ],
    explanation: 'The Ankh (𓋹, Gardiner S34) represents life ("Ankh"), breath, and vital solar energy.',
    arabicExplanation: 'رمز العنخ (𓋹) يعني الحياة والنماء، وكان يرمز للأنفاس الطاهرة التي يمنحها الآلهة لملوك مصر.',
  },
  {
    id: 'q2',
    question: 'Why was the royal name of a Pharaoh enclosed within an oval Cartouche (Shenu)?',
    arabicQuestion: 'لماذا كان اسم الفرعون الملكي يُحاط بخرطوش بيضاوي (شنو)؟',
    glyphPrompt: '𓍶',
    options: [
      { label: 'To protect the King from evil throughout eternity like the encircling sun', arabicLabel: 'لحماية الملك الأبدي مثل مسار الشمس المحيط بالعالم', isCorrect: true },
      { label: 'Simply as an artistic frame for decorative borders', arabicLabel: 'مجرد إطار زخرفي لتجميل النقوش', isCorrect: false },
      { label: 'To indicate taxes paid to the temple treasury', arabicLabel: 'للإشارة إلى دفع ضرائب المعبد', isCorrect: false },
      { label: 'Because papyrus scrolls were oval-shaped', arabicLabel: 'لأن لفائف البردي كانت بيضاوية الشكل', isCorrect: false },
    ],
    explanation: 'The cartouche represents an elongated Shen ring (𓍶) knotted with rope, symbolizing that the Pharaoh ruled all that the Sun encircled.',
    arabicExplanation: 'الخرطوش يمثل حلقة "شن" المستطيلة ذات العقدة السفلية، ويدل على أن سلطان الملك يمتد ليشمل كل ما تطوف حوله الشمس.',
  },
  {
    id: 'q3',
    question: 'What phonetic sound does the famous Egyptian Barn Owl glyph (𓅓, Gardiner G17) make?',
    arabicQuestion: 'ما هو الصوت الصوتي الذي يصدره رمز البومة المصرية الشهيرة (𓅓)؟',
    glyphPrompt: '𓅓',
    options: [
      { label: 'M sound (like in "Mother" or "Menes")', arabicLabel: 'حرف الميم (M)', isCorrect: true },
      { label: 'B sound (like in "Bastet")', arabicLabel: 'حرف الباء (B)', isCorrect: false },
      { label: 'R sound (like in "Ra")', arabicLabel: 'حرف الراء (R)', isCorrect: false },
      { label: 'S sound (like in "Sekhmet")', arabicLabel: 'حرف السين (S)', isCorrect: false },
    ],
    explanation: 'The Barn Owl (Gardiner G17) is the uniliteral sign for the consonant "m".',
    arabicExplanation: 'طائر البومة (كود جاردنر G17) هو الحرف الأحادي الدال على صوت الميم "M" في اللغة المصرية.',
  },
  {
    id: 'q4',
    question: 'Which artifact provided the crucial bilingual key that enabled Champollion to decipher hieroglyphs?',
    arabicQuestion: 'ما هي القطعة الأثرية التي قدمت المفتاح اللغوي الحاسم لفك رموز اللغة الهيروغليفية؟',
    options: [
      { label: 'The Rosetta Stone', arabicLabel: 'حجر رشيد', isCorrect: true },
      { label: 'The Golden Mask of King Tut', arabicLabel: 'قناع الملك توت الذهبي', isCorrect: false },
      { label: 'The Great Sphinx Stele', arabicLabel: 'لوحة أبي الهول', isCorrect: false },
      { label: 'The Book of Gates', arabicLabel: 'كتاب البوابات', isCorrect: false },
    ],
    explanation: 'The Rosetta Stone contained the same decree in Hieroglyphic, Demotic, and Ancient Greek.',
    arabicExplanation: 'حجر رشيد احتوى على نفس النص بثلاث لغات وخطوط: الهيروغليفية، والديموطيقية، واليونانية القديمة.',
  },
];

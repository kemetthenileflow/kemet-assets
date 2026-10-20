import React, { useState } from 'react';
import { SCRIBE_CHALLENGE_QUESTIONS } from '../data/quizzes';
import { KemetButton } from './ui/KemetButton';
import { FeatherOfMaatIcon, ScarabIcon, AnkhIcon, DjedIcon } from './ui/EgyptianIcons';
import { playGoldChime, playRoyalFanfare, playStoneTap } from '../utils/audio';
import { Award, CheckCircle, XCircle, RotateCcw, ArrowRight } from 'lucide-react';

interface Props {
  isRtl?: boolean;
}

export const ScribeAcademy: React.FC<Props> = ({ isRtl = false }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const currentQ = SCRIBE_CHALLENGE_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = currentQ.options[idx].isCorrect;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      playRoyalFanfare();
    } else {
      playStoneTap();
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < SCRIBE_CHALLENGE_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      playStoneTap();
    } else {
      setIsQuizComplete(true);
      playRoyalFanfare();
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizComplete(false);
    playGoldChime(1.0);
  };

  // Rank determination
  const getRank = () => {
    const ratio = score / SCRIBE_CHALLENGE_QUESTIONS.length;
    if (ratio === 1) return { title: isRtl ? 'كبير كتبة بيت الحياة (Master of Per-Ankh)' : 'Master of the House of Life (Per-Ankh)', glyph: '𓉐𓋹𓏛' };
    if (ratio >= 0.75) return { title: isRtl ? 'كاتب ملكي طيبة (Royal Theban Scribe)' : 'Royal Theban Scribe', glyph: '𓇓𓏏𓏛' };
    if (ratio >= 0.5) return { title: isRtl ? 'كاتب معبد حورس (Temple Apprentice)' : 'Temple Scribe Apprentice', glyph: '𓏛' };
    return { title: isRtl ? 'مبتدئ في ألواح البردي (Papyrus Initiate)' : 'Papyrus Initiate', glyph: '𓏛𓏥' };
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8860B]/15 border border-[#B8860B]/30 text-xs font-semibold text-[#8C6207] dark:text-[#E6C676] uppercase tracking-wider">
          <FeatherOfMaatIcon size={14} tone="gold" />
          <span>{isRtl ? 'أكاديمية الكتبة وحفظة بيت الحياة' : 'Per-Ankh Scribe Academy'}</span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#3E2723] dark:text-[#F4EFEA]">
          {isRtl ? 'تحدي الكاتب والامتحان الفرعوني' : 'Scribe Knowledge & Decipher Challenge'}
        </h2>
        <p className="max-w-xl mx-auto text-sm text-[#6D4C41] dark:text-stone-300">
          {isRtl
            ? 'اختبر معرفتك بعلامات الهيروغليفية، وتاريخ الفراعنة، ومعاني الرموز المقدسة.'
            : 'Demonstrate your mastery over sacred Egyptian signs, royal cartouches, and mythological foundations.'}
        </p>
      </div>

      {!isQuizComplete ? (
        <div className="kemet-royal-card dark:kemet-royal-card-dark p-6 md:p-8 space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-[#D1B894]/40 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#3E2723] text-[#FFD700]">
                {currentIdx + 1} / {SCRIBE_CHALLENGE_QUESTIONS.length}
              </span>
              <span className="text-xs text-[#6D4C41] dark:text-stone-400">
                {isRtl ? 'السؤال' : 'Inscribed Trial'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6207] dark:text-[#FFD700]">
              <Award className="w-4 h-4 text-[#B8860B]" />
              <span>Score: {score}</span>
            </div>
          </div>

          {/* Glyph Prompt (if present) */}
          {currentQ.glyphPrompt && (
            <div className="flex justify-center my-2">
              <div className="w-20 h-20 rounded-2xl gold-medallion flex items-center justify-center text-5xl text-[#241604] shadow-lg">
                {currentQ.glyphPrompt}
              </div>
            </div>
          )}

          {/* Question Text */}
          <h3 className="font-serif font-bold text-xl md:text-2xl text-[#3E2723] dark:text-[#F4EFEA] text-center leading-relaxed">
            {isRtl ? currentQ.arabicQuestion : currentQ.question}
          </h3>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnVariant: 'gold-secondary' | 'gold-primary' | 'turquoise-primary' | 'tertiary' = 'gold-secondary';

              if (isAnswered) {
                if (opt.isCorrect) btnVariant = 'gold-primary';
                else if (isSelected && !opt.isCorrect) btnVariant = 'tertiary';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`
                    p-4 rounded-xl text-start font-medium text-sm transition-all duration-150 cursor-pointer flex items-center justify-between gap-3
                    ${!isAnswered ? 'bg-white/80 dark:bg-stone-900 border-2 border-[#D1B894] hover:border-[#B8860B] hover:shadow-md' : ''}
                    ${isAnswered && opt.isCorrect ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-300 font-bold' : ''}
                    ${isAnswered && isSelected && !opt.isCorrect ? 'bg-red-500/20 border-2 border-red-500 text-red-950 dark:text-red-300 line-through' : ''}
                    ${isAnswered && !isSelected && !opt.isCorrect ? 'opacity-50 border border-stone-200' : ''}
                  `}
                >
                  <span className="flex-1 text-[#3E2723] dark:text-stone-200">
                    {isRtl ? opt.arabicLabel : opt.label}
                  </span>
                  {isAnswered && opt.isCorrect && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {isAnswered && isSelected && !opt.isCorrect && <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-[#EBDDC6]/60 dark:bg-stone-900/60 border border-[#B8860B]/40 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8C6207] dark:text-[#FFD700] uppercase tracking-wider">
                <DjedIcon size={14} tone="gold" />
                <span>{isRtl ? 'حكمة البردي والتعليل:' : 'Scribal Wisdom & Commentary:'}</span>
              </div>
              <p className="text-xs text-[#5D4037] dark:text-stone-300 leading-relaxed">
                {isRtl ? currentQ.arabicExplanation : currentQ.explanation}
              </p>
              <div className="pt-2 flex justify-end">
                <KemetButton
                  variant="gold-primary"
                  size="md"
                  onClick={handleNext}
                  icon={<ArrowRight size={16} />}
                >
                  {currentIdx + 1 < SCRIBE_CHALLENGE_QUESTIONS.length
                    ? (isRtl ? 'السؤال التالي' : 'Next Question')
                    : (isRtl ? 'عرض رتبة الكاتب' : 'Review Initiation')}
                </KemetButton>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Results Card */
        <div className="kemet-royal-card dark:kemet-royal-card-dark p-8 text-center space-y-6">
          <div className="w-24 h-24 mx-auto rounded-full gold-medallion flex items-center justify-center text-4xl shadow-xl">
            {getRank().glyph}
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C6207] dark:text-[#FFD700]">
              {isRtl ? 'مرسوم الترقية الملكي' : 'Royal Scribal Decree'}
            </span>
            <h3 className="font-serif font-black text-2xl lg:text-3xl text-[#3E2723] dark:text-white">
              {getRank().title}
            </h3>
            <p className="text-sm text-[#6D4C41] dark:text-stone-300">
              {isRtl
                ? `لقد أجبت بنجاح على ${score} من أصل ${SCRIBE_CHALLENGE_QUESTIONS.length} أسئلة في ميزان الحقيقة لماعت.`
                : `You proved your wisdom with ${score} of ${SCRIBE_CHALLENGE_QUESTIONS.length} correct inscriptions.`}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <KemetButton
              variant="gold-primary"
              size="lg"
              onClick={handleRestart}
              icon={<RotateCcw size={18} />}
            >
              {isRtl ? 'إعادة التحدي' : 'Attempt New Initiation'}
            </KemetButton>
          </div>
        </div>
      )}
    </div>
  );
};

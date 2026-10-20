export type LearningEvent = {
  id: string;
  at: string;
  type: 'open' | 'hint' | 'translation' | 'audio' | 'attempt' | 'review';
  resource: string;
  result?: 'correct' | 'incorrect' | 'pending';
  assisted?: boolean;
};

export const PROGRESS_KEY = 'kemet.gold.learning.v1';

export function parseProgress(raw: string | null): LearningEvent[] {
  if (!raw) return [];
  const value = JSON.parse(raw);
  if (value.version !== 1 || !Array.isArray(value.events)) throw new Error('Invalid learning record');
  const ids = new Set<string>();
  return value.events.filter((e: LearningEvent) => {
    if (!e || typeof e.id !== 'string' || ids.has(e.id) || typeof e.resource !== 'string'
      || !['open', 'hint', 'translation', 'audio', 'attempt', 'review'].includes(e.type)
      || typeof e.at !== 'string' || !Number.isFinite(Date.parse(e.at))
      || (e.result !== undefined && !['correct', 'incorrect', 'pending'].includes(e.result))
      || (e.assisted !== undefined && typeof e.assisted !== 'boolean')) return false;
    ids.add(e.id);
    return true;
  });
}

export function progressSummary(events: LearningEvent[]) {
  const attempts = events.filter(e => e.type === 'attempt');
  return {
    attempts: attempts.length,
    correct: attempts.filter(e => e.result === 'correct').length,
    incorrect: attempts.filter(e => e.result === 'incorrect').length,
    pending: attempts.filter(e => e.result === 'pending').length,
    hints: events.filter(e => e.type === 'hint').length,
    translations: events.filter(e => e.type === 'translation').length,
    audioRequests: events.filter(e => e.type === 'audio').length,
    reviewed: new Set(events.filter(e => e.type === 'review').map(e => e.resource)).size,
    // Opening a page is never completion or evidence of mastery.
    independentCorrect: attempts.filter(e => e.result === 'correct' && !e.assisted).length,
    distinctQuestionsAttempted: new Set(attempts.filter(e => e.resource.startsWith('question:')).map(e => e.resource)).size,
  };
}

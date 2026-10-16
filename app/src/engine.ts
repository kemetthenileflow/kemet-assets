export type QueueConfig = {
  mode: string;
  dataset: string;
  bank?: string;
  level?: string;
  passage?: string;
  audioId?: string;
  group?: number;
  version: string;
};

export type Queue = {
  ids: string[];
  cursor: number;
  cycle: number;
  seed: number;
  config: QueueConfig;
};

export type Attempt = {
  id: string;
  uid: string;
  session: string;
  contentId: string;
  version: string;
  mode: string;
  dataset: string;
  support: string;
  response: string;
  firstResponse: string;
  firstAttemptCorrect: boolean | null;
  attemptNumber: number;
  result: 'correct' | 'incorrect' | 'pending';
  hints: number;
  reveal: boolean;
  transcript: boolean;
  replays: number;
  evidence?: string;
  timestamp: string;
  review: 'pending' | 'none';
  durationMs: number;
};

export type NavigationEvent = {
  id: string;
  uid: string;
  page: string;
  from?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
};

export type RegisteredVideo = {
  id: string;
  title: string;
  category: string;
  lesson?: string;
  url: string;
  caption?: string;
  addedAt: string;
};

let volatile = false;
const memory = new Map<string, string>();

export function read<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key) ?? memory.get(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    volatile = true;
    try {
      return JSON.parse(memory.get(key) || 'null') ?? fallback;
    } catch {
      return fallback;
    }
  }
}

export function write(key: string, value: unknown) {
  const text = JSON.stringify(value);
  memory.set(key, text);
  try {
    localStorage.setItem(key, text);
  } catch {
    volatile = true;
  }
}

export function storageStatus(): string {
  return volatile
    ? 'Temporary memory only — progress will be lost when this tab closes'
    : 'Saved on this device — not synced';
}

export function profile(): { uid: string; name: string } {
  let p = read<{ uid: string; name: string } | null>('kemet_new_profile_v1', null);
  if (!p) {
    p = { uid: crypto.randomUUID(), name: 'Learner' };
    write('kemet_new_profile_v1', p);
  }
  return p;
}

export function updateProfile(name: string): { uid: string; name: string } {
  const clean = name.trim().slice(0, 30) || 'Learner';
  const current = profile();
  const updated = { ...current, name: clean };
  write('kemet_new_profile_v1', updated);
  return updated;
}

export function hash(text: string): number {
  let h = 2166136261;
  for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

export function shuffle<T>(items: T[], seed: number): T[] {
  const a = items.slice();
  let state = seed || 1;
  const random = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function queueKey(uid: string, c: QueueConfig) {
  return 'kemet_new_queue_v1_' + uid + '_' + JSON.stringify(c);
}

export function queue(uid: string, c: QueueConfig, pool: string[]): Queue {
  const ids = [...new Set(pool)];
  const k = queueKey(uid, c);
  let q = read<Queue | null>(k, null);
  const same = q && q.ids.length === ids.length && q.ids.every((id) => ids.includes(id));
  if (!same) {
    q = {
      ids: shuffle(ids, hash(uid + JSON.stringify(c))),
      cursor: 0,
      cycle: 0,
      seed: hash(uid + JSON.stringify(c)),
      config: c,
    };
    write(k, q);
  }
  return q!;
}

export function advance(uid: string, c: QueueConfig, pool: string[]): Queue {
  const q = queue(uid, c, pool);
  q.cursor++;
  if (q.cursor >= q.ids.length) {
    q.cursor = 0;
    q.cycle++;
    q.ids = shuffle([...new Set(pool)], q.seed + q.cycle);
  }
  write(queueKey(uid, c), q);
  return q;
}

export function attempts(uid = profile().uid): Attempt[] {
  return read<Attempt[]>('kemet_new_attempts_v1', []).filter((a) => a.uid === uid);
}

export function record(input: Omit<Attempt, 'id' | 'timestamp' | 'firstResponse' | 'firstAttemptCorrect' | 'attemptNumber'>): Attempt {
  const all = read<Attempt[]>('kemet_new_attempts_v1', []);
  const history = all.filter((a) => a.uid === input.uid && a.contentId === input.contentId && a.version === input.version);
  const same = history.filter((a) => a.session === input.session);
  const a: Attempt = {
    ...input,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    firstResponse: history[0]?.firstResponse ?? input.response,
    firstAttemptCorrect: history.length ? history[0].firstAttemptCorrect : input.result === 'pending' ? null : input.result === 'correct',
    attemptNumber: history.length + 1,
    hints: Math.max(input.hints, ...same.map((a) => a.hints)),
    reveal: input.reveal || same.some((a) => a.reveal),
    transcript: input.transcript || same.some((a) => a.transcript),
  };
  all.push(a);
  write('kemet_new_attempts_v1', all);
  return a;
}

export function recordSkip(uid: string, session: string, contentId: string, version: string, mode: string): Attempt {
  return record({
    uid,
    session,
    contentId,
    version,
    mode,
    dataset: 'source330',
    support: 'skipped',
    response: '[SKIPPED_WITHOUT_CREDIT]',
    result: 'pending',
    hints: 0,
    reveal: false,
    transcript: false,
    replays: 0,
    review: 'none',
    durationMs: 0,
  });
}

export function independent(a: Attempt): boolean {
  return a.result === 'correct' && !['supported', 'model-viewed', 'skipped'].includes(a.support) && !a.hints && !a.reveal && !a.transcript;
}

export function recallConfirmed(uid: string, id: string): boolean {
  const a = attempts(uid).filter((a) => a.contentId === id && independent(a));
  return new Set(a.map((x) => x.session)).size >= 2 && a.some((x) => ['spelling', 'dictation', 'recall', 'match'].includes(x.mode));
}

export function trackNavigation(page: string, from?: string, metadata?: Record<string, unknown>) {
  const uid = profile().uid;
  const events = read<NavigationEvent[]>('kemet_navigation_events_v1', []);
  const ev: NavigationEvent = {
    id: crypto.randomUUID(),
    uid,
    page,
    from,
    timestamp: new Date().toISOString(),
    metadata,
  };
  events.push(ev);
  if (events.length > 500) events.shift();
  write('kemet_navigation_events_v1', events);
}

export function getNavigationEvents(uid = profile().uid): NavigationEvent[] {
  return read<NavigationEvent[]>('kemet_navigation_events_v1', []).filter((e) => e.uid === uid);
}

export function getRegisteredVideos(): RegisteredVideo[] {
  return read<RegisteredVideo[]>('kemet_registered_videos_v1', []);
}

export function registerVideo(video: Omit<RegisteredVideo, 'id' | 'addedAt'>): RegisteredVideo {
  const list = getRegisteredVideos();
  const item: RegisteredVideo = {
    ...video,
    id: 'vid-' + Date.now(),
    addedAt: new Date().toISOString(),
  };
  list.push(item);
  write('kemet_registered_videos_v1', list);
  return item;
}

export function removeRegisteredVideo(id: string) {
  const list = getRegisteredVideos().filter((v) => v.id !== id);
  write('kemet_registered_videos_v1', list);
}

export function csv(rows: Attempt[]): string {
  const esc = (v: unknown) => {
    let s = String(v ?? '');
    if (/^[\s]*[=+\-@]/.test(s)) s = "'" + s;
    return '"' + s.replaceAll('"', '""') + '"';
  };
  const headers = [
    'id',
    'uid',
    'contentId',
    'mode',
    'dataset',
    'support',
    'response',
    'firstResponse',
    'firstAttemptCorrect',
    'attemptNumber',
    'result',
    'hints',
    'reveal',
    'transcript',
    'review',
    'timestamp',
  ];
  return '\uFEFF' + [headers.join(','), ...rows.map((a) => headers.map((k) => esc((a as Record<string, unknown>)[k])).join(','))].join('\r\n');
}

export function download(name: string, text: string, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

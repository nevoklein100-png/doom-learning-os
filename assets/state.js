export const STORAGE_KEY = 'doomLearningStateV2';
const LEGACY_KEY = 'doomLearningState';
const LEGACY_NOTES_KEY = 'doomGlobalNotes';

export function emptyState() {
  return { version: 2, tasks: {}, notes: {}, globalNotes: '', updatedAt: null };
}

function storage() {
  try { return window.localStorage; } catch { return null; }
}

function validMap(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function normalizeV2(value) {
  if (!validMap(value) || value.version !== 2) return null;
  const state = emptyState();
  if (validMap(value.tasks)) {
    for (const [key, done] of Object.entries(value.tasks)) {
      if (/^p\d+_\d+$/.test(key) && done === true) state.tasks[key] = true;
    }
  }
  if (validMap(value.notes)) {
    for (const [key, note] of Object.entries(value.notes)) {
      if (/^p\d+$/.test(key) && typeof note === 'string') state.notes[key] = note;
    }
  }
  if (typeof value.globalNotes === 'string') state.globalNotes = value.globalNotes;
  if (typeof value.updatedAt === 'string') state.updatedAt = value.updatedAt;
  return state;
}

function fromLegacy(value, globalNotes = '') {
  if (!validMap(value)) return null;
  const state = emptyState();
  for (const [key, item] of Object.entries(value)) {
    if (/^p\d+_\d+$/.test(key) && item === true) state.tasks[key] = true;
    if (/^note_p\d+$/.test(key) && typeof item === 'string') state.notes[key.slice(5)] = item;
  }
  if (typeof globalNotes === 'string') state.globalNotes = globalNotes;
  return state;
}

function preserveCorrupt(source, raw) {
  const store = storage();
  if (!store) return false;
  try {
    store.setItem(`${source}-recovery-${Date.now()}`, raw);
    return true;
  } catch { return false; }
}

export function loadState() {
  const warnings = [];
  const store = storage();
  if (!store) return { state: emptyState(), warnings: ['אין גישה לשמירה בדפדפן. הורד גיבוי לפני סגירת הדף.'], saved: false, canWrite: false };
  let currentRaw, legacyRaw, legacyNotes;
  try {
    currentRaw = store.getItem(STORAGE_KEY);
    legacyRaw = store.getItem(LEGACY_KEY);
    legacyNotes = store.getItem(LEGACY_NOTES_KEY) || '';
  } catch {
    return { state: emptyState(), warnings: ['הדפדפן חסם גישה לשמירה. הורד גיבוי לפני סגירת הדף.'], saved: false, canWrite: false };
  }
  let canWrite = true;
  if (currentRaw) {
    try {
      const current = normalizeV2(JSON.parse(currentRaw));
      if (current) return { state: current, warnings, saved: true, canWrite: true };
    } catch { /* preserve below */ }
    const safe = preserveCorrupt(STORAGE_KEY, currentRaw);
    canWrite = safe;
    warnings.push(safe ? 'נמצא מידע שמור לא תקין. עותק לשחזור נשמר בדפדפן.' : 'נמצא מידע שמור לא תקין. הורד גיבוי לפני המשך עבודה.');
  }
  if (legacyRaw) {
    try {
      const legacy = fromLegacy(JSON.parse(legacyRaw), legacyNotes);
      if (legacy) return { state: legacy, warnings, saved: false, migrated: true, canWrite };
    } catch { /* preserve below */ }
    const safe = preserveCorrupt(LEGACY_KEY, legacyRaw);
    warnings.push(safe ? 'מידע ישן לא תקין נשמר כעותק לשחזור.' : 'מידע ישן לא תקין לא ניתן לקריאה.');
  }
  const state = emptyState();
  state.globalNotes = legacyNotes;
  return { state, warnings, saved: false, canWrite };
}

export function saveState(state) {
  const store = storage();
  if (!store) return false;
  try {
    state.updatedAt = new Date().toISOString();
    store.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch { return false; }
}

export function makeBackup(state) {
  return { format: 'doom-learning-backup', version: 2, exportedAt: new Date().toISOString(), state };
}

export function parseBackup(text) {
  const parsed = JSON.parse(text);
  if (parsed?.format === 'doom-learning-backup') {
    const normalized = normalizeV2(parsed.state);
    if (!normalized) throw new Error('unsupported');
    return normalized;
  }
  const v2 = normalizeV2(parsed);
  if (v2) return v2;
  if (!validMap(parsed) || !Object.keys(parsed).some((key) => /^p\d+_\d+$/.test(key) || /^note_p\d+$/.test(key) || key === 'globalNotes')) throw new Error('unsupported');
  const legacy = fromLegacy(parsed, typeof parsed?.globalNotes === 'string' ? parsed.globalNotes : '');
  if (legacy) return legacy;
  throw new Error('unsupported');
}

function mergeText(existing = '', imported = '') {
  const oldText = existing.trim();
  const newText = imported.trim();
  if (!newText || oldText === newText || oldText.includes(newText)) return existing;
  if (!oldText) return imported;
  return `${existing.trimEnd()}\n\n── מיובא מגיבוי ──\n${imported}`;
}

export function mergeState(existing, imported) {
  const merged = emptyState();
  merged.tasks = { ...existing.tasks, ...imported.tasks };
  for (const key of new Set([...Object.keys(existing.notes), ...Object.keys(imported.notes)])) {
    merged.notes[key] = mergeText(existing.notes[key], imported.notes[key]);
  }
  merged.globalNotes = mergeText(existing.globalNotes, imported.globalNotes);
  return merged;
}

#!/usr/bin/env node
import assert from 'node:assert/strict';

class MemoryStorage {
  values = new Map();
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

const localStorage = new MemoryStorage();
globalThis.window = { localStorage };
const { STORAGE_KEY, emptyState, loadState, saveState, makeBackup, parseBackup, mergeState } = await import('../assets/state.js');

assert.deepEqual(loadState().state, emptyState(), 'a new browser starts with empty version 2 state');

localStorage.setItem('doomLearningState', JSON.stringify({ p1_0: true, note_p1: 'legacy phase note' }));
localStorage.setItem('doomGlobalNotes', 'legacy project note');
const migrated = loadState();
assert.equal(migrated.migrated, true);
assert.equal(migrated.state.tasks.p1_0, true);
assert.equal(migrated.state.notes.p1, 'legacy phase note');
assert.equal(migrated.state.globalNotes, 'legacy project note');
assert.equal(localStorage.getItem('doomLearningState') !== null, true, 'migration leaves the legacy copy intact');
assert.equal(saveState(migrated.state), true);
assert.equal(loadState().state.tasks.p1_0, true, 'saved v2 progress reloads');

const imported = parseBackup(JSON.stringify(makeBackup({
  version: 2,
  tasks: { p1_1: true },
  notes: { p1: 'imported phase note' },
  globalNotes: 'imported project note'
})));
const merged = mergeState(migrated.state, imported);
assert.deepEqual(merged.tasks, { p1_0: true, p1_1: true }, 'backup import merges task completion');
assert.match(merged.notes.p1, /legacy phase note[\s\S]*imported phase note/, 'different phase notes are both preserved');
assert.match(merged.globalNotes, /legacy project note[\s\S]*imported project note/, 'different project notes are both preserved');
assert.equal(parseBackup(JSON.stringify({ p2_3: true, note_p2: 'legacy backup' })).tasks.p2_3, true, 'legacy backups remain importable');
assert.throws(() => parseBackup('{"format":"unrelated"}'), 'unrecognized backup files are rejected');

localStorage.setItem(STORAGE_KEY, '{broken json');
const recovered = loadState();
assert.equal(recovered.state.version, 2, 'malformed state does not crash loading');
assert.equal(recovered.warnings.length > 0, true, 'malformed state is reported');
assert.equal([...localStorage.values.keys()].some((key) => key.startsWith(`${STORAGE_KEY}-recovery-`)), true, 'malformed state is preserved under a recovery key');

globalThis.window = {};
const blocked = loadState();
assert.equal(blocked.canWrite, false, 'blocked browser storage is reported');
assert.equal(saveState(emptyState()), false, 'failed local storage writes are reported');

console.log('PASS — local state, legacy migration, backup validation/merge, corruption recovery, and storage failure paths');

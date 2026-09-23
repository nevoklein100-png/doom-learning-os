import { loadState, saveState, makeBackup, parseBackup, mergeState } from './state.js';

const $ = (selector, root = document) => root.querySelector(selector);
const byId = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const kindNames = { LEARN: 'LEARN', BUILD: 'BUILD', TEST: 'TEST', POLISH: 'POLISH', DOCUMENT: 'DOCUMENT' };
const kindClasses = { LEARN: 'learn', BUILD: 'build', TEST: 'test', POLISH: 'polish', DOCUMENT: 'document' };
let phases = [];
let resources = [];
let milestones = [];
let state;
let canWrite = true;
let saveTimer;
let toastTimer;

function isCore(phase) { return phase.priority_status.includes('חובה'); }
function taskKey(phase, index) { return `${phase.id}_${index}`; }
function phaseDone(phase) { return phase.tasks.length > 0 && phase.tasks.every((_, index) => state.tasks[taskKey(phase, index)]); }
function phaseCompleted(phase) { return phase.tasks.filter((_, index) => state.tasks[taskKey(phase, index)]).length; }
function phaseReady(phase) { return phase.prerequisites.every((id) => { const prior = phases.find((candidate) => candidate.id === id); return prior && phaseDone(prior); }); }
function phasePercent(phase) { return Math.round(phaseCompleted(phase) / phase.tasks.length * 100); }
function milestonePhases(milestone) { return milestone.phase_ids.map((id) => phases.find((phase) => phase.id === id)).filter(Boolean); }
function milestonePercent(milestone) { const relevant = milestonePhases(milestone).filter(isCore); const all = relevant.flatMap((phase) => phase.tasks.map((_, index) => [phase, index])); return all.length ? Math.round(all.filter(([phase, index]) => state.tasks[taskKey(phase, index)]).length / all.length * 100) : 0; }
function firstIncomplete(phase) { return phase.tasks.findIndex((_, index) => !state.tasks[taskKey(phase, index)]); }
function currentMilestone() { return milestones.find((milestone) => milestonePhases(milestone).some((phase) => isCore(phase) && !phaseDone(phase))) || milestones.at(-1); }
function nextPhase() { const pending = phases.filter((phase) => !phaseDone(phase)); return pending.find((phase) => isCore(phase) && phaseReady(phase)) || pending.find((phase) => isCore(phase)) || pending.find(phaseReady) || pending[0]; }
function hoursEstimate() { return Math.round(phases.filter((phase) => isCore(phase)).reduce((total, phase) => { const values = phase.estimated_hours.match(/\d+/g)?.map(Number) || []; const midpoint = values.length >= 2 ? (values[0] + values[1]) / 2 : (values[0] || 0); return total + midpoint * (1 - phasePercent(phase) / 100); }, 0)); }
function setProgress(id, percent) { const bar = byId(id); bar.setAttribute('aria-valuenow', String(percent)); $('span', bar).style.width = `${percent}%`; }

function showToast(message) { const toast = byId('toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3600); }
function showNotice(message) { const notice = byId('appNotice'); notice.textContent = message; notice.hidden = false; }
function setSaveStatus(saved) { const label = byId('saveStatus'); label.textContent = saved ? 'נשמר במכשיר' : 'לא נשמר'; label.style.color = saved ? '' : 'var(--red)'; byId('notesSaveHint').textContent = saved ? 'נשמר אוטומטית במכשיר הזה' : 'השמירה נחסמה — הורד גיבוי לפני סגירת הדף'; }
function persist() { const saved = canWrite && saveState(state); setSaveStatus(saved); if (!saved) showNotice('הדפדפן חסם שמירה מקומית. הורד גיבוי לפני סגירת הדף.'); return saved; }
function persistSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(persist, 300); }

function renderDashboard() {
  const milestone = currentMilestone();
  const percent = milestonePercent(milestone);
  byId('milestoneCode').textContent = milestone.eyebrow;
  byId('current-milestone-title').textContent = milestone.title;
  byId('milestoneSummary').textContent = milestone.summary;
  byId('milestonePercent').textContent = `${percent}%`;
  byId('milestoneDeliverable').textContent = milestone.deliverable;
  setProgress('milestoneBar', percent);

  const phase = nextPhase();
  if (phase) {
    const index = firstIncomplete(phase);
    const type = phase.task_types[index] || 'BUILD';
    byId('nextType').textContent = kindNames[type] || type;
    byId('next-title').textContent = phase.tasks[index];
    byId('nextContext').textContent = `שלב ${phase.number}: ${phase.title}. ${phase.goal}`;
    byId('nextPrerequisites').textContent = phaseReady(phase) ? 'כל התנאים המקדימים לשלב הזה הושלמו.' : `לפני כן: ${phase.prerequisites.filter((id) => { const prior = phases.find((candidate) => candidate.id === id); return prior && !phaseDone(prior); }).map((id) => phases.find((candidate) => candidate.id === id)?.title).filter(Boolean).join(' · ')}`;
    byId('nextLink').href = `#${phase.id}`;
  } else {
    byId('nextType').textContent = 'COMPLETE';
    byId('next-title').textContent = 'כל השלבים הושלמו';
    byId('nextContext').textContent = 'המשך לבדוק את הדמות במשחק, לתעד מה גילית וללטש את מה שחשוב.';
    byId('nextPrerequisites').textContent = '';
    byId('nextLink').href = '#workspace';
  }
  const taskTotal = phases.reduce((total, phase) => total + phase.tasks.length, 0);
  const taskDone = phases.reduce((total, phase) => total + phaseCompleted(phase), 0);
  const donePhases = phases.filter(phaseDone).length;
  const overall = Math.round(taskDone / taskTotal * 100);
  byId('statDone').firstChild.textContent = String(taskDone);
  byId('statTotal').textContent = `/ ${taskTotal}`;
  byId('statPhases').firstChild.textContent = String(donePhases);
  byId('statPhaseTotal').textContent = `/ ${phases.length}`;
  byId('statHours').textContent = `~${hoursEstimate()} שעות`;
  byId('overallPercent').textContent = `${overall}%`;
  byId('overallCaption').textContent = `${taskDone} מתוך ${taskTotal} פעולות הושלמו.`;
  setProgress('overallBar', overall);
}

function renderMilestones() {
  const current = currentMilestone();
  byId('milestoneGrid').innerHTML = milestones.map((milestone) => {
    const relevant = milestonePhases(milestone);
    const percent = milestonePercent(milestone);
    const firstPhase = relevant[0];
    const status = percent === 100 ? 'הושלם' : milestone.id === current.id ? 'פעיל כעת' : 'בהמשך';
    return `<article class="milestone-card ${milestone.id === current.id ? 'current' : ''} ${percent === 100 ? 'complete' : ''}"><p class="milestone-code">${escapeHtml(milestone.eyebrow)}</p><h3>${escapeHtml(milestone.title)}</h3><p>${escapeHtml(milestone.summary)}</p><footer><span>${status} · ${relevant.length} שלבים</span><strong>${percent}%</strong><a href="#${escapeHtml(firstPhase.id)}" aria-label="פתח את ${escapeHtml(milestone.title)}">←</a></footer></article>`;
  }).join('');
}

function resourceUrl(value) { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : '#'; } catch { return '#'; } }
function resourceAccess(status) {
  return ({
    free_to_read: 'חינם לקריאה',
    free_lessons: 'שיעורים חינמיים',
    free_article_playlist: 'מאמר וסדרת וידאו חינמיים',
    free_with_adobe_id: 'חינם עם Adobe ID',
    free_fab_listing: 'נכס חינמי ב-Fab',
    open_source_mit: 'קוד פתוח · MIT'
  })[status] || 'הגישה לא אומתה';
}
function renderResource(resource) {
  const url = resourceUrl(resource.url);
  const linkStatus = resource.availability_status === 'http_200' ? 'קישור נבדק' : 'רישום Fab אומת · גישה אוטומטית חסומה';
  return `<div class="resource-card"><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(resource.title)} ↗</a><p>${escapeHtml(resource.creator)} · ${escapeHtml(resource.description)}</p><p class="resource-meta"><span>${escapeHtml(resourceAccess(resource.free_status))}</span><span>${linkStatus} · ${escapeHtml(resource.last_checked)}</span></p><details class="resource-details"><summary>גרסה, בדיקה ותנאי שימוש</summary><p><strong>גרסה / זמינות:</strong> ${escapeHtml(resource.version_date)}</p><p><strong>בדיקה:</strong> ${escapeHtml(resource.verification_status)}</p><p><strong>תנאים:</strong> ${escapeHtml(resource.license_notes)}</p></details></div>`;
}
function phaseStatus(phase) {
  if (phaseDone(phase)) return ['הושלם', 'complete'];
  if (phaseCompleted(phase)) return ['בתהליך', 'active'];
  if (!phaseReady(phase)) return ['תנאים חסרים', 'locked'];
  if (!isCore(phase)) return ['מומלץ / בהמשך', 'optional'];
  return ['אפשר להתחיל', 'ready'];
}
function renderPhase(phase, resourceMap) {
  const [status, className] = phaseStatus(phase);
  const assigned = phase.resource_ids.map((id) => resourceMap.get(id)).filter(Boolean);
  const prerequisites = phase.prerequisites.map((id) => phases.find((candidate) => candidate.id === id)).filter(Boolean);
  return `<details class="phase-card" id="${escapeHtml(phase.id)}"><summary><span class="phase-number">${String(phase.number).padStart(2, '0')}</span><span class="phase-heading"><h3>${escapeHtml(phase.title)}</h3><p>${escapeHtml(phase.summary)}</p></span><span class="phase-meta"><span class="phase-status ${className}">${status}</span><span class="phase-progress">${phasePercent(phase)}%</span><span class="phase-chevron" aria-hidden="true">›</span></span></summary><div class="phase-detail"><div class="phase-goal"><strong>תוצר השלב:</strong> ${escapeHtml(phase.goal)}</div><p class="phase-description">זמן משוער: ${escapeHtml(phase.estimated_hours)} · ${isCore(phase) ? 'שלב ליבה' : 'שלב מומלץ או עתידי'}</p>${prerequisites.length ? `<div class="prereq-list"><span>תנאים מקדימים:</span>${prerequisites.map((item) => `<a class="prereq-chip" href="#${escapeHtml(item.id)}">${escapeHtml(item.title)} ${phaseDone(item) ? '✓' : '○'}</a>`).join('')}</div>` : ''}<h4>פעולות</h4><div class="task-list">${phase.tasks.map((task, index) => { const kind = phase.task_types[index] || 'BUILD'; return `<label class="task-item"><input type="checkbox" data-task="${escapeHtml(taskKey(phase, index))}" ${state.tasks[taskKey(phase, index)] ? 'checked' : ''}><span class="task-text">${escapeHtml(task)}</span><span class="kind-chip ${kindClasses[kind] || 'build'}">${kindNames[kind] || kind}</span></label>`; }).join('')}</div><h4>מקורות ללמידה</h4><div class="resource-list">${assigned.map(renderResource).join('')}</div><h4>מה בודקים לפני שממשיכים?</h4><p class="phase-description">${escapeHtml(phase.exit_criteria)}</p><label class="phase-notes-label" for="note-${escapeHtml(phase.id)}">הערות לשלב</label><textarea id="note-${escapeHtml(phase.id)}" data-note="${escapeHtml(phase.id)}" placeholder="מה עבד? מה צריך לשפר?" rows="4"></textarea></div></details>`;
}
function matchesFilter(phase, filter) {
  if (filter === 'ready') return phaseReady(phase) && !phaseDone(phase);
  if (filter === 'active') return phaseCompleted(phase) > 0 && !phaseDone(phase);
  if (filter === 'complete') return phaseDone(phase);
  if (filter === 'core') return isCore(phase);
  return true;
}
function renderPhases(preserveOpen = true) {
  const list = byId('phaseList');
  const open = preserveOpen ? new Set([...list.querySelectorAll('details[open]')].map((item) => item.id)) : new Set();
  const query = byId('searchInput').value.trim().toLocaleLowerCase();
  const filter = byId('filterSelect').value;
  const resourceMap = new Map(resources.map((resource) => [resource.id, resource]));
  const visible = phases.filter((phase) => {
    if (!matchesFilter(phase, filter)) return false;
    if (!query) return true;
    const assigned = phase.resource_ids.map((id) => resourceMap.get(id)).filter(Boolean);
    return [phase.title, phase.summary, phase.goal, ...phase.tasks, ...assigned.flatMap((resource) => [resource.title, resource.creator, resource.description])].join(' ').toLocaleLowerCase().includes(query);
  });
  list.innerHTML = visible.length ? visible.map((phase) => renderPhase(phase, resourceMap)).join('') : '<div class="empty-state">אין שלבים שתואמים לחיפוש. נסה מילה אחרת או הסר את הסינון.</div>';
  for (const id of open) { const item = byId(id); if (item) item.open = true; }
  for (const phase of visible) { const note = byId(`note-${phase.id}`); if (note) note.value = state.notes[phase.id] || ''; }
  byId('resultCount').textContent = `${visible.length} מתוך ${phases.length} שלבים`;
}
function updateVisiblePhases() {
  for (const card of byId('phaseList').querySelectorAll('.phase-card')) {
    const phase = phases.find((item) => item.id === card.id);
    if (!phase) continue;
    const [label, className] = phaseStatus(phase);
    const status = $('.phase-status', card);
    status.textContent = label;
    status.className = `phase-status ${className}`;
    $('.phase-progress', card).textContent = `${phasePercent(phase)}%`;
    for (const chip of card.querySelectorAll('.prereq-chip')) {
      const prior = phases.find((item) => `#${item.id}` === chip.getAttribute('href'));
      if (prior) chip.textContent = `${prior.title} ${phaseDone(prior) ? '✓' : '○'}`;
    }
  }
}
function renderAll() { renderDashboard(); renderMilestones(); renderPhases(); }
function openHashPhase() { const id = decodeURIComponent(location.hash.slice(1)); if (!/^p\d+$/.test(id)) return; const card = byId(id); if (card) { card.open = true; card.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }

async function shareSite() {
  const url = location.href.split('#')[0];
  try {
    if (navigator.share) { await navigator.share({ title: 'DOOM // Learning OS', url }); return; }
    await navigator.clipboard.writeText(url);
    showToast('הקישור הועתק ללוח');
  } catch (error) { if (error?.name !== 'AbortError') showToast('אפשר להעתיק את כתובת האתר משורת הכתובת'); }
}
function exportBackup() {
  clearTimeout(saveTimer); persist();
  const file = new Blob([JSON.stringify(makeBackup(state), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a'); link.href = url; link.download = `doom-learning-backup-${new Date().toISOString().slice(0, 10)}.json`; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  byId('backupMessage').textContent = 'הגיבוי הורד. שמור אותו במקום בטוח.';
}
async function importBackup(file) {
  const message = byId('backupMessage');
  if (!file) return;
  if (file.size > 2_000_000) { message.textContent = 'הקובץ גדול מדי. בחר גיבוי JSON בגודל עד 2MB.'; return; }
  try {
    const imported = parseBackup(await file.text());
    state = mergeState(state, imported);
    const saved = persist();
    byId('globalNotes').value = state.globalNotes;
    renderAll();
    message.textContent = saved ? 'הגיבוי יובא ומוזג עם ההתקדמות הקיימת.' : 'הגיבוי נטען, אבל הדפדפן חסם שמירה. הורד גיבוי חדש.';
    showToast('הגיבוי יובא');
  } catch { message.textContent = 'לא ניתן לקרוא את הקובץ. בחר גיבוי של DOOM Learning OS.'; }
}

function bindEvents() {
  byId('searchInput').addEventListener('input', () => renderPhases());
  byId('filterSelect').addEventListener('change', () => renderPhases());
  byId('phaseList').addEventListener('change', (event) => {
    const box = event.target.closest('input[data-task]'); if (!box) return;
    if (box.checked) state.tasks[box.dataset.task] = true; else delete state.tasks[box.dataset.task];
    persist(); renderDashboard(); renderMilestones();
    if (['all', 'core'].includes(byId('filterSelect').value)) updateVisiblePhases(); else renderPhases();
  });
  byId('phaseList').addEventListener('input', (event) => {
    const note = event.target.closest('textarea[data-note]'); if (!note) return;
    state.notes[note.dataset.note] = note.value; persistSoon();
  });
  byId('globalNotes').addEventListener('input', (event) => { state.globalNotes = event.target.value; persistSoon(); });
  byId('shareButton').addEventListener('click', shareSite);
  byId('exportButton').addEventListener('click', exportBackup);
  byId('importButton').addEventListener('click', () => byId('importFile').click());
  byId('importFile').addEventListener('change', async (event) => { await importBackup(event.target.files[0]); event.target.value = ''; });
  byId('nextLink').addEventListener('click', () => setTimeout(openHashPhase, 0));
  byId('milestoneGrid').addEventListener('click', (event) => { if (event.target.closest('a[href^="#p"]')) setTimeout(openHashPhase, 0); });
  byId('phaseList').addEventListener('click', (event) => { if (event.target.closest('a[href^="#p"]')) setTimeout(openHashPhase, 0); });
  window.addEventListener('hashchange', openHashPhase);
  window.addEventListener('beforeunload', () => { if (saveTimer) { clearTimeout(saveTimer); persist(); } });
}

async function start() {
  const loaded = loadState(); state = loaded.state; canWrite = loaded.canWrite !== false;
  if (loaded.warnings.length) showNotice(loaded.warnings.join(' '));
  if (!loaded.saved && canWrite) {
    if (persist() && loaded.migrated) showToast('התקדמות מהגרסה הישנה הועברה בהצלחה');
  } else {
    setSaveStatus(loaded.saved);
  }
  try {
    const paths = ['./content/curriculum.json', './content/resources.json', './content/milestones.json'];
    const responses = await Promise.all(paths.map((path) => fetch(path, { cache: 'no-cache' })));
    if (responses.some((response) => !response.ok)) throw new Error('Content request failed');
    [phases, resources, milestones] = await Promise.all(responses.map((response) => response.json()));
    if (![phases, resources, milestones].every(Array.isArray) || !phases.length || !milestones.length) throw new Error('Invalid content');
    byId('globalNotes').value = state.globalNotes;
    bindEvents(); renderAll(); openHashPhase();
  } catch {
    showNotice('לא ניתן לטעון את תוכן האתר. רענן את הדף ובדוק את החיבור לאינטרנט.');
    byId('phaseList').innerHTML = '<div class="empty-state">תוכן המסלול אינו זמין כעת. נסה לרענן את הדף.</div>';
    byId('next-title').textContent = 'המסלול לא נטען';
    byId('current-milestone-title').textContent = 'נסה לרענן את הדף';
  }
}
start();

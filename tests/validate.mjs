#!/usr/bin/env node
/* Dependency-free content and deployment integrity checks. */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const errors = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
function check(condition, message) { if (!condition) errors.push(message); }
function load(file) { try { return JSON.parse(read(file)); } catch (error) { errors.push(`${file}: ${error.message}`); return []; } }
const phases = load('content/curriculum.json');
const resources = load('content/resources.json');
const milestones = load('content/milestones.json');
const html = read('index.html');
const app = read('assets/app.js');
const state = read('assets/state.js');

check(Array.isArray(phases) && phases.length > 0, 'Curriculum must contain phases');
check(Array.isArray(resources) && resources.length > 0, 'Resources must be an array');
check(Array.isArray(milestones) && milestones.length > 0, 'Milestones must be an array');
const phaseIds = new Set();
const resourceIds = new Set();
const milestoneIds = new Set();
const accessStatuses = new Set(['free_to_read', 'free_lessons', 'free_article_playlist', 'free_with_adobe_id', 'free_fab_listing', 'open_source_mit']);
const availabilityStatuses = new Set(['http_200', 'indexed_access_limited']);
const taskCount = phases.reduce((total, phase) => total + (Array.isArray(phase.tasks) ? phase.tasks.length : 0), 0);
for (const [index, phase] of phases.entries()) {
  check(typeof phase.id === 'string' && /^p\d+$/.test(phase.id), `Invalid phase ID at ${index}`);
  check(!phaseIds.has(phase.id), `Duplicate phase ID: ${phase.id}`);
  phaseIds.add(phase.id);
  check(phase.number === index + 1, `Phase order mismatch: ${phase.id}`);
  check(typeof phase.title === 'string' && phase.title.length > 0, `Missing title: ${phase.id}`);
  for (const field of ['summary', 'goal', 'exit_criteria', 'estimated_hours', 'priority_status']) check(typeof phase[field] === 'string' && phase[field].trim(), `Missing ${field}: ${phase.id}`);
  check(Array.isArray(phase.learning_outcomes) && phase.learning_outcomes.length > 0, `Missing learning outcomes: ${phase.id}`);
  check(Array.isArray(phase.tasks) && phase.tasks.length > 0, `Missing tasks: ${phase.id}`);
  check(phase.tasks.every((task) => typeof task === 'string' && task.trim()), `Empty or invalid task: ${phase.id}`);
  check(Array.isArray(phase.task_types) && phase.task_types.length === phase.tasks.length, `Task types mismatch: ${phase.id}`);
  for (const kind of phase.task_types || []) check(['LEARN', 'BUILD', 'TEST', 'POLISH', 'DOCUMENT'].includes(kind), `Unknown task type in ${phase.id}: ${kind}`);
  check(Array.isArray(phase.prerequisites), `Missing prerequisites: ${phase.id}`);
  check(Array.isArray(phase.resource_ids) && phase.resource_ids.length > 0, `Missing resource references: ${phase.id}`);
  check(typeof phase.milestone_id === 'string', `Missing milestone: ${phase.id}`);
}
for (const resource of resources) {
  check(typeof resource.id === 'string' && resource.id.length > 0, 'Resource missing ID');
  check(!resourceIds.has(resource.id), `Duplicate resource ID: ${resource.id}`);
  resourceIds.add(resource.id);
  check(phaseIds.has(resource.phase_id), `Unknown phase for resource ${resource.id}`);
  try { const url = new URL(resource.url); check(['https:', 'http:'].includes(url.protocol), `Unsafe resource URL: ${resource.id}`); } catch { errors.push(`Invalid resource URL: ${resource.id}`); }
  check(typeof resource.verification_status === 'string', `Missing verification status: ${resource.id}`);
  for (const field of ['title', 'creator', 'description', 'version_date', 'license_notes']) check(typeof resource[field] === 'string' && resource[field].trim(), `Missing ${field}: ${resource.id}`);
  check(accessStatuses.has(resource.free_status), `Invalid or unreviewed access status: ${resource.id}`);
  check(availabilityStatuses.has(resource.availability_status), `Missing checked availability status: ${resource.id}`);
  check(/^\d{4}-\d{2}-\d{2}$/.test(resource.last_checked || ''), `Invalid last_checked date: ${resource.id}`);
}
for (const milestone of milestones) {
  check(typeof milestone.id === 'string' && milestone.id.length > 0, 'Milestone missing ID');
  check(!milestoneIds.has(milestone.id), `Duplicate milestone ID: ${milestone.id}`);
  milestoneIds.add(milestone.id);
  check(typeof milestone.title === 'string' && !!milestone.title, `Missing milestone title: ${milestone.id}`);
  check(Array.isArray(milestone.phase_ids) && milestone.phase_ids.length > 0, `Empty milestone: ${milestone.id}`);
  for (const id of milestone.phase_ids || []) check(phaseIds.has(id), `Unknown phase ${id} in ${milestone.id}`);
}
const milestonePhaseIds = milestones.flatMap((milestone) => milestone.phase_ids);
check(new Set(milestonePhaseIds).size === phases.length && milestonePhaseIds.length === phases.length, 'Each phase must appear in exactly one milestone');
for (const phase of phases) {
  check(milestoneIds.has(phase.milestone_id), `Unknown milestone for ${phase.id}`);
  check(milestones.find((milestone) => milestone.id === phase.milestone_id)?.phase_ids.includes(phase.id), `Milestone mismatch for ${phase.id}`);
  for (const id of phase.prerequisites || []) check(phaseIds.has(id) && id !== phase.id, `Invalid prerequisite ${id} in ${phase.id}`);
  for (const id of phase.resource_ids || []) check(resourceIds.has(id), `Unknown resource ${id} in ${phase.id}`);
}
const byId = new Map(phases.map((phase) => [phase.id, phase]));
const visiting = new Set();
const visited = new Set();
function visit(id) {
  if (visited.has(id)) return;
  if (visiting.has(id)) { errors.push(`Prerequisite cycle at ${id}`); return; }
  visiting.add(id);
  for (const prior of byId.get(id)?.prerequisites || []) if (byId.has(prior)) visit(prior);
  visiting.delete(id);
  visited.add(id);
}
for (const id of phaseIds) visit(id);
check(html.includes('id="phaseList"') && html.includes('id="next-action"'), 'Missing curriculum or next action UI');
check(html.includes('./assets/app.js') && html.includes('./assets/styles.css'), 'Missing modular app assets');
check(html.includes('https://nevoklein100-png.github.io/doom-learning-os/'), 'Missing canonical production URL');
check(html.includes('class="stats-grid" role="group"'), 'Progress summary must have a valid accessible group role');
check(!html.includes('const resources = ['), 'Curriculum still duplicated inside HTML');
check(app.includes('./content/curriculum.json') && app.includes('./content/resources.json') && app.includes('./content/milestones.json'), 'App must load canonical JSON');
check(state.includes("'doomLearningState'") && state.includes("'doomGlobalNotes'"), 'Legacy browser data migration missing');
check(taskCount === 100, `Expected 100 stable curriculum tasks, found ${taskCount}`);
check(app.includes('resourceAccess(resource.free_status)') && app.includes('resource.availability_status'), 'Resource access and link-check status must be visible');
check(!/href=["']https?:[^"']+["'](?![^>]*rel=["'][^"']*noopener)/i.test(html), 'External blank-target links must use rel="noopener"');
check(fs.existsSync(path.join(root, '.nojekyll')), 'GitHub Pages publishing marker missing');

if (errors.length) {
  console.error(`FAILED — ${errors.length} check(s)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`PASS — ${phases.length} phases, ${taskCount} tasks, ${resources.length} resource records, ${milestones.length} milestones; content, references, dependencies, access metadata, accessibility markers and site assets valid`);

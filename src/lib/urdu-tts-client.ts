import {defaultUrduVoice, seededAudioTexts, type UrduVoice} from './urdu-tts-content';
import {isUrduAudioSource} from './urdu-audio-source';

type CachedAudio = {url:string; expires:number};
const urls = new Map<string, CachedAudio>();
const pending = new Map<string, Promise<string | undefined>>();
const failures = new Map<string, number>();
const listeners = new Set<() => void>();
let revision = 0;
let prewarmed = false;
const cacheLifetime = 6 * 24 * 60 * 60 * 1000;
const retryDelay = 30000;
const cacheKey = (text:string, voice:UrduVoice) => `alif-urdu-audio-v1:${voice}:${text}`;
const changed = () => {revision++; listeners.forEach(listener => {try {listener();} catch {/* Optional audio observers must not reject playback. */}});};
export const subscribeCloudAudio = (listener:() => void) => {listeners.add(listener); return () => {listeners.delete(listener);};};
export const getCloudAudioRevision = () => revision;
export const getServerCloudAudioRevision = () => 0;

export function getCachedUrduUrl(text:string, voice:UrduVoice = defaultUrduVoice) {
  const key = cacheKey(text, voice);
  let cached = urls.get(key);
  if (!cached && typeof window !== 'undefined') {
    try {
      const stored = JSON.parse(localStorage.getItem(key) ?? 'null');
      if (stored && isUrduAudioSource(stored.url) && typeof stored.expires === 'number' && Number.isFinite(stored.expires)) cached = stored;
    } catch { /* Storage may be disabled on this device. */ }
  }
  if (!cached || cached.expires <= Date.now()) {urls.delete(key); return undefined;}
  urls.set(key, cached);
  return cached.url;
}
export const isCloudAudioLoading = (text:string) => pending.has(cacheKey(text, defaultUrduVoice));
export const cloudAudioFailed = (text:string) => (failures.get(cacheKey(text, defaultUrduVoice)) ?? 0) > Date.now();

// This optional service never rejects, including when called without a catch.
export function requestUrduAudio(text:string, voice:UrduVoice = defaultUrduVoice):Promise<string | undefined> {
  const cached = getCachedUrduUrl(text, voice);
  if (cached) return Promise.resolve(cached);
  const key = cacheKey(text, voice);
  const existing = pending.get(key);
  if (existing) return existing;
  if ((failures.get(key) ?? 0) > Date.now()) return Promise.resolve(undefined);
  // Defer execution until pending is registered, including synchronous API failures.
  const request = Promise.resolve().then(async () => {
    try {
      const response = await fetch('/api/public/urdu-tts', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text, voice}), signal:AbortSignal.timeout(25000)});
      if (!response.ok) throw new Error('Narration request failed');
      const result = await response.json();
      if (!result || !isUrduAudioSource(result.url)) throw new Error('Invalid narration URL');
      const record = {url:result.url, expires:Date.now() + cacheLifetime};
      urls.set(key, record); failures.delete(key);
      try {localStorage.setItem(key, JSON.stringify(record));} catch { /* Memory cache still works. */ }
      return record.url;
    } catch {failures.set(key, Date.now() + retryDelay); return undefined;}
    finally {pending.delete(key); changed();}
  });
  pending.set(key, request); changed();
  return request;
}

export async function prewarmUrduAudio() {
  if (prewarmed || typeof window === 'undefined') return;
  prewarmed = true;
  // Probe once; absent credentials stop the batch quietly, not dozens of calls.
  const first = seededAudioTexts[0];
  if (!first) return;
  try {if (!await requestUrduAudio(first)) return;} catch {return;}
  const remaining = seededAudioTexts.slice(1);
  // Two concurrent requests avoid flooding the narration service.
  await Promise.all([0, 1].map(async () => {
    while (remaining.length) {
      const text = remaining.shift();
      if (!text) return;
      try {if (!await requestUrduAudio(text)) return;} catch {return;}
    }
  }));
}
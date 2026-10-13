export type AudioStatus = 'loading' | 'ready' | 'unavailable';
export type PlaybackResult = 'started' | 'loading' | 'unavailable';
let voices: SpeechSynthesisVoice[] = [];
let status: AudioStatus = 'loading';
let synthesis: SpeechSynthesis | undefined;
let voiceTimer: ReturnType<typeof setTimeout> | undefined;
let playbackTimer: ReturnType<typeof setTimeout> | undefined;
let currentUtterance: SpeechSynthesisUtterance | undefined;
let recording: HTMLAudioElement | undefined;
let primedRecording: HTMLAudioElement | undefined;
let playbackId = 0;
const subscribers = new Set<() => void>();

function setStatus(value: AudioStatus) {
  status = value;
  subscribers.forEach(listener => {try {listener();}catch{/* Optional audio observer. */}});
}

export function selectUrduVoice(available: SpeechSynthesisVoice[]) {
  return available.find(v => v.lang.toLowerCase().startsWith('ur'))
    ?? available.find(v => v.lang.toLowerCase().startsWith('ar'))
    ?? available.find(v => v.default)
    ?? available[0];
}

function readVoices() {
  if (!synthesis) return;
  try {
    voices = synthesis.getVoices();
    if (voices.length) {
      clearTimeout(voiceTimer);
      setStatus('ready');
    }
  } catch { setStatus('unavailable'); }
}

// Load ahead of a click. Never defer speaking to voiceschanged: the next tap
// must retain the browser's user-gesture permission to start audio.
export function initializeUrduAudio() {
  if (typeof window === 'undefined') return;
  try {
  if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance !== 'function') {
    setStatus('unavailable');
    return;
  }
  if (synthesis) return;
  synthesis = window.speechSynthesis;
  synthesis.addEventListener('voiceschanged', readVoices);
  readVoices();
  if (status === 'loading') voiceTimer = setTimeout(() => {
    readVoices();
    if (!voices.length) setStatus('unavailable');
  }, 3000);
  } catch { synthesis = undefined; setStatus('unavailable'); }
}

export function subscribeUrduAudio(listener: () => void) {
  subscribers.add(listener);
  return () => { subscribers.delete(listener); };
}
export function getUrduAudioStatus() { return status; }
export function getServerAudioStatus(): AudioStatus { return 'loading'; }

export function stopUrduAudio() {
  playbackId++;
  clearTimeout(playbackTimer);
  if (currentUtterance) {
    currentUtterance.onstart = null;
    currentUtterance.onerror = null;
    currentUtterance.onend = null;
    currentUtterance = undefined;
  }
  try { synthesis?.cancel(); } catch { /* Optional device API. */ }
  try { recording?.pause(); } catch { /* Optional device API. */ }
  recording = undefined;
}

// Unlock the same media element during the tap, before fetching its MP3.
// Safari requires gesture playback even when the real source arrives later.
export function primeUrduRecording() {
  if (typeof window === 'undefined') return;
  stopUrduAudio();
  try {
    primedRecording?.pause();
    primedRecording = new Audio('data:audio/wav;base64,UklGRnQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==');
    void primedRecording.play().catch(() => {});
  } catch {primedRecording = undefined;}
}

// Invoke synchronously from the click handler; no awaits before play/speak.
export function playUrduAudio(text: string, audioUrl?: string, onUnavailable?: () => void): PlaybackResult {
  if (typeof window === 'undefined') return 'unavailable';
  initializeUrduAudio();
  stopUrduAudio();
  const id = playbackId;
  const fail = () => {
    if (id !== playbackId) return;
    clearTimeout(playbackTimer);
    if (!audioUrl) setStatus('unavailable');
    try {onUnavailable?.();}catch{/* Never reject a media event or playback promise. */}
  };
  if (audioUrl) {
    // HTMLAudioElement supports both signed HTTP URLs and inline MP3 data URLs.
    try {
      const audio = primedRecording ?? new Audio(audioUrl);
      primedRecording = undefined;
      audio.src = audioUrl;
      recording = audio;
      audio.onerror = fail;
      void audio.play().catch(fail);
      return 'started';
    } catch { fail(); return 'unavailable'; }
  }
  if (status !== 'ready') readVoices();
  if (!synthesis || status === 'unavailable') return 'unavailable';
  if (!voices.length) return 'loading';
  try {
    const voice = selectUrduVoice(voices);
    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || 'ur-PK';
    utterance.rate = .75;
    currentUtterance = utterance; // Keep alive for browsers that GC queued speech.
    utterance.onstart = () => { clearTimeout(playbackTimer); };
    utterance.onend = () => { clearTimeout(playbackTimer); if (id === playbackId) currentUtterance = undefined; };
    utterance.onerror = event => {
      if (event.error !== 'canceled' && event.error !== 'interrupted') fail();
    };
    playbackTimer = setTimeout(fail, 5000);
    synthesis.cancel();
    synthesis.speak(utterance);
    return 'started';
  } catch { fail(); return 'unavailable'; }
}
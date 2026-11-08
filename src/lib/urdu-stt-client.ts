// Records a short clip in the browser and asks the server to transcribe it with
// Google Speech-to-Text. Everything here is best-effort: on any failure it calls
// onUnavailable/onError (with a short reason, for diagnostics) so the caller can
// fall back to the browser recognizer. Nothing throws out of startCloudRecognition.

let cloudUnconfigured = false; // once the server answers 503, stop trying this session.

type Picked = {mime: string; encoding: 'WEBM_OPUS' | 'OGG_OPUS'};
function pickMime(): Picked | null {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return null;
  if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) return {mime: 'audio/webm;codecs=opus', encoding: 'WEBM_OPUS'};
  if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) return {mime: 'audio/ogg;codecs=opus', encoding: 'OGG_OPUS'};
  return null;
}

export function cloudSttSupported(): boolean {
  return !cloudUnconfigured
    && typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia
    && pickMime() !== null;
}

async function blobToBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(binary);
}

export type CloudHandlers = {
  onTranscript: (text: string) => void;   // recognized (possibly empty) text
  onUnavailable: (reason: string) => void; // cloud can't be used — fall back to the browser recognizer
  onError: (reason: string) => void;       // mic blocked / recording failed — surface an error
  onPace?: () => void;                     // fires on each spoken word, for live word-by-word highlighting
  maxMs?: number;
};

// Returns a stop() that ends recording early and transcribes what was captured.
export function startCloudRecognition(h: CloudHandlers): {stop: () => void} {
  const picked = pickMime();
  if (cloudUnconfigured || !picked || typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    h.onUnavailable('unsupported');
    return {stop() {}};
  }
  let recorder: MediaRecorder | undefined;
  let stream: MediaStream | undefined;
  let ctx: AudioContext | undefined;
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const chunks: BlobPart[] = [];
  const cleanup = () => {clearTimeout(timer); try {ctx?.close();} catch {/* ignore */} stream?.getTracks().forEach(t => t.stop());};
  // Live word-by-word pacing: advance one word each time the mic hears speech start.
  const startPace = (s: MediaStream) => {
    try {
      const AC = (window.AudioContext ?? (window as unknown as {webkitAudioContext?: typeof AudioContext}).webkitAudioContext);
      if (!AC) return;
      ctx = new AC();
      void ctx.resume?.();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(s).connect(analyser);
      const buf = new Uint8Array(analyser.fftSize);
      let noise = 0.012, last = 0;
      const tick = () => {
        if (stopped || !ctx || ctx.state === 'closed') return;
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {const v = (buf[i]! - 128) / 128; sum += v * v;}
        const rms = Math.sqrt(sum / buf.length);
        noise = noise * 0.997 + rms * 0.003; // slow noise floor
        const hi = Math.max(0.028, noise * 2.2);
        const now = performance.now();
        // Walk the highlight forward at reading cadence whenever speech is present.
        if (rms > hi && now - last > 240) {last = now; h.onPace?.();}
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    } catch {/* pace tracking is optional */}
  };
  const stop = () => {
    if (stopped) return;
    stopped = true;
    try {
      if (recorder && recorder.state !== 'inactive') recorder.stop();
      else cleanup();
    } catch {cleanup(); h.onError('stop-failed');}
  };
  navigator.mediaDevices.getUserMedia({audio: true}).then(s => {
    stream = s;
    if (stopped) {cleanup(); return;}
    if (h.onPace) startPace(s);
    try {recorder = new MediaRecorder(s, {mimeType: picked.mime});}
    catch {cleanup(); h.onUnavailable('recorder-init'); return;}
    recorder.ondataavailable = e => {if (e.data.size) chunks.push(e.data);};
    recorder.onerror = () => {cleanup(); h.onError('recorder-error');};
    recorder.onstop = async () => {
      cleanup();
      try {
        const blob = new Blob(chunks, {type: picked.mime});
        if (!blob.size) {h.onError('empty-recording'); return;}
        const base64 = await blobToBase64(blob);
        const res = await fetch('/api/public/urdu-stt', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({audio: base64, encoding: picked.encoding}),
        });
        if (res.status === 503) {cloudUnconfigured = true; h.onUnavailable('cloud-503'); return;}
        if (!res.ok) {
          let reason = `cloud-http-${res.status}`;
          try {const b = await res.json(); if (b?.googleStatus) reason += ` g${b.googleStatus}`; if (b?.detail) reason += `: ${String(b.detail).slice(0, 90)}`;} catch {/* non-JSON */}
          h.onError(reason);
          return;
        }
        const data = await res.json();
        h.onTranscript(typeof data?.transcript === 'string' ? data.transcript : '');
      } catch {h.onError('client-exception');}
    };
    recorder.start();
    timer = setTimeout(stop, h.maxMs ?? 8000);
  }).catch(() => {cleanup(); h.onError('mic-permission');}); // permission denied or no microphone
  return {stop};
}

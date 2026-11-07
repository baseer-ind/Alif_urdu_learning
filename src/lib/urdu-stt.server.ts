// Google Cloud Speech-to-Text for read-aloud grading. Optional and paid:
// without a key the endpoint reports "not configured" and the client falls back
// to the browser recognizer, so learning never depends on it. Audio size is
// capped here; the real bill guard is a per-day quota set on the API key in
// Google Cloud (budget alerts only warn, they don't stop spend).
const MAX_BASE64 = 1_400_000; // ~1 MB of Opus audio ≈ 15s of speech

type Body = {audio?: unknown; encoding?: unknown};

export async function handleUrduStt(request: Request): Promise<Response> {
  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_BASE64 + 4096) return Response.json({error: 'Recording is too large.'}, {status: 413});
  let body: Body;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BASE64 + 4096) return Response.json({error: 'Recording is too large.'}, {status: 413});
    body = JSON.parse(raw) as Body;
  } catch {
    return Response.json({error: 'Send a JSON body with base64 audio.'}, {status: 400});
  }
  const audio = body.audio;
  if (typeof audio !== 'string' || audio.length < 100 || audio.length > MAX_BASE64 || !/^[A-Za-z0-9+/]+={0,2}$/.test(audio)) {
    return Response.json({error: 'Provide a short base64 audio recording.'}, {status: 400});
  }
  const encoding = body.encoding === 'OGG_OPUS' ? 'OGG_OPUS' : 'WEBM_OPUS';

  // A dedicated STT key is preferred (restrict it to Speech-to-Text and set a
  // daily quota); the TTS key is accepted as a fallback for single-key setups.
  const key = process.env['GOOGLE_STT_API_KEY'] ?? process.env['GOOGLE_TTS_API_KEY'];
  if (!key) return Response.json({error: 'Cloud speech recognition is not configured yet.'}, {status: 503});

  let response: Response;
  try {
    response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        config: {encoding, sampleRateHertz: 48000, languageCode: 'ur-PK', alternativeLanguageCodes: ['ur-IN'], maxAlternatives: 1, enableAutomaticPunctuation: false},
        audio: {content: audio},
      }),
    });
  } catch {
    return Response.json({error: 'Speech service could not be reached. Please try again.'}, {status: 504});
  }
  if (!response.ok) {
    let message = 'Speech recognition failed.';
    try {const b = await response.clone().json(); if (typeof b?.error?.message === 'string') message = b.error.message;} catch {/* non-JSON error */}
    message = message.split(key).join('[redacted]').split(encodeURIComponent(key)).join('[redacted]');
    console.error(`Google STT failed [${response.status}]: ${message}`);
    return Response.json({error: `Speech recognition failed (${response.status}).`, googleStatus: response.status}, {status: response.status === 429 ? 429 : 502});
  }
  let transcript = '';
  try {
    const result = await response.json();
    const parts = Array.isArray(result?.results) ? result.results : [];
    transcript = parts.map((r: {alternatives?: {transcript?: string}[]}) => r.alternatives?.[0]?.transcript ?? '').join(' ').replace(/\s+/g, ' ').trim();
  } catch {
    return Response.json({error: 'Speech service returned invalid data.'}, {status: 502});
  }
  return Response.json({transcript}, {headers: {'Cache-Control': 'no-store'}});
}

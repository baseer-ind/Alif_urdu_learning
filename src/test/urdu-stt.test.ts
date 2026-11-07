import {afterEach, describe, it, expect, vi} from 'vitest';

const audio = 'A'.repeat(400); // valid base64 chars, within the size window
const request = (body: unknown, raw?: string) => new Request('http://localhost/api/public/urdu-stt', {method: 'POST', body: raw ?? JSON.stringify(body)});
afterEach(() => {vi.unstubAllGlobals(); vi.unstubAllEnvs();});

describe('Cloud speech-to-text endpoint', () => {
  it('transcribes Opus audio through Google v1 recognize with Urdu config', async () => {
    vi.stubEnv('GOOGLE_STT_API_KEY', 'unit-test-not-a-real-key');
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({results: [{alternatives: [{transcript: 'یہ میرا گھر ہے'}]}]})));
    vi.stubGlobal('fetch', fetcher);
    const {handleUrduStt} = await import('@/lib/urdu-stt.server');
    const result = await handleUrduStt(request({audio, encoding: 'WEBM_OPUS'}));
    expect(result.status).toBe(200);
    expect((await result.json()).transcript).toBe('یہ میرا گھر ہے');
    expect(fetcher.mock.calls[0]?.[0]).toBe('https://speech.googleapis.com/v1/speech:recognize?key=unit-test-not-a-real-key');
    const sent = JSON.parse(fetcher.mock.calls[0]?.[1].body);
    expect(sent.config).toMatchObject({encoding: 'WEBM_OPUS', languageCode: 'ur-PK', alternativeLanguageCodes: ['ur-IN']});
    expect(sent.audio.content).toBe(audio);
  });
  it('passes OGG_OPUS through and reuses the TTS key when no STT key is set', async () => {
    vi.stubEnv('GOOGLE_TTS_API_KEY', 'tts-key');
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({results: []})));
    vi.stubGlobal('fetch', fetcher);
    const {handleUrduStt} = await import('@/lib/urdu-stt.server');
    const result = await handleUrduStt(request({audio, encoding: 'OGG_OPUS'}));
    expect(result.status).toBe(200);
    expect((await result.json()).transcript).toBe('');
    expect(JSON.parse(fetcher.mock.calls[0]?.[1].body).config.encoding).toBe('OGG_OPUS');
    expect(fetcher.mock.calls[0]?.[0]).toContain('key=tts-key');
  });
  it('reports "not configured" with 503 and never calls Google when no key exists', async () => {
    vi.stubEnv('GOOGLE_STT_API_KEY', '');
    vi.stubEnv('GOOGLE_TTS_API_KEY', '');
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    const {handleUrduStt} = await import('@/lib/urdu-stt.server');
    expect((await handleUrduStt(request({audio}))).status).toBe(503);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each([{}, {audio: '@@@@@@@@@@'}, {audio: 'AAA'}])('rejects missing or malformed audio %j', async body => {
    vi.stubEnv('GOOGLE_STT_API_KEY', 'unit-test-not-a-real-key');
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    const {handleUrduStt} = await import('@/lib/urdu-stt.server');
    expect((await handleUrduStt(request(body))).status).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('rejects a non-JSON body and an oversized recording without calling Google', async () => {
    vi.stubEnv('GOOGLE_STT_API_KEY', 'unit-test-not-a-real-key');
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    const {handleUrduStt} = await import('@/lib/urdu-stt.server');
    expect((await handleUrduStt(request(null, 'not json'))).status).toBe(400);
    expect((await handleUrduStt(request(null, JSON.stringify({audio: 'A'.repeat(1_405_000)})))).status).toBe(413);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('maps Google failures to 502/429 and redacts the key from logs', async () => {
    vi.stubEnv('GOOGLE_STT_API_KEY', 'secret-key');
    const logger = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({error: {message: 'bad key secret-key'}}), {status: 400})));
      let {handleUrduStt} = await import('@/lib/urdu-stt.server');
      expect((await handleUrduStt(request({audio}))).status).toBe(502);
      expect(logger.mock.calls[0]?.[0]).not.toContain('secret-key');
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', {status: 429})));
      ({handleUrduStt} = await import('@/lib/urdu-stt.server'));
      expect((await handleUrduStt(request({audio}))).status).toBe(429);
    } finally {logger.mockRestore();}
  });
  it('returns 504 when the speech service cannot be reached', async () => {
    vi.stubEnv('GOOGLE_STT_API_KEY', 'unit-test-not-a-real-key');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network failure')));
    const {handleUrduStt} = await import('@/lib/urdu-stt.server');
    expect((await handleUrduStt(request({audio}))).status).toBe(504);
  });
});

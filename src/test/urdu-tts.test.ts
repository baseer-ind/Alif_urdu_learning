import {beforeEach, afterEach, describe, it, expect, vi} from 'vitest';
import {webcrypto, createHash} from 'node:crypto';
import {TextEncoder} from 'node:util';
import {audioHash, defaultUrduVoice, seededAudioTexts, normalizeUrduVoice, urduVoices} from '@/lib/urdu-tts-content';

const storage = vi.hoisted(()=>({list:vi.fn(), upload:vi.fn(), createSignedUrl:vi.fn()}));
vi.mock('@/integrations/supabase/client.server',()=>({supabaseAdmin:{storage:{from:()=>storage}}}));
const request = (body:unknown) => new Request('http://localhost/api/public/urdu-tts',{method:'POST',body:JSON.stringify(body)});

beforeEach(()=>{
  vi.stubGlobal('crypto',webcrypto);vi.stubGlobal('TextEncoder',TextEncoder);
  storage.list.mockReset().mockResolvedValue({data:[],error:null});
  storage.upload.mockReset().mockResolvedValue({error:null});
  storage.createSignedUrl.mockReset().mockResolvedValue({data:{signedUrl:'https://audio.example/clip.mp3'},error:null});
});
afterEach(()=>{vi.unstubAllGlobals();vi.unstubAllEnvs();});

describe('Google narration rules',()=>{
  it('retries unsupported Chirp speakingRate with MP3-only config',async()=>{
    vi.stubEnv('GOOGLE_TTS_API_KEY','unit-test-not-a-real-key');
    const fetcher=vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({error:{message:'speakingRate is not supported for this voice'}}),{status:400}))
      .mockResolvedValueOnce(new Response(JSON.stringify({audioContent:'SUQzAQ=='})));
    vi.stubGlobal('fetch',fetcher);
    const {handleUrduTts}=await import('@/lib/urdu-tts.server');
    const result=await handleUrduTts(request({text:'پانی اور روٹی'}));
    expect(result.status).toBe(200);
    expect((await result.json()).voice).toBe('ur-IN-Chirp3-HD-Aoede');
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetcher.mock.calls[1]?.[1].body)).toEqual({input:{text:'پانی اور روٹی'},voice:{languageCode:'ur-IN',name:'ur-IN-Chirp3-HD-Aoede'},audioConfig:{audioEncoding:'MP3'}});
  });
  it('falls back from unavailable Chirp to Wavenet A and uses its own storage hash',async()=>{
    vi.stubEnv('GOOGLE_TTS_API_KEY','unit-test-not-a-real-key');
    const fetcher=vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({error:{message:'Voice ur-IN-Chirp3-HD-Aoede does not exist'}}),{status:400}))
      .mockResolvedValueOnce(new Response(JSON.stringify({audioContent:'SUQzAQ=='})));
    vi.stubGlobal('fetch',fetcher);
    const {handleUrduTts}=await import('@/lib/urdu-tts.server');
    const result=await handleUrduTts(request({text:'پانی اور روٹی'}));
    expect(result.status).toBe(200);
    expect((await result.json()).voice).toBe('ur-IN-Wavenet-A');
    expect(JSON.parse(fetcher.mock.calls[1]?.[1].body).voice.name).toBe('ur-IN-Wavenet-A');
    expect(storage.upload.mock.calls[0]?.[0]).toBe(`${await audioHash('پانی اور روٹی','ur-IN-Wavenet-A')}.mp3`);
    expect(await audioHash('پانی اور روٹی','ur-IN-Wavenet-A')).not.toBe(await audioHash('پانی اور روٹی','ur-IN-Chirp3-HD-Aoede'));
  });
  it('does not retry an invalid key as a voice failure',async()=>{
    vi.stubEnv('GOOGLE_TTS_API_KEY','unit-test-not-a-real-key');
    const fetcher=vi.fn().mockResolvedValue(new Response(JSON.stringify({error:{message:'API key not valid.'}}),{status:400}));
    vi.stubGlobal('fetch',fetcher);
    const logger=vi.spyOn(console,'error').mockImplementation(()=>{});
    try {
      const {handleUrduTts}=await import('@/lib/urdu-tts.server');
      expect((await handleUrduTts(request({text:'پانی اور روٹی'}))).status).toBe(502);
      expect(fetcher).toHaveBeenCalledOnce();
    } finally {logger.mockRestore();}
  });

  it.each(['lookup-error','lookup-throw','upload-error','upload-throw','sign-error','sign-throw'])('delivers Google MP3 inline despite %s',async failure=>{
    vi.stubEnv('GOOGLE_TTS_API_KEY','unit-test-not-a-real-key');
    if(failure==='lookup-error'){storage.list.mockResolvedValue({data:null,error:{message:'Denied'}});storage.upload.mockResolvedValue({error:{message:'Denied'}});}
    if(failure==='lookup-throw'){storage.list.mockRejectedValue(new Error('Storage unavailable'));storage.upload.mockRejectedValue(new Error('Storage unavailable'));}
    if(failure==='upload-error')storage.upload.mockResolvedValue({error:{message:'Denied'}});
    if(failure==='upload-throw')storage.upload.mockRejectedValue(new Error('Denied'));
    if(failure==='sign-error')storage.createSignedUrl.mockResolvedValue({data:null,error:{message:'Denied'}});
    if(failure==='sign-throw')storage.createSignedUrl.mockRejectedValue(new Error('Denied'));
    const fetcher=vi.fn().mockResolvedValue(new Response(JSON.stringify({audioContent:'SUQzAQ=='})));vi.stubGlobal('fetch',fetcher);
    const {handleUrduTts}=await import('@/lib/urdu-tts.server');
    const result=await handleUrduTts(request({text:'پانی',voice:'ur-IN-Wavenet-A'}));
    expect(result.status).toBe(200);
    expect((await result.json()).url).toBe('data:audio/mp3;base64,SUQzAQ==');
    expect(fetcher).toHaveBeenCalledOnce();
  });
  it('reports the exact Google invalid-key status even when storage is denied',async()=>{
    vi.stubEnv('GOOGLE_TTS_API_KEY','unit-test-not-a-real-key');
    storage.list.mockRejectedValue(new Error('Denied'));
    vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(JSON.stringify({error:{message:'API key not valid. Please pass a valid API key.'}}),{status:400})));
    const logger=vi.spyOn(console,'error').mockImplementation(()=>{});
    try{
      const {handleUrduTts}=await import('@/lib/urdu-tts.server');const result=await handleUrduTts(request({text:'پانی'}));
      expect(result.status).toBe(502);
      expect(await result.json()).toEqual({error:'Google narration failed (400): API key not valid. Please pass a valid API key.',googleStatus:400});
    }finally{logger.mockRestore();}
  });
  it('defaults to Aoede and supports Chirp alternates plus Wavenet voices',()=>{
    expect(defaultUrduVoice).toBe('ur-IN-Chirp3-HD-Aoede');
    expect(urduVoices).toEqual(['ur-IN-Chirp3-HD-Aoede','ur-IN-Chirp3-HD-Charon','ur-IN-Chirp3-HD-Kore','ur-IN-Chirp3-HD-Puck','ur-IN-Wavenet-A','ur-IN-Wavenet-B','ur-IN-Wavenet-C','ur-IN-Wavenet-D']);
  });
  it('hashes exactly text + voice with SHA-256',async()=>{
    expect(await audioHash('پانی','ur-IN-Wavenet-A')).toBe(createHash('sha256').update('پانیur-IN-Wavenet-A').digest('hex'));
    expect(await audioHash('پانی','ur-IN-Wavenet-B')).not.toBe(await audioHash('پانی','ur-IN-Wavenet-A'));
  });
  it('normalizes legacy ur-PK voices to Aoede',()=>{
    expect(normalizeUrduVoice('ur-PK-UzmaNeural')).toBe('ur-IN-Chirp3-HD-Aoede');
    expect(normalizeUrduVoice('ur-PK-AsadNeural')).toBe('ur-IN-Chirp3-HD-Aoede');
    expect(normalizeUrduVoice('ur-IN-Wavenet-D')).toBe('ur-IN-Wavenet-D');
  });
  it('prewarms letters, vocabulary, full sentences and tappable words',()=>{
    for(const text of ['ا','ب','پ','ت','ٹ','ث','ج','انار','بکری','پانی','تارا','ٹوپی','ثمر','جہاز','یہ میرا گھر ہے۔','میں پانی پیتا ہوں۔','آج موسم اچھا ہے۔','یہ ایک خوبصورت کتاب ہے۔','ہے','کتاب'])expect(seededAudioTexts).toContain(text);
    expect(new Set(seededAudioTexts).size).toBe(seededAudioTexts.length);
  });
  it('returns a cached URL without calling Google even when keys are absent',async()=>{
    vi.stubEnv('GOOGLE_TTS_API_KEY','');
    storage.list.mockImplementation(async (_prefix, options)=>({data:[{name:options.search}],error:null}));const fetcher=vi.fn();vi.stubGlobal('fetch',fetcher);
    const {handleUrduTts}=await import('@/lib/urdu-tts.server');const result=await handleUrduTts(request({text:'ا'}));
    expect(result.status).toBe(200);expect((await result.json()).url).toBeTruthy();expect(fetcher).not.toHaveBeenCalled();expect(storage.upload).not.toHaveBeenCalled();
  });
  it('generates and uploads MP3 with the requested Google format and voice',async()=>{
    vi.stubEnv('GOOGLE_TTS_API_KEY','unit-test-not-a-real-key');
    const fetcher=vi.fn().mockResolvedValue(new Response(JSON.stringify({audioContent:'SUQzAQ=='})));vi.stubGlobal('fetch',fetcher);
    const {handleUrduTts}=await import('@/lib/urdu-tts.server');const result=await handleUrduTts(request({text:'پانی',voice:'ur-IN-Wavenet-B'}));
    expect(result.status).toBe(200);
    expect(fetcher.mock.calls[0]?.[0]).toBe('https://texttospeech.googleapis.com/v1/text:synthesize?key=unit-test-not-a-real-key');
    expect(fetcher.mock.calls[0]?.[1].headers).toEqual({'Content-Type':'application/json'});
    expect(JSON.parse(fetcher.mock.calls[0]?.[1].body)).toEqual({input:{text:'پانی'},voice:{languageCode:'ur-IN',name:'ur-IN-Wavenet-B'},audioConfig:{audioEncoding:'MP3',speakingRate:0.9}});
    expect(storage.upload.mock.calls[0]?.[1]).toEqual(new Uint8Array([73,68,51,1]));
    expect(storage.upload.mock.calls[0]?.[0]).toBe(`${await audioHash('پانی','ur-IN-Wavenet-B')}.mp3`);
  });
  it('uses the default Google cache key for a legacy Pakistani voice',async()=>{
    storage.list.mockImplementation(async (_prefix, options)=>({data:[{name:options.search}],error:null}));
    const {handleUrduTts}=await import('@/lib/urdu-tts.server');
    expect((await handleUrduTts(request({text:'ب',voice:'ur-PK-UzmaNeural'}))).status).toBe(200);
    expect(storage.list).toHaveBeenCalledWith('',{search:`${await audioHash('ب','ur-IN-Chirp3-HD-Aoede')}.mp3`,limit:1});
  });
  it.each(urduVoices)('accepts %s',async voice=>{
    storage.list.mockImplementation(async (_prefix, options)=>({data:[{name:options.search}],error:null}));
    const {handleUrduTts}=await import('@/lib/urdu-tts.server');
    expect((await handleUrduTts(request({text:'ب',voice}))).status).toBe(200);
  });
  it.each([400,401,403,429,500])('reports Google failure %s without uploading',async status=>{
    vi.stubEnv('GOOGLE_TTS_API_KEY','unit-test-not-a-real-key');
    vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(JSON.stringify({error:{message:'Voice unavailable'}}),{status})));
    const logger=vi.spyOn(console,'error').mockImplementation(()=>{});
    try {
      const {handleUrduTts}=await import('@/lib/urdu-tts.server');
      const result=await handleUrduTts(request({text:'ب'}));
      expect(result.status).toBe(status===429?429:502);
      expect((await result.json()).error).toContain('Voice unavailable');
      expect(logger).toHaveBeenCalledWith(`Google TTS failed [${status}]: Voice unavailable`);
      expect(storage.upload).not.toHaveBeenCalled();
    } finally {logger.mockRestore();}
  });
  it.each([{}, {audioContent:'%'}, {audioContent:''}])('rejects invalid Google audio %j',async body=>{
    vi.stubEnv('GOOGLE_TTS_API_KEY','unit-test-not-a-real-key');
    vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(JSON.stringify(body))));
    const {handleUrduTts}=await import('@/lib/urdu-tts.server');
    expect((await handleUrduTts(request({text:'ب'}))).status).toBe(502);
    expect(storage.upload).not.toHaveBeenCalled();
  });
  it('fails gracefully when Google credentials are missing',async()=>{
    vi.stubEnv('GOOGLE_TTS_API_KEY','');const fetcher=vi.fn();vi.stubGlobal('fetch',fetcher);
    const {handleUrduTts}=await import('@/lib/urdu-tts.server');expect((await handleUrduTts(request({text:'ب'}))).status).toBe(503);expect(fetcher).not.toHaveBeenCalled();
  });
  it('rejects invalid voices and arbitrary paid synthesis requests',async()=>{
    const {handleUrduTts}=await import('@/lib/urdu-tts.server');expect((await handleUrduTts(request({text:'ب',voice:'en-US-Other'}))).status).toBe(400);
    expect((await handleUrduTts(request({text:'not curriculum'}))).status).toBe(403);expect(storage.list).not.toHaveBeenCalled();
  });
});

describe('Narration URL cache',()=>{
  beforeEach(()=>{vi.resetModules();localStorage.clear();});
  it('accepts and restores inline MP3 data URLs',async()=>{
    vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(JSON.stringify({url:'data:audio/mp3;base64,SUQzAQ=='}))));
    const audio=await import('@/lib/urdu-tts-client');
    expect(await audio.requestUrduAudio('پانی')).toBe('data:audio/mp3;base64,SUQzAQ==');
    vi.resetModules();const restored=await import('@/lib/urdu-tts-client');
    expect(restored.getCachedUrduUrl('پانی')).toBe('data:audio/mp3;base64,SUQzAQ==');
  });
  it.each([503,429,502,401,500])('resolves without audio on HTTP %s, including repeated calls',async status=>{
    vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('{}',{status})));
    const audio=await import('@/lib/urdu-tts-client');
    await expect(audio.requestUrduAudio('پانی')).resolves.toBeUndefined();
    await expect(audio.requestUrduAudio('پانی')).resolves.toBeUndefined();
    expect(audio.isCloudAudioLoading('پانی')).toBe(false);
  });
  it('resolves without audio on rejected networks and isolates observer exceptions',async()=>{
    vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new TypeError('Network failure')));
    const audio=await import('@/lib/urdu-tts-client');
    audio.subscribeCloudAudio(()=>{throw new Error('Observer failure');});
    await expect(audio.requestUrduAudio('پانی')).resolves.toBeUndefined();
    expect(audio.isCloudAudioLoading('پانی')).toBe(false);
  });
  it('deduplicates concurrent calls and remembers URLs across reloads',async()=>{
    const fetcher=vi.fn().mockResolvedValue(new Response(JSON.stringify({url:'https://audio.example/clip.mp3'})));vi.stubGlobal('fetch',fetcher);
    const audio=await import('@/lib/urdu-tts-client');const a=audio.requestUrduAudio('پانی');const b=audio.requestUrduAudio('پانی');expect(a).toBe(b);await a;
    expect(await audio.requestUrduAudio('پانی')).toBe('https://audio.example/clip.mp3');expect(fetcher).toHaveBeenCalledTimes(1);
    vi.resetModules();const reloaded=await import('@/lib/urdu-tts-client');expect(await reloaded.requestUrduAudio('پانی')).toBe('https://audio.example/clip.mp3');expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('expires URLs before signed links expire',async()=>{
    const fetcher=vi.fn().mockImplementation(()=>Promise.resolve(new Response(JSON.stringify({url:'https://audio.example/clip.mp3'}))));vi.stubGlobal('fetch',fetcher);
    const audio=await import('@/lib/urdu-tts-client');await audio.requestUrduAudio('ب');const now=Date.now();const clock=vi.spyOn(Date,'now').mockReturnValue(now+6*24*60*60*1000+1);
    expect(audio.getCachedUrduUrl('ب')).toBeUndefined();await audio.requestUrduAudio('ب');expect(fetcher).toHaveBeenCalledTimes(2);clock.mockRestore();
  });
  it('prewarms only once and stops quietly if narration is unconfigured',async()=>{
    const fetcher=vi.fn().mockResolvedValue(new Response('{}',{status:503}));vi.stubGlobal('fetch',fetcher);
    const audio=await import('@/lib/urdu-tts-client');await expect(audio.prewarmUrduAudio()).resolves.toBeUndefined();await audio.prewarmUrduAudio();expect(fetcher).toHaveBeenCalledTimes(1);expect(audio.cloudAudioFailed('ا')).toBe(true);
  });
  it('clears loading and stops prewarm when fetching throws synchronously',async()=>{
    vi.stubGlobal('fetch',vi.fn(()=>{throw new Error('Network unavailable');}));
    const audio=await import('@/lib/urdu-tts-client');await expect(audio.prewarmUrduAudio()).resolves.toBeUndefined();
    expect(audio.isCloudAudioLoading('ا')).toBe(false);expect(audio.cloudAudioFailed('ا')).toBe(true);
  });
  it('rejects an empty response quietly and clears the loading state',async()=>{
    vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('null')));
    const audio=await import('@/lib/urdu-tts-client');await expect(audio.prewarmUrduAudio()).resolves.toBeUndefined();
    expect(audio.isCloudAudioLoading('ا')).toBe(false);
  });
});
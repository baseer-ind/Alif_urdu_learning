import {z} from 'zod';
import {audioHash, defaultUrduVoice, normalizeUrduVoice, seededAudioTexts, urduVoices, type UrduVoice} from './urdu-tts-content';

const schema = z.object({text: z.string().trim().min(1).max(500), voice: z.string().max(100).default(defaultUrduVoice).transform(normalizeUrduVoice).pipe(z.enum(urduVoices))}).strict();
const allowedTexts = new Set(seededAudioTexts);
const bucketName = 'urdu-audio';
const linkLifetime = 7 * 24 * 60 * 60;

// The no-account v1 exposes only fixed curriculum narration, never arbitrary
// paid synthesis or user uploads. No anonymous storage write policy is granted.
export async function handleUrduTts(request: Request): Promise<Response> {
  if (Number(request.headers.get('content-length') ?? 0) > 4096) return Response.json({error:'Request is too large.'}, {status:413});
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 4096) return Response.json({error:'Request is too large.'}, {status:413});
    body = JSON.parse(raw);
  } catch { return Response.json({error:'Send a JSON body with Urdu text.'}, {status:400}); }
  const parsed = schema.safeParse(body);
   if (!parsed.success) return Response.json({error:'Provide text and a supported Urdu Chirp 3 HD or Wavenet voice.'}, {status:400});
  const {text, voice} = parsed.data;
  if (!allowedTexts.has(text)) return Response.json({error:'Audio is available for the current Urdu curriculum only.'}, {status:403});
   let actualVoice:UrduVoice = voice;
   const audioResponse = (url:string) => Response.json({url, voice:actualVoice}, {headers:{'Cache-Control':'no-store'}});
  // Bound optional storage latency as well as its errors. A denied or stalled
  // bucket must never block synthesis; late storage rejections are consumed.
  const optionalStorage = async <T,>(work:()=>Promise<T>):Promise<T | undefined> => {
    let timer:ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([Promise.resolve().then(work), new Promise<undefined>(resolve=>{timer=setTimeout(()=>resolve(undefined),1500);})]);
    } catch {return undefined;} finally {clearTimeout(timer);}
  };
  let cache:{findUrl:()=>Promise<string | undefined>;save:(mp3:Uint8Array)=>Promise<string | undefined>} | undefined;
  await optionalStorage(async()=>{
    const {supabaseAdmin} = await import('@/integrations/supabase/client.server');
    const storage = supabaseAdmin.storage.from(bucketName);
     const audioPath = async () => `${await audioHash(text, actualVoice)}.mp3`;
     const signedUrl = async (path:string) => {
      const {data,error} = await storage.createSignedUrl(path,linkLifetime);
      if(error || !data)return undefined;
      const browserOrigin = import.meta.env['VITE_SUPABASE_URL'];
      return browserOrigin ? data.signedUrl.replace(new URL(data.signedUrl).origin,new URL(browserOrigin).origin) : data.signedUrl;
    };
    cache = {
      findUrl:async()=>{
         const path = await audioPath();
        const {data,error} = await storage.list('',{search:path,limit:1});
        if(error || !data?.some(file=>file.name===path))return undefined;
         return signedUrl(path);
      },
      save:async mp3=>{
         const path = await audioPath();
        const {error} = await storage.upload(path,mp3,{contentType:'audio/mpeg',cacheControl:'31536000',upsert:false});
        // A duplicate upload may be another request winning the race.
        if(error)return cache?.findUrl();
         return signedUrl(path);
      },
    };
  });
  if(cache){
    const cached = await optionalStorage(()=>cache ? cache.findUrl() : Promise.resolve(undefined));
    if(cached)return audioResponse(cached);
  }
  const key = process.env['GOOGLE_TTS_API_KEY'];
  if (!key) return Response.json({error:'Google Urdu narration is not configured yet.'}, {status:503});
  let response:Response;
   let message='Google could not generate Urdu narration.';
   const signal=AbortSignal.timeout(20000);
   const synthesize = (name:UrduVoice, minimal=false) => fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(key)}`, {
     method:'POST',headers:{'Content-Type':'application/json'},
     body:JSON.stringify({input:{text},voice:{languageCode:'ur-IN',name},audioConfig:minimal?{audioEncoding:'MP3'}:{audioEncoding:'MP3',speakingRate:0.9}}),
     signal,
   });
   const errorMessage = async (result:Response) => {
     try {const body=await result.clone().json();if(typeof body.error?.message==='string')return body.error.message as string;}catch{/* Invalid provider response. */}
     return 'Google could not generate Urdu narration.';
   };
  try {
     response = await synthesize(actualVoice);
     if(!response.ok && voice.includes('Chirp3-HD')){
       message=await errorMessage(response);
       if(response.status===400 && /speaking.?rate|audio.?config|unsupported.*(field|parameter)/i.test(message)){
         response=await synthesize(actualVoice,true);
         if(!response.ok)message=await errorMessage(response);
       }
       if(!response.ok && [400,404,503].includes(response.status) && /voice/i.test(message) && /not|unavailable|unsupported|invalid|reject|exist|found/i.test(message)){
         actualVoice='ur-IN-Wavenet-A';
         // Never store a Wavenet fallback under a Chirp voice hash.
         const cached=cache?await optionalStorage(()=>cache ? cache.findUrl() : Promise.resolve(undefined)):undefined;
         if(cached)return audioResponse(cached);
         response=await synthesize(actualVoice);
       }
     }
  } catch {return Response.json({error:'Urdu narration could not be reached. Please try again.'},{status:504});}
  if(!response.ok){
     message=await errorMessage(response);
    message=message.split(key).join('[redacted]').split(encodeURIComponent(key)).join('[redacted]');
    console.error(`Google TTS failed [${response.status}]: ${message}`);
    return Response.json({error:`Google narration failed (${response.status}): ${message}`,googleStatus:response.status},{status:response.status===429?429:502});
  }
  let mp3:Uint8Array;
  let base64:string;
  try {
    const result=await response.json();
    if(typeof result.audioContent!=='string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(result.audioContent) || result.audioContent.length>2800000)throw new Error('Invalid audio content');
    base64=result.audioContent;
    mp3=Uint8Array.from(atob(base64),char=>char.charCodeAt(0));
    if(!mp3.byteLength || mp3.byteLength>2*1024*1024)throw new Error('Invalid audio size');
  }catch{return Response.json({error:'Google returned invalid audio.'},{status:502});}
  if(cache){
    const stored=await optionalStorage(()=>cache ? cache.save(mp3) : Promise.resolve(undefined));
    if(stored)return audioResponse(stored);
  }
  return audioResponse(`data:audio/mp3;base64,${base64}`);
}

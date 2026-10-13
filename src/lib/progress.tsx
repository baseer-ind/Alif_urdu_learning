import {createContext,useContext,useEffect,useRef,useState,useSyncExternalStore,type ReactNode} from 'react';
import {toast} from 'sonner';
import {award,initialProgress,normalizeProgress,translate,text,type Language,type Progress,type Text} from './learning';
import {initializeUrduAudio,subscribeUrduAudio,getUrduAudioStatus,getServerAudioStatus,playUrduAudio,stopUrduAudio,primeUrduRecording} from './urdu-audio';
import {prewarmUrduAudio,requestUrduAudio,getCachedUrduUrl,cloudAudioFailed,isCloudAudioLoading,subscribeCloudAudio,getCloudAudioRevision,getServerCloudAudioRevision} from './urdu-tts-client';
const Context=createContext<{progress:Progress;ready:boolean;setProgress:React.Dispatch<React.SetStateAction<Progress>>;t:(s:Text)=>string;language:Language;reward:(task:string,xp:number,day?:number)=>void}|null>(null);
export function ProgressProvider({children}:{children:ReactNode}) {
 useEffect(()=>{try{initializeUrduAudio();}catch{/* Narration is optional. */}void Promise.resolve().then(()=>prewarmUrduAudio()).catch(()=>{});},[]);
 const [progress,setProgress]=useState<Progress>(initialProgress);const [ready,setReady]=useState(false);
 useEffect(()=>{try{const raw=localStorage.getItem('alif-progress-v1');if(raw)setProgress(normalizeProgress(JSON.parse(raw)));}catch{/* Keep the in-memory defaults when storage is unavailable. */}setReady(true);},[]);
 useEffect(()=>{if(ready){try{localStorage.setItem('alif-progress-v1',JSON.stringify(progress));}catch{/* Learning still works with in-memory progress. */}}},[progress,ready]);
 const language=progress.language??'en';
 const reward=(task:string,xp:number,day?:number)=>setProgress(p=>award(p,task,xp,day));
 return <Context.Provider value={{progress,ready,setProgress,t:s=>translate(s,language),language,reward}}>{children}</Context.Provider>;
}
export function useProgress(){const value=useContext(Context);if(!value)throw new Error('Progress provider missing');return value;}
export function useSpeech(){
 const {t}=useProgress();
 const audioStatus=useSyncExternalStore(subscribeUrduAudio,getUrduAudioStatus,getServerAudioStatus);
 useSyncExternalStore(subscribeCloudAudio,getCloudAudioRevision,getServerCloudAudioRevision);
 const attempt=useRef(0);
 useEffect(()=>{initializeUrduAudio();return ()=>{attempt.current++;stopUrduAudio();};},[]);
 const unavailableMessage=t(text("Audio isn't available on this device yet — real Urdu narration is coming soon.", 'इस डिवाइस पर अभी ऑडियो उपलब्ध नहीं है — असली उर्दू रिकॉर्डिंग जल्द आ रही है।', 'الصوت غير متاح على هذا الجهاز بعد — تسجيلات أردية حقيقية قادمة قريبًا.', 'এই ডিভাইসে অডিও এখনও উপলব্ধ নয় — আসল উর্দু রেকর্ডিং শীঘ্রই আসছে।', 'El audio aún no está disponible en este dispositivo — pronto habrá grabaciones reales en urdu.'));
 const loadingMessage=t(text('Audio voices are loading. Please tap Listen again in a moment.', 'आवाज़ें लोड हो रही हैं। थोड़ी देर में फिर सुनें पर टैप करें।', 'جارٍ تحميل الأصوات. اضغط على الاستماع مجددًا بعد قليل.', 'কণ্ঠ লোড হচ্ছে। একটু পরে আবার শুনুন চাপুন।', 'Las voces se están cargando. Vuelve a pulsar Escuchar en un momento.'));
 const notify=()=>{try{toast(unavailableMessage,{id:'urdu-audio',duration:4500});}catch{/* Optional notification. */}};
  const fallback=(value:string)=>{
   try {
    const result=playUrduAudio(value,undefined,notify);
   if(result==='unavailable')notify();
   else if(result==='loading')toast(loadingMessage,{id:'urdu-audio',duration:3500});
   } catch {notify();}
 };
  const speak=(value:string,audioUrl?:string)=>{
    const id=++attempt.current;
    try {
    const cached=audioUrl??getCachedUrduUrl(value);
    if(cached){playUrduAudio(value,cached,()=>fallback(value));return;}
    if(cloudAudioFailed(value)){fallback(value);return;}
    primeUrduRecording();
    void Promise.resolve().then(()=>requestUrduAudio(value)).then(url=>{
      if(id!==attempt.current)return;
      if(url)playUrduAudio(value,url,()=>fallback(value));
      else fallback(value);
    }).catch(()=>{if(id===attempt.current)fallback(value);});
    } catch {fallback(value);}
  };
  const audioUnavailable=(value:string)=>cloudAudioFailed(value)&&!getCachedUrduUrl(value)&&audioStatus==='unavailable';
  return {speak,isAudioLoading:isCloudAudioLoading,audioUnavailable,audioTitle:(value:string)=>audioUnavailable(value)?unavailableMessage:undefined};
}
export async function celebrate(){if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const {default:confetti}=await import('canvas-confetti');confetti({particleCount:90,spread:80,origin:{y:.65}});}

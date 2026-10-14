import {useEffect,useRef,useState} from 'react';
import {compareWords} from '@/lib/learning';

interface Recognition {lang:string;interimResults:boolean;continuous:boolean;onresult:((e:{results:{isFinal:boolean;0:{transcript:string}}[]})=>void)|null;onerror:((e:{error:string})=>void)|null;onend:(()=>void)|null;start:()=>void;stop:()=>void;abort:()=>void;}
type SpeechWindow=Window&{SpeechRecognition?:new()=>Recognition;webkitSpeechRecognition?:new()=>Recognition};

// Shared by the original exercise and stories: one recognition and alignment path.
export function useReadAloud(urdu:string,onPerfect:()=>void) {
 const [transcript,setTranscript]=useState<string|null>(null);
 const [supported,setSupported]=useState<boolean|null>(null);
 const [listening,setListening]=useState(false);
 const [error,setError]=useState(false);
 const ref=useRef<Recognition|null>(null);
 const active=useRef(false);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const clearTimer=()=>{if(timer.current){clearTimeout(timer.current);timer.current=null;}};
 const callback=useRef(onPerfect);callback.current=onPerfect;
 useEffect(()=>{const w=window as SpeechWindow;setSupported(Boolean(w.SpeechRecognition??w.webkitSpeechRecognition));return()=>{active.current=false;clearTimer();if(ref.current){ref.current.onend=null;ref.current.onerror=null;ref.current.onresult=null;ref.current.abort();}};},[]);
 const start=()=>{
  const w=window as SpeechWindow;const Constructor=w.SpeechRecognition??w.webkitSpeechRecognition;
  if(!Constructor){setSupported(false);return;}
  setTranscript(null);setError(false);active.current=true;let fellBack=false;let heard=false;
  const run=(lang:string)=>{
   const recognition=new Constructor();ref.current=recognition;recognition.lang=lang;recognition.interimResults=false;recognition.continuous=false;
   recognition.onresult=e=>{clearTimer();const spoken=Array.from(e.results).filter(r=>r.isFinal).map(r=>r[0].transcript).join(' ');heard=true;setTranscript(spoken);const scored=compareWords(urdu,spoken);if(scored.score===scored.total&&scored.extras.length===0)callback.current();setListening(false);active.current=false;};
   recognition.onerror=e=>{clearTimer();if(e.error==='language-not-supported'&&lang==='ur-PK'){fellBack=true;recognition.onend=null;recognition.onerror=null;recognition.abort();run('ur-IN');return;}active.current=false;setListening(false);if(e.error!=='aborted')setError(true);};
   recognition.onend=()=>{if(fellBack&&lang==='ur-PK')return;clearTimer();setListening(false);if(active.current&&!heard)setError(true);active.current=false;};
   try{recognition.start();setListening(true);clearTimer();timer.current=setTimeout(()=>{if(active.current&&!heard){try{recognition.stop();}catch{/* stop may throw if already ended */}}},10000);}catch{clearTimer();setListening(false);active.current=false;setError(true);}
  };run('ur-PK');
 };
 const stop=()=>{clearTimer();active.current=false;ref.current?.stop();setListening(false);};
 return {transcript,supported,listening,error,start,stop,result:transcript===null?null:compareWords(urdu,transcript),words:compareWords(urdu,'').words};
}
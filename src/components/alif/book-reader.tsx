import {useEffect,useMemo,useRef,useState} from 'react';
import {Link} from '@tanstack/react-router';
import {ArrowLeft,ArrowRight,Play,Square,Trophy,Volume2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Mascot} from '@/components/alif/shell';
import {StoryArt} from '@/lib/story-art';
import {useProgress,celebrate} from '@/lib/progress';
import {playUrduAudio} from '@/lib/urdu-audio';
import {requestUrduAudio} from '@/lib/urdu-tts-client';
import {award,localDate} from '@/lib/learning';
import {storyCopy,storyTask,bookPageTask,type Story} from '@/lib/stories';

type ReadLang = 'ur' | 'en';

// Strip punctuation for speaking / loose matching.
function clean(word:string, lang:ReadLang) {
  if (lang==='en') return word.toLowerCase().replace(/[^a-z0-9’']/g,'').trim();
  return word.replace(/[۔،!؟?.:؛“”"']/g,'').replace(/[ً-ْٰـ‌]/g,'').trim();
}
function speakEnglish(text:string) {
  if (typeof window==='undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    const v=window.speechSynthesis.getVoices().find(x=>/^en/i.test(x.lang));
    if (v) {u.voice=v;u.lang=v.lang;} else u.lang='en-US';
    u.rate=.9; window.speechSynthesis.speak(u);
  } catch {/* speech is optional */}
}

export function BookReader({story}:{story:Story}) {
  const book=story.book!;
  const {progress,setProgress,t}=useProgress();
  const [lang,setLang]=useState<ReadLang>('ur');
  const [page,setPage]=useState(0);
  const [cur,setCur]=useState(0);
  const [finished,setFinished]=useState(false);
  const [playing,setPlaying]=useState(false); // Listen karaoke in progress
  const playingRef=useRef(false);
  const audioRef=useRef<HTMLAudioElement|null>(null);
  const [reading,setReading]=useState(false); // read-along walk in progress
  const [speed,setSpeed]=useState<'slow'|'normal'|'fast'>('normal');
  const readRef=useRef<ReturnType<typeof setInterval>|null>(null);
  const STEP={slow:950,normal:650,fast:430}; // ms per word

  const current=book[page]!;
  const words=useMemo(()=>current.lines.flatMap(l=>(lang==='ur'?l.ur:l.en).split(/\s+/).filter(Boolean)),[current,lang]);
  const stopKaraoke=()=>{playingRef.current=false;setPlaying(false);try{audioRef.current?.pause();window.speechSynthesis?.cancel();}catch{/* audio is optional */}};
  const stopReadAlong=()=>{if(readRef.current){clearInterval(readRef.current);readRef.current=null;}setReading(false);};
  useEffect(()=>{setCur(0);stopKaraoke();stopReadAlong();},[page,lang]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(()=>()=>{stopKaraoke();stopReadAlong();},[]); // stop on unmount

  const completePage=(idx:number)=>setProgress(p=>{
    let next=award(p,bookPageTask(story.id,idx),20);
    const allDone=book.every((_,i)=>next.tasks.includes(bookPageTask(story.id,i)));
    if (allDone && !next.tasks.includes(storyTask(story.id))) {
      const date=localDate();
      next={...award(next,storyTask(story.id),0),dates:next.dates.includes(date)?next.dates:[...next.dates,date]};
    }
    return next;
  });

  const finishPage=()=>{
    setCur(words.length);
    completePage(page);
    if (page<book.length-1) setTimeout(()=>setPage(p=>p+1),800);
    else {void celebrate();setTimeout(()=>setFinished(true),600);}
  };

  const say=(word:string)=>{
    const c=clean(word,lang);
    if (!c) return;
    if (lang==='ur') playUrduAudio(c);
    else speakEnglish(c);
  };
  const tapWord=(i:number)=>{
    say(words[i] ?? '');
    if (i!==cur) return;
    if (i+1>=words.length) finishPage(); else setCur(i+1);
  };
  // Play one word and resolve when it finishes, so Listen can light up words in turn.
  const playWord=(word:string):Promise<void>=>new Promise(resolve=>{
    const c=clean(word,lang);
    if(!c){resolve();return;}
    let settled=false;const done=()=>{if(settled)return;settled=true;resolve();};
    if(lang==='en'){
      try{const u=new SpeechSynthesisUtterance(c);const v=window.speechSynthesis.getVoices().find(x=>/^en/i.test(x.lang));if(v){u.voice=v;u.lang=v.lang;}else u.lang='en-US';u.rate=.9;u.onend=done;u.onerror=done;window.speechSynthesis.speak(u);}catch{done();}
      setTimeout(done,2600);return;
    }
    requestUrduAudio(c).then(url=>{
      if(!playingRef.current){done();return;}
      if(!url){ // no cloud clip — use the device voice, else just pace the highlight
        try{const u=new SpeechSynthesisUtterance(c);u.lang='ur';u.rate=.85;u.onend=done;u.onerror=done;window.speechSynthesis.speak(u);setTimeout(done,1600);}catch{setTimeout(done,500);}
        return;
      }
      const a=audioRef.current ?? (audioRef.current=new Audio());
      a.onended=done;a.onerror=done;a.src=url;a.play().catch(done);
      setTimeout(done,4000); // safety cap per word
    }).catch(done);
  });

  // Listen = read the page to you, highlighting each word as it is spoken.
  const listenPage=async()=>{
    if(playingRef.current){stopKaraoke();return;}
    // Unlock audio inside the tap so mobile allows the chained clips.
    const a=audioRef.current ?? (audioRef.current=new Audio());
    try{a.play().catch(()=>{});}catch{/* unlock best-effort */}
    playingRef.current=true;setPlaying(true);
    for(let i=0;i<words.length;i++){
      if(!playingRef.current)break;
      setCur(i);
      await playWord(words[i]!);
    }
    if(playingRef.current)setCur(words.length);
    playingRef.current=false;setPlaying(false);
  };

  // Read along: walk the highlight word by word at the chosen pace, for the
  // learner to read with. Reliable on every device (no mic needed).
  const readAlong=()=>{
    if(reading){stopReadAlong();return;}
    stopKaraoke();
    let i=0;setCur(0);setReading(true);
    readRef.current=setInterval(()=>{
      i++;
      if(i>words.length-1){stopReadAlong();finishPage();return;}
      setCur(i);
    },STEP[speed]);
  };

  if (finished) return (
    <div className="story-completion">
      <Trophy className="text-yellow" size={48}/><Mascot/>
      <h1>{t(storyCopy.done)}</h1><h2>{t(story.title)}</h2>
      <strong className="text-purple">{book.length*20} XP</strong>
      <div className="story-completion-actions">
        <Button asChild variant="learn"><Link to="/stories"><ArrowLeft/>{t(storyCopy.back)}</Link></Button>
        <Button variant="outline" onClick={()=>{setPage(0);setFinished(false);}}>{t(storyCopy.readAgain)}</Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="book-topbar">
        <Button asChild variant="ghost" className="story-back"><Link to="/stories"><ArrowLeft/>{t(storyCopy.back)}</Link></Button>
        <div className="book-langtoggle" role="group" aria-label="Reading language">
          <Button size="sm" variant={lang==='ur'?'default':'ghost'} aria-pressed={lang==='ur'} className="urdu" onClick={()=>setLang('ur')}>اردو</Button>
          <Button size="sm" variant={lang==='en'?'default':'ghost'} aria-pressed={lang==='en'} onClick={()=>setLang('en')}>English</Button>
        </div>
      </div>

      <div className="book-heading"><h1 className="urdu" lang="ur">{story.titleUrdu}</h1><p>{t(story.title)}</p></div>

      <div className="book-spread">
        <div className="book-art"><span className="book-page-chip">📖 {page+1} / {book.length}</span><StoryArt art={current.art} className="book-art-svg"/></div>
        <div className="book-read">
          <div className={`book-lines ${lang==='en'?'en':'ur'}`} lang={lang} dir={lang==='ur'?'rtl':'ltr'}>
            {words.map((w,i)=>(
              <button type="button" key={`${page}-${lang}-${i}`} className={`book-word ${i<cur?'done':''} ${i===cur?'current':''}`} onClick={()=>tapWord(i)}>{w}</button>
            ))}
          </div>
          <div className="book-controls">
            <Button variant="outline" onClick={listenPage} aria-pressed={playing} aria-label="Listen to page">{playing?<Square size={17}/>:<Volume2 size={17}/>}{playing?'Stop':'Listen'}</Button>
            <Button variant="learn" onClick={readAlong} aria-pressed={reading} aria-label="Read along">{reading?<Square size={17}/>:<Play size={17}/>}{reading?'Stop':'Read along'}</Button>
          </div>
          <div className="book-speed" role="group" aria-label="Reading pace">
            <span>Pace</span>
            {(['slow','normal','fast'] as const).map(s=>(
              <button key={s} type="button" className={`book-speed-btn ${speed===s?'on':''}`} aria-pressed={speed===s} onClick={()=>setSpeed(s)}>{s==='slow'?'Slow':s==='normal'?'Normal':'Fast'}</button>
            ))}
          </div>
          <p className="book-hint">Tap any word to hear it. Tap <strong>Read along</strong> and the words light up at your pace.</p>
          <div className="book-nav">
            <Button variant="outline" aria-label={t(storyCopy.previous)} disabled={page===0} onClick={()=>setPage(p=>p-1)}><ArrowLeft/></Button>
            <div className="book-dots">{book.map((_,i)=>(
              <button key={i} className={`book-dot ${i===page?'on':''} ${progress.tasks.includes(bookPageTask(story.id,i))?'read':''}`} aria-label={`Page ${i+1}`} onClick={()=>setPage(i)}/>
            ))}</div>
            <Button variant="outline" aria-label={t(storyCopy.next)} disabled={page===book.length-1} onClick={()=>setPage(p=>p+1)}><ArrowRight/></Button>
          </div>
        </div>
      </div>
    </>
  );
}

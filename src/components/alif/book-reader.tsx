import {useEffect,useMemo,useState} from 'react';
import {Link} from '@tanstack/react-router';
import {ArrowLeft,ArrowRight,Mic,Square,Trophy,Volume2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Mascot} from '@/components/alif/shell';
import {StoryArt} from '@/lib/story-art';
import {useProgress,celebrate} from '@/lib/progress';
import {useReadAloud} from '@/hooks/use-read-aloud';
import {playUrduAudio} from '@/lib/urdu-audio';
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

  const current=book[page]!;
  const words=useMemo(()=>current.lines.flatMap(l=>(lang==='ur'?l.ur:l.en).split(/\s+/).filter(Boolean)),[current,lang]);
  useEffect(()=>{setCur(0);},[page,lang]);

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
  const listenPage=()=>{
    const full=current.lines.map(l=>lang==='ur'?l.ur:l.en).join(' ');
    if (lang==='ur') playUrduAudio(clean(full,'ur')); else speakEnglish(full.replace(/[^a-zA-Z0-9 ,.!?']/g,' '));
  };

  // Mic read-along (Urdu only — reuses the app's tested recognition + alignment).
  const pageUrdu=current.lines.map(l=>l.ur).join(' ');
  const {supported,listening,error,start,stop}=useReadAloud(pageUrdu,finishPage);

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
            <Button variant="outline" onClick={listenPage} aria-label="Listen to page"><Volume2 size={17}/>Listen</Button>
            {supported!==false
              ? <Button variant="learn" onClick={listening?stop:start} aria-pressed={listening} aria-label="Read aloud">{listening?<Square size={17}/>:<Mic size={17}/>}{listening?'Listening…':'Read aloud'}</Button>
              : <span className="book-nomic">🎤 Chrome only</span>}
          </div>
          {error && <p className="book-hint">Didn’t catch that — tap each word to read along.</p>}
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

import {useState,type ReactNode} from 'react';
import {Mic,Square,RotateCcw,Eye} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {ListenButton} from './listen-button';
import {useReadAloud} from '@/hooks/use-read-aloud';
import {useProgress} from '@/lib/progress';
import {copy,type Text} from '@/lib/learning';

export function ReadAloudPractice({sentence,onPerfect,revealMeaning=false,header}:{sentence:{urdu:string;roman:string;meaning:Text};onPerfect:()=>void;revealMeaning?:boolean;header?:(listening:boolean)=>ReactNode}) {
 const {t}=useProgress();const [revealed,setRevealed]=useState(false);
 const {transcript,supported,listening,error,start,stop,result,words}=useReadAloud(sentence.urdu,onPerfect);
 return <><div className="reading-stage">
  {header?.(listening)}
  <div className="sentence-words">{words.map((word,i)=><ListenButton text={word} showIcon={false} variant="ghost" key={`${word}-${i}`} className={`sentence-word urdu ${result?(result.correct[i]?'correct':'incorrect'):''}`} title={t(copy.listen)} aria-label={`${t(copy.listen)}: ${word}`}>{word}</ListenButton>)}</div>
  <p className="sentence-roman" dir="ltr">{sentence.roman}</p>
  <div className={revealMeaning?'story-meaning':''}>{!revealMeaning||revealed?<p className="sentence-meaning">{t(sentence.meaning)}</p>:<Button variant="ghost" onClick={()=>setRevealed(true)}><Eye/>{t(copy.reveal)}</Button>}</div>
  <ListenButton text={sentence.urdu} variant="ghost" title={t(copy.listen)}>{t(copy.listen)}</ListenButton>
  {result&&<><div className="speech-score" role="status">{result.score} / {result.total} {t(copy.wordsCorrect)}</div>{result.extras.length>0&&<div className="extras">{t(copy.extra)}: <span className="urdu">{result.extras.join(' ')}</span></div>}<p className="urdu">{transcript}</p></>}
  <div className="mic-area"><Button variant="learn" className={`mic-button ${listening?'recording':''}`} aria-label={t(listening?copy.stop:copy.mic)} onClick={listening?stop:start} disabled={supported===false}>{listening?<Square/>:<Mic/>}</Button><span className="mic-label">{t(listening?copy.listening:copy.mic)}</span>{result&&<Button variant="outline" onClick={start} disabled={listening||supported===false}><RotateCcw/>{t(copy.retry)}</Button>}</div>
 </div>{supported===false&&<div className="speech-message" role="status">{t(copy.unsupported)}</div>}{error&&<div className="speech-message" role="alert">{t(copy.speechError)}<Button variant="ghost" onClick={start}><RotateCcw/>{t(copy.retry)}</Button></div>}<p className="speech-connectivity">{t(copy.voiceNote)}</p></>;
}
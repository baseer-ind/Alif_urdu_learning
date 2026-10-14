import {createFileRoute,Link} from '@tanstack/react-router';
import {useState} from 'react';
import {ArrowLeft,ArrowRight,Eye,CheckCircle2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {ListenButton} from '@/components/alif/listen-button';
import {Mascot,PageTitle} from '@/components/alif/shell';
import {useProgress,celebrate} from '@/lib/progress';
import {copy,text,getLetter,totalDays,unlocked,type Text} from '@/lib/learning';
import {dayDef,type Day,type Item} from '@/lib/curriculum';
export const Route=createFileRoute('/lesson/$day')({head:({params})=>({meta:[{title:`Day ${params.day} — Learn Urdu with Alif`},{name:'description',content:`Day ${params.day} of your 30-day Alif challenge: letters, words and sentences with sound.`},{property:'og:title',content:`Day ${params.day} — Learn Urdu with Alif`},{property:'og:description',content:'Listen, learn and check what you know, one small step a day.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:Lesson});
function Lesson(){const{day:dayParam}=Route.useParams();return <LessonSwitch key={dayParam} day={Number(dayParam)}/>;}
function LessonSwitch({day}:{day:number}){
 const{progress,t}=useProgress();const def=dayDef(day);
 if(!progress.language||!def||!unlocked(day,progress))return <div className="onboarding"><Mascot/><PageTitle title={t(day>totalDays?copy.soon:copy.dayLimit)}/><Button asChild variant="learn"><Link to={!progress.language?'/welcome':'/'}>{t(copy.back)}<ArrowLeft/></Link></Button></div>;
 return def.kind==='letters'?<LetterLesson day={day} indices={def.letters}/>:<GenericLesson day={day} def={def}/>;
}
// Shared finish: 50 XP once, plus the weekly bonus on the fourth completed day.
function useFinish(day:number){const{progress,reward}=useProgress();const already=progress.tasks.includes(`lesson-${day}`);return{already,finish:()=>{reward(`lesson-${day}`,50,day);if(progress.completed.length===4&&!already)reward('week-goal',150);void celebrate();}};}
function DoneScreen({day}:{day:number}){const{t}=useProgress();const{already}=useFinish(day);return <div className="onboarding"><Mascot/><PageTitle title={t(copy.lessonDone)} subtitle={t(copy.goal)}/><div className="result-xp">{t(copy.earned)} +{already?0:50} XP</div><div className="result-level"><CheckCircle2 className="inline"/> {t(copy.day)} {day} · {t(copy.complete)}</div><Button asChild variant="learn" size="lg"><Link to="/">{t(copy.back)}<ArrowRight/></Link></Button></div>;}

// Days 1-13: meet the alphabet.
function LetterLesson({day,indices}:{day:number;indices:number[]}){
 const{t}=useProgress();const[step,setStep]=useState(0);const[revealed,setRevealed]=useState(false);const[quiz,setQuiz]=useState(false);const[selected,setSelected]=useState<number|null>(null);const[checked,setChecked]=useState(false);const[done,setDone]=useState(false);
 const valid=indices.filter(index=>getLetterSafe(index));const{already,finish}=useFinish(day);
 if(!valid.length)return <DoneScreen day={day}/>;
 const currentIndex=valid[step]??0;const item=getLetter(currentIndex);const correct=selected===0;const next=()=>{if(step===valid.length-1){finish();setDone(true);}else{setStep(v=>v+1);setQuiz(false);setSelected(null);setChecked(false);setRevealed(false);}};
 if(done)return <DoneScreen day={day}/>;
 return <div className="lesson-container"><div className="lesson-top"><Button asChild variant="ghost" size="icon" aria-label={t(copy.back)}><Link to="/"><ArrowLeft/></Link></Button><div className="progress-track"><span className={`lesson-progress lesson-${valid.length}-${step+1}`}/></div><strong>{step+1} / {valid.length}</strong></div><PageTitle title={`${t(copy.day)} ${day} · ${t(copy.sounds)}`}/><div className="lesson-guide"><Mascot/><div className="speech-bubble">{quiz?t(text(`Which letter makes the “${item.sound}” sound?`,`“${item.sound}” की आवाज़ कौन-सा अक्षर बनाता है?`,`أيّ حرف يصدر صوت «${item.sound}»؟`,`কোন অক্ষরের ধ্বনি “${item.sound}”?`,`¿Qué letra tiene el sonido «${item.sound}»?`)):t(text(`Meet ${item.name}! Listen to its sound, then discover a new word.`,`${item.name} से मिलें! उसकी आवाज़ सुनें, फिर नया शब्द सीखें।`,`تعرّف على ${item.name}! استمع إلى صوته ثم اكتشف كلمة جديدة.`,`${item.name} শিখুন! ধ্বনি শুনে নতুন শব্দ জানুন।`,`¡Conoce ${item.name}! Escucha su sonido y descubre una palabra nueva.`))}</div></div>{quiz?<div className="question-card"><div className="answers">{[currentIndex,(currentIndex+2)%38,(currentIndex+4)%38].map((n,qi)=><Button variant="outline" key={qi} className={`answer-button urdu ${selected===qi?'selected':''} ${checked&&selected===qi?(correct?'answer-correct':'answer-wrong'):''}`} onClick={()=>{setSelected(qi);setChecked(false);}}>{getLetter(n).glyph}</Button>)}</div>{checked&&<div className={`feedback ${correct?'good':''}`}>{t(correct?copy.correct:copy.wrong)}</div>}</div>:<div className="letter-stage"><span className="letter-glyph urdu">{item.glyph}</span><div className="letter-caption">{item.name}<span>{item.sound}</span><ListenButton text={item.glyph} size="icon" variant="secondary" aria-label={t(copy.listen)} title={t(copy.listen)}/></div><div className="word-example"><span className="urdu">{item.word}</span><ListenButton text={item.word} variant="ghost" title={t(copy.listen)}>{item.roman}</ListenButton>{revealed?<p>{t(item.meaning)}</p>:<Button variant="secondary" className="reveal-button" onClick={()=>setRevealed(true)}><Eye/>{t(copy.reveal)}</Button>}</div></div>}<div className="lesson-actions"><ListenButton text={quiz?item.glyph:item.word} variant="outline" title={t(copy.listen)}>{t(copy.listen)}</ListenButton>{!quiz?<Button variant="learn" onClick={()=>{setQuiz(true);setSelected(null);}}>{t(copy.next)}<ArrowRight/></Button>:checked&&correct?<Button variant="learn" onClick={next}>{t(copy.next)}<ArrowRight/></Button>:<Button variant="learn" disabled={selected===null} onClick={()=>setChecked(true)}>{t(copy.check)}<CheckCircle2/></Button>}</div></div>;
}
function getLetterSafe(index:number){try{return getLetter(index);}catch{return undefined;}}

// Days 14-30: joining, vowel marks, words and sentences — one reusable flow.
function GenericLesson({day,def}:{day:number;def:Extract<Day,{kind:'build'|'marks'|'words'|'sentence'}>}){
 const{t}=useProgress();const items=def.items;const[step,setStep]=useState(0);const[revealed,setRevealed]=useState(false);const[quiz,setQuiz]=useState(false);const[selected,setSelected]=useState<number|null>(null);const[checked,setChecked]=useState(false);const[done,setDone]=useState(false);
 const{finish}=useFinish(day);
 if(!items.length)return <DoneScreen day={day}/>;
 const item=items[step] as Item;const options=buildOptions(items,step);const correct=options[selected??-1]?.correct===true;
 const next=()=>{if(step===items.length-1){finish();setDone(true);}else{setStep(v=>v+1);setQuiz(false);setSelected(null);setChecked(false);setRevealed(false);}};
 if(done)return <DoneScreen day={day}/>;
 const prompt:Text=def.kind==='marks'?text('What sound is this?','यह कौन-सी आवाज़ है?','ما هذا الصوت؟','এটি কোন ধ্বনি?','¿Qué sonido es este?'):def.kind==='build'?text('What word is this?','यह कौन-सा शब्द है?','ما هذه الكلمة؟','এটি কোন শব্দ?','¿Qué palabra es esta?'):text('What does this mean?','इसका क्या अर्थ है?','ماذا يعني هذا؟','এর অর্থ কী?','¿Qué significa esto?');
 const isSentence=def.kind==='sentence';
 return <div className="lesson-container"><div className="lesson-top"><Button asChild variant="ghost" size="icon" aria-label={t(copy.back)}><Link to="/"><ArrowLeft/></Link></Button><div className="progress-track"><span className={`lesson-progress lesson-${items.length}-${step+1}`}/></div><strong>{step+1} / {items.length}</strong></div><PageTitle title={`${t(copy.day)} ${day} · ${t(def.title)}`}/><div className="lesson-guide"><Mascot/><div className="speech-bubble">{quiz?t(prompt):t(def.intro)}</div></div>{quiz?<div className="question-card"><div className={`item-quiz-main urdu ${isSentence?'sentence':''}`}>{item.main}</div><div className="answers answers-stack">{options.map((opt,qi)=><Button variant="outline" key={qi} className={`answer-button answer-text ${selected===qi?'selected':''} ${checked&&selected===qi?(opt.correct?'answer-correct':'answer-wrong'):''}`} onClick={()=>{setSelected(qi);setChecked(false);}}>{t(opt.gloss)}</Button>)}</div>{checked&&<div className={`feedback ${correct?'good':''}`}>{t(correct?copy.correct:copy.wrong)}</div>}</div>:<div className="item-stage">{item.parts&&<div className="item-parts" dir="rtl">{item.parts.map((part,pi)=><span key={pi} className="item-part urdu">{part}</span>)}</div>}<div className={`item-main urdu ${isSentence?'sentence':''}`}>{item.main}</div><div className="item-caption"><span className="item-sub">{item.sub}</span><ListenButton text={item.main} size="icon" variant="secondary" aria-label={t(copy.listen)} title={t(copy.listen)}/></div>{revealed?<p className="item-gloss">{t(item.gloss)}</p>:<Button variant="secondary" className="reveal-button" onClick={()=>setRevealed(true)}><Eye/>{t(copy.reveal)}</Button>}</div>}<div className="lesson-actions"><ListenButton text={item.main} variant="outline" title={t(copy.listen)}>{t(copy.listen)}</ListenButton>{!quiz?<Button variant="learn" onClick={()=>{setQuiz(true);setSelected(null);}}>{t(copy.next)}<ArrowRight/></Button>:checked&&correct?<Button variant="learn" onClick={next}>{t(copy.next)}<ArrowRight/></Button>:<Button variant="learn" disabled={selected===null} onClick={()=>setChecked(true)}>{t(copy.check)}<CheckCircle2/></Button>}</div></div>;
}
// Correct gloss plus up to two distractors from the day's other items, correct slot rotates per step.
function buildOptions(items:Item[],step:number):{gloss:Text;correct:boolean}[]{
 const current=items[step] as Item;const others=items.filter((_,idx)=>idx!==step);
 const unique:Item[]=[];for(const d of [others[step%others.length],others[(step+1)%others.length]]){if(d&&d!==current&&!unique.includes(d))unique.push(d);}
 const distractors=unique.slice(0,2).map(o=>({gloss:o.gloss,correct:false}));
 const correctOpt={gloss:current.gloss,correct:true};
 const size=distractors.length+1;const pos=step%size;const ordered:{gloss:Text;correct:boolean}[]=[];let r=0;
 for(let k=0;k<size;k++)ordered.push(k===pos?correctOpt:(distractors[r++] as {gloss:Text;correct:boolean}));
 return ordered;
}

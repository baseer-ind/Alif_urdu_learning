import {createFileRoute} from '@tanstack/react-router';
import {useState} from 'react';
import {Mic} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {ReadAloudPractice} from '@/components/alif/read-aloud-practice';
import {Mascot,PageTitle} from '@/components/alif/shell';
import {useProgress,celebrate} from '@/lib/progress';
import {copy,sentences} from '@/lib/learning';
export const Route=createFileRoute('/read')({head:()=>({meta:[{title:'Read Urdu aloud — Alif'},{name:'description',content:'Read Urdu sentences aloud and see word-by-word feedback.'},{property:'og:title',content:'Find your Urdu voice — Alif'},{property:'og:description',content:'Listen to Urdu words, read aloud, and improve with friendly feedback.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:Read});
function Read(){const{t,reward,progress}=useProgress();const[index,setIndex]=useState(0);const sentence=sentences[index];if(!sentence)return <PageTitle title={t(copy.soon)}/>;return <><PageTitle title={t(copy.read)} subtitle={t(copy.readSub)}/><div className="reading-layout"><div><ReadAloudPractice key={index} sentence={sentence} onPerfect={()=>{if(!progress.tasks.includes(`read-${index}`)){reward(`read-${index}`,20);void celebrate();}}} header={listening=><div className="sentence-tabs">{sentences.map((s,i)=><Button key={s.urdu} variant="outline" className={`sentence-tab ${index===i?'active':''}`} disabled={listening} aria-label={`${t(copy.read)} ${i+1}`} onClick={()=>setIndex(i)}>{i+1}</Button>)}</div>}/></div><aside className="reading-mascot"><Mascot/><div className="friend-bubble">{t(copy.alifSays)}</div><div className="badge-preview install-button"><Mic className="text-purple" size={27}/><h3>+20 XP</h3><p>{t(copy.goal)}</p></div></aside></div></>;}

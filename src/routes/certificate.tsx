import {createFileRoute,Link} from '@tanstack/react-router';
import {useEffect} from 'react';
import {Award,Printer,ArrowLeft,Lock,Star,Zap} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Mascot,PageTitle,Logo} from '@/components/alif/shell';
import {useProgress,celebrate} from '@/lib/progress';
import {copy,challengeComplete,certificateTask,lessons,levelFor,localDate} from '@/lib/learning';
import {starsFor} from '@/lib/rewards';
export const Route=createFileRoute('/certificate')({head:()=>({meta:[{title:'Your Urdu certificate — Alif'},{name:'description',content:'Earn and print your certificate for completing the 30-day Urdu reading challenge with Alif.'},{property:'og:title',content:'Your Urdu certificate — Alif'},{property:'og:description',content:'A printable certificate celebrating your 30-day Urdu journey.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:Certificate});
function Certificate(){
 const {progress,setProgress,t}=useProgress();
 const complete=challengeComplete(progress);
 // Stamp the finish date once, the moment the challenge is complete, and celebrate.
 useEffect(()=>{if(complete&&!progress.challengeDate){setProgress(p=>p.challengeDate?p:{...p,challengeDate:localDate(),tasks:p.tasks.includes(certificateTask)?p.tasks:[...p.tasks,certificateTask]});void celebrate();}},[complete,progress.challengeDate,setProgress]);
 if(!progress.language)return <div className="onboarding"><Mascot/><PageTitle title={t(copy.certificateSub)}/><Button asChild variant="learn"><Link to="/welcome">{t(copy.back)}<ArrowLeft/></Link></Button></div>;
 if(!complete){const total=lessons.length;return <div className="certificate-locked"><Mascot/><PageTitle title={t(copy.certificate)} subtitle={t(copy.certificateLocked)}/><div className="certificate-lock-badge"><Lock size={34}/></div><div className="certificate-progress"><div className="progress-track"><span style={{width:`${Math.round((progress.completed.length/total)*100)}%`}}/></div><strong>{progress.completed.length} / {total} {t(copy.day).toLowerCase()}</strong></div><Button asChild variant="learn" size="lg"><Link to="/lesson/$day" params={{day:String(Array.from({length:total},(_,i)=>i+1).find(d=>!progress.completed.includes(d))??total)}}>{t(copy.continue)}<ArrowLeft/></Link></Button></div>;}
 const awardedOn=progress.challengeDate??localDate();
 const prettyDate=new Date(`${awardedOn}T12:00:00`).toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'});
 return <>
  <div className="certificate-controls">
   <PageTitle title={t(copy.certificate)} subtitle={t(copy.certificateReady)}/>
   <div className="certificate-name-field">
    <label htmlFor="cert-name">{t(copy.yourName)}</label>
    <input id="cert-name" className="certificate-name-input" value={progress.name??''} placeholder={t(copy.namePlaceholder)} maxLength={48} onChange={e=>setProgress(p=>({...p,name:e.target.value}))}/>
   </div>
   <Button variant="learn" size="lg" onClick={()=>window.print()}><Printer/>{t(copy.printCertificate)}</Button>
  </div>
  <div className="certificate-paper">
   <div className="certificate-border">
    <div className="certificate-head"><Logo/><span className="certificate-ribbon"><Award size={30}/></span></div>
    <h2 className="certificate-h2">{t(copy.certificateTitle)}</h2>
    <p className="certificate-present">{t(copy.certificatePresented)}</p>
    <div className="certificate-name">{progress.name?.trim()||t(copy.learner)}</div>
    <p className="certificate-reason">{t(copy.certificateFor)}</p>
    <div className="certificate-stats"><span><Zap size={16}/>{progress.xp} XP</span><span><Star size={16}/>{starsFor(progress.xp)}</span><span>{t(copy.level)} {levelFor(progress.xp)}</span></div>
    <div className="certificate-foot"><div className="certificate-sign"><Mascot/><span>Alif</span><small>{t(copy.friend)}</small></div><div className="certificate-date"><strong>{prettyDate}</strong><small>{t(copy.date)}</small></div></div>
   </div>
  </div>
 </>;
}

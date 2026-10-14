import {createFileRoute,Link} from '@tanstack/react-router';
import {Star,Trophy,Lock,Check,BookOpen,Flame,Award,ArrowRight} from 'lucide-react';
import {PageTitle,Mascot} from '@/components/alif/shell';
import {useProgress} from '@/lib/progress';
import {copy,challengeComplete} from '@/lib/learning';
import {rewardsCopy,starsFor,finishedStoryCount,milestones} from '@/lib/rewards';

export const Route=createFileRoute('/rewards')({head:()=>({meta:[{title:'Stars and reading rewards — Alif'},{name:'description',content:'Celebrate your Urdu reading journey with stars, badges and storybook milestones.'},{property:'og:title',content:'Stars and reading rewards — Alif'},{property:'og:description',content:'Your earned stars and Urdu learning achievements with Alif.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:Rewards});
function Rewards(){const {progress,t}=useProgress();const cert=challengeComplete(progress);return <>
 <PageTitle title={t(rewardsCopy.rewards)} subtitle={t(copy.goal)}/>
 <section className="rewards-banner"><div><span className="reward-eyebrow"><Star size={19}/>{t(rewardsCopy.yourStars)}</span><strong>{starsFor(progress.xp)}</strong><p><BookOpen size={17}/>{finishedStoryCount(progress)} {t(rewardsCopy.storiesDone)}</p></div><Mascot/></section>
 <Link to="/certificate" className={`certificate-link-card ${cert?'ready':'pending'}`}><span className="certificate-link-icon">{cert?<Award size={26}/>:<Lock size={22}/>}</span><div><strong>{t(cert?copy.challengeDone:copy.certificate)}</strong><p>{t(cert?copy.viewCertificate:copy.certificateSub)}</p></div><ArrowRight size={19}/></Link>
 <section className="milestones-section"><h2>{t(rewardsCopy.milestones)}</h2><div className="milestone-grid">{milestones(progress).map((badge,i)=>{const Icon=badge.id==='streak'?Flame:badge.id.startsWith('level')?BookOpen:Trophy;return <article key={badge.id} className={`milestone-item milestone-tone-${i%4} ${badge.earned?'earned':'locked'}`}><span className="milestone-status">{badge.earned?<Check size={17}/>:<Lock size={15}/>}</span><span className="milestone-medallion"><Icon size={35}/></span><h3>{t(badge.title)}</h3><p>{t(badge.earned?copy.complete:copy.badgeLocked)}</p><span className="milestone-count">{badge.current} / {badge.target||'—'}</span></article>;})}</div></section>
 </>;}
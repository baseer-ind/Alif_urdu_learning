import {createFileRoute,Link} from '@tanstack/react-router';
import {useState} from 'react';
import {ArrowRight,BookOpen,Check,CheckCircle2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Mascot,PageTitle} from '@/components/alif/shell';
import {StoryCover} from '@/components/alif/story-cover';
import {useProgress} from '@/lib/progress';
import {copy} from '@/lib/learning';
import {stories,storyCopy,storyTask,completedStorySentences} from '@/lib/stories';

export const Route=createFileRoute('/stories')({head:()=>({meta:[{title:'Urdu story library — Alif'},{name:'description',content:'Read simple Urdu storybooks with Alif, sentence by sentence, with pronunciation feedback.'},{property:'og:title',content:'Urdu story library — Alif'},{property:'og:description',content:'Discover the thirsty crow, the honest woodcutter, the lion and the mouse, and my family.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:Stories});
function Stories(){
 const {t,progress}=useProgress();const [filter,setFilter]=useState<'all'|'beginner'|'intermediate'>('all');
 const visible=stories.filter(story=>filter==='all'||story.level===filter);
 return <><div className="story-library-heading"><PageTitle title={t(storyCopy.stories)} subtitle={t(storyCopy.subtitle)}/><div className="story-library-count"><BookOpen size={18}/>{stories.length}</div></div>
 <div className="story-filters" role="group" aria-label={t(copy.level)}>{(['all','beginner','intermediate'] as const).map(level=><Button key={level} variant={filter===level?'default':'outline'} aria-pressed={filter===level} onClick={()=>setFilter(level)}>{filter===level&&<Check size={15}/>} {t(level==='all'?storyCopy.all:copy[level])}</Button>)}</div>
 <div className="story-grid">{visible.map(story=>{const done=progress.tasks.includes(storyTask(story.id));const count=completedStorySentences(story,progress);return <Link to="/story/$id" params={{id:story.id}} key={story.id} className={`story-card story-tone-${story.cover}`}><div className="story-card-cover"><StoryCover story={story}/><span className="story-level">{t(copy[story.level])}</span>{done&&<span className="story-done" aria-label={t(copy.complete)}><CheckCircle2 size={20}/></span>}</div><div className="story-card-body"><h2 className="urdu" lang="ur">{story.titleUrdu}</h2><h3>{t(story.title)}</h3><p>{t(story.description)}</p><div className="story-card-footer"><span><BookOpen size={14}/>{story.sentences.length} {t(storyCopy.sentences)}{count>0&&<small>{done?t(copy.complete):`${count} / ${story.sentences.length}`}</small>}</span><ArrowRight size={19}/></div></div></Link>;})}</div>
 {visible.length===0&&<div className="story-empty"><BookOpen size={35}/><p>{t(storyCopy.noStories)}</p></div>}
 <div className="story-library-friend"><Mascot/><p>{t(storyCopy.friend)}</p></div></>;
}
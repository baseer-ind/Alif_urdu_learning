import {createFileRoute,Link,notFound} from '@tanstack/react-router';
import {useState} from 'react';
import {ArrowLeft,ArrowRight,CheckCircle2,Trophy} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Mascot} from '@/components/alif/shell';
import {StoryCover} from '@/components/alif/story-cover';
import {ReadAloudPractice} from '@/components/alif/read-aloud-practice';
import {BookReader} from '@/components/alif/book-reader';
import {useProgress,celebrate} from '@/lib/progress';
import {copy} from '@/lib/learning';
import {stories,storyCopy,storyTask,sentenceTask,storySentenceXp,completeStorySentence,completedStorySentences,type Story} from '@/lib/stories';

export const Route=createFileRoute('/story/$id')({
 loader:({params})=>{const story=stories.find(s=>s.id===params.id);if(!story?.sentences?.length)throw notFound();return story;},
 head:({loaderData})=>{const title=loaderData?`${loaderData.title.en} — Urdu story with Alif`:'Story not found — Alif';const description=loaderData?`${loaderData.description.en} Read in Urdu with sentence-by-sentence pronunciation feedback.`:'This Urdu story could not be found.';return {meta:[{title},{name:'description',content:description},{property:'og:title',content:title},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'},...(!loaderData?[{name:'robots',content:'noindex'}]:[])]};},
 component:StoryReader,
 notFoundComponent:StoryNotFound,
});
function StoryNotFound(){const {t}=useProgress();return <div className="story-empty"><h1>{t(storyCopy.noStories)}</h1><Button asChild variant="outline"><Link to="/stories">{t(storyCopy.back)}</Link></Button></div>;}
function StoryReader(){const story=Route.useLoaderData();if(!story?.sentences?.length)return <StoryNotFound/>;if(story.book?.length)return <BookReader key={story.id} story={story}/>;return <Reader key={story.id} story={story}/>;}
function Reader({story}:{story:Story}){
 const {progress,setProgress,t}=useProgress();
 const [index,setIndex]=useState(0);const [finished,setFinished]=useState(false);
 const sentence=story.sentences[index];if(!sentence)return <StoryNotFound/>;
 const count=completedStorySentences(story,progress);
 const earned=progress.tasks.includes(sentenceTask(story.id,index));
 const onPerfect=()=>{
  const next=completeStorySentence(progress,story,index);
  const newlyComplete=!progress.tasks.includes(storyTask(story.id))&&next.tasks.includes(storyTask(story.id));
  setProgress(p=>completeStorySentence(p,story,index));
  if(newlyComplete){void celebrate();if(index===story.sentences.length-1)setFinished(true);}
 };
 if(finished)return <div className="story-completion"><Trophy className="text-yellow" size={48}/><Mascot/><h1>{t(storyCopy.done)}</h1><h2>{t(story.title)}</h2><p>{count} / {story.sentences.length} {t(storyCopy.completedSentences)}</p><strong className="text-purple">{story.sentences.length*storySentenceXp} XP</strong><div className="story-completion-actions"><Button asChild variant="learn"><Link to="/stories"><ArrowLeft/>{t(storyCopy.back)}</Link></Button><Button variant="outline" onClick={()=>{setIndex(0);setFinished(false);}}>{t(storyCopy.readAgain)}</Button></div></div>;
 return <><Button asChild variant="ghost" className="story-back"><Link to="/stories"><ArrowLeft/>{t(storyCopy.back)}</Link></Button>
 <div className="story-reader-heading"><div><span className="story-level-inline">{t(copy[story.level])}</span><h1 className="urdu" lang="ur">{story.titleUrdu}</h1><p>{t(story.title)}</p></div><span className="story-position">{index+1} / {story.sentences.length}</span></div>
 <div className="story-reader-layout"><div className="story-reader-main"><ReadAloudPractice key={index} sentence={sentence} onPerfect={onPerfect} revealMeaning header={()=> <div className="story-sentence-heading"><span>{t(storyCopy.sentence)} {index+1}</span><span className={earned?'story-sentence-earned':''}>{earned?<><CheckCircle2 size={16}/>{t(copy.complete)}</>:`+${storySentenceXp} XP`}</span></div>}/>
 <div className="story-reader-actions"><Button variant="outline" aria-label={t(storyCopy.previous)} disabled={index===0} onClick={()=>setIndex(i=>i-1)}><ArrowLeft/></Button>{index<story.sentences.length-1?<Button variant="learn" onClick={()=>setIndex(i=>i+1)}>{t(storyCopy.next)}<ArrowRight/></Button>:<Button variant="learn" disabled={count!==story.sentences.length} onClick={()=>setFinished(true)}>{t(storyCopy.finish)}<CheckCircle2/></Button>}</div>
 <div className="story-sentence-dots" role="group" aria-label={t(storyCopy.sentences)}>{story.sentences.map((_,i)=><Button key={i} variant={i===index?'default':'outline'} aria-label={`${t(storyCopy.sentence)} ${i+1}`} aria-current={i===index?'step':undefined} className={progress.tasks.includes(sentenceTask(story.id,i))?'story-dot-done':''} onClick={()=>setIndex(i)}>{progress.tasks.includes(sentenceTask(story.id,i))?<CheckCircle2 size={16}/>:i+1}</Button>)}</div></div>
 <aside className="story-reader-aside"><StoryCover story={story}/><div className="story-progress-summary"><strong>{count} / {story.sentences.length}</strong><span>{t(storyCopy.completedSentences)}</span></div><Mascot/><div className="friend-bubble">{t(copy.alifSays)}</div></aside></div></>;
}
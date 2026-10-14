import {copy,streak,text,challengeComplete,totalDays,type Progress} from './learning';
import {stories,storyTask} from './stories';

export const rewardsCopy={
 rewards:text('Rewards','इनाम','المكافآت','পুরস্কার','Premios'),stars:text('Stars','सितारे','نجوم','তারা','Estrellas'),yourStars:text('Your stars','आपके सितारे','نجومك','আপনার তারা','Tus estrellas'),character:text('Choose your character','अपना पात्र चुनें','اختر شخصيتك','আপনার চরিত্র বাছুন','Elige tu personaje'),milestones:text('Milestones','उपलब्धियाँ','الإنجازات','মাইলফলক','Logros'),storiesDone:text('Stories completed','पूरी कहानियाँ','القصص المكتملة','সমাপ্ত গল্প','Historias completadas'),
};
export const starsFor=(xp:number)=>Number.isFinite(xp)?Math.floor(Math.max(0,xp)/20):0;
export const finishedStoryCount=(p:Progress)=>new Set(p.tasks.filter(task=>/^story:[^:]+:complete$/.test(task))).size;
export function levelComplete(p:Progress,level:number):boolean {
 const books=stories.filter(book=>Number(book.readingLevel)===level);
 return books.length>0&&books.every(book=>p.tasks.includes(storyTask(book.id)));
}
export function milestones(p:Progress) {
 const count=finishedStoryCount(p);
 return [
  {id:'lesson',title:copy.firstBadge,earned:p.completed.length>=1,current:Math.min(1,p.completed.length),target:1},
  {id:'story',title:text('First story','पहली कहानी','أول قصة','প্রথম গল্প','Primera historia'),earned:count>=1,current:Math.min(1,count),target:1},
  {id:'five',title:text('Five story explorer','पाँच कहानियों के खोजी','مستكشف خمس قصص','পাঁচ গল্পের অভিযাত্রী','Explorador de cinco historias'),earned:count>=5,current:Math.min(5,count),target:5},
  {id:'streak',title:copy.streakBadge,earned:p.dates.some(date=>streak(p.dates,new Date(`${date}T12:00:00`))>=7),current:Math.min(7,Math.max(0,...p.dates.map(date=>streak(p.dates,new Date(`${date}T12:00:00`))))),target:7},
  {id:'week',title:copy.weekBadge,earned:p.completed.length>=6,current:Math.min(6,p.completed.length),target:6},
  {id:'certificate',title:copy.challengeDone,earned:challengeComplete(p),current:Math.min(totalDays,p.completed.length),target:totalDays},
  ...[1,2,3].map(level=>({id:`level-${level}`,title:text(`Level ${level}`,`स्तर ${level}`,`المستوى ${level}`,`স্তর ${level}`,`Nivel ${level}`,`سطح ${level}`),earned:levelComplete(p,level),current:stories.filter(b=>b.readingLevel===level&&p.tasks.includes(storyTask(b.id))).length,target:stories.filter(b=>b.readingLevel===level).length})),
 ];
}
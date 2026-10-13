import {describe,it,expect} from 'vitest';
import {initialProgress,localDate,normalizeWords,compareWords,streak} from '@/lib/learning';
import {stories,completeStorySentence,storyTask,storySentenceXp} from '@/lib/stories';
import {seededAudioTexts} from '@/lib/urdu-tts-content';

describe('Story learning rules',()=>{
 const story=stories.find(s=>s.id==='thirsty-crow');if(!story)throw new Error('Missing seeded story');
 it('seeds beginner stories with ordered Urdu, Roman, and translated meanings',()=>{
  expect(stories).toHaveLength(5);expect(new Set(stories.map(s=>s.id)).size).toBe(5);
  for(const s of stories){expect(s.level).toBe('beginner');expect(s.sentences.length).toBeGreaterThanOrEqual(6);for(const sentence of s.sentences){expect(sentence.urdu).toMatch(/[\u0600-\u06ff]/);expect(sentence.roman.length).toBeGreaterThan(5);for(const lang of ['en','hi','ar','bn','es'] as const)expect(sentence.meaning[lang].length).toBeGreaterThan(0);}}
 });
 it('awards 20 XP per sentence only once',()=>{
  const p=completeStorySentence(initialProgress,story,0);expect(storySentenceXp).toBe(20);expect(p.xp).toBe(20);expect(completeStorySentence(p,story,0).xp).toBe(20);
 });
 it('does not complete a story or increase the streak before every sentence is done',()=>{
  const p=completeStorySentence(initialProgress,story,0);expect(p.tasks).not.toContain(storyTask(story.id));expect(p.dates).toEqual([]);
 });
 it('completes only after all sentences, counts toward the streak, and leaves the track unchanged',()=>{
  const date='2026-10-10';let p={...initialProgress,dates:['2026-10-09']};
  for(let i=story.sentences.length-1;i>=0;i--)p=completeStorySentence(p,story,i,date);
  expect(p.tasks).toContain(storyTask(story.id));expect(p.xp).toBe(120);expect(p.dates).toEqual(['2026-10-09',date]);expect(streak(p.dates,new Date(2026,9,10,12))).toBe(2);expect(p.completed).toEqual([]);
  expect(completeStorySentence(p,story,0,'2026-10-11').dates).toEqual(p.dates);
 });
 it('rejects out-of-range sentence completion',()=>{expect(completeStorySentence(initialProgress,story,-1)).toBe(initialProgress);expect(completeStorySentence(initialProgress,story,100)).toBe(initialProgress);});
 it('allows every story sentence and tappable word through the existing narration allowlist',()=>{
  for(const s of stories)for(const sentence of s.sentences){expect(seededAudioTexts).toContain(sentence.urdu);for(const word of normalizeWords(sentence.urdu))expect(seededAudioTexts).toContain(word);}
 });
 it('uses the existing alignment for missing and extra story words',()=>{
  const result=compareWords('ایک کوا پیاسا تھا۔','ایک کوا بہت تھا');expect(result.correct).toEqual([true,true,false,true]);expect(result.extras).toEqual(['بہت']);expect(result.score).toBe(3);
 });
 it('records the device-local date by default on completion',()=>{
  let p=initialProgress;for(let i=0;i<story.sentences.length;i++)p=completeStorySentence(p,story,i);expect(p.dates).toEqual([localDate()]);
 });
});
import {describe,it,expect} from 'vitest';
import {curriculum,dayInfo,lessonAudioTexts} from '@/lib/curriculum';
import {totalDays,normalizeWords} from '@/lib/learning';
import {seededAudioTexts} from '@/lib/urdu-tts-content';

describe('Thirty-day curriculum',()=>{
 it('runs exactly thirty days, with the thirteen alphabet days first',()=>{
  expect(curriculum).toHaveLength(totalDays);expect(totalDays).toBe(30);
  for(let day=1;day<=13;day++)expect(curriculum[day-1]?.kind).toBe('letters');
  for(let day=14;day<=30;day++)expect(curriculum[day-1]?.kind).not.toBe('letters');
 });
 it('gives every teaching day enough well-formed, fully translated items',()=>{
  for(const day of curriculum){
   if(day.kind==='letters')continue;
   expect(day.items.length).toBeGreaterThanOrEqual(3); // need two distractors for the quiz
   for(const item of day.items){
    expect(item.main).toMatch(/[؀-ۿ]/);expect(item.sub.length).toBeGreaterThan(0);
    for(const lang of ['en','hi','ar','bn','es'] as const)expect(item.gloss[lang].length).toBeGreaterThan(0);
    if(day.kind==='build')expect((item.parts??[]).length).toBeGreaterThanOrEqual(2);
   }
  }
 });
 it('routes every lesson prompt through the narration allowlist',()=>{
  expect(lessonAudioTexts.length).toBeGreaterThan(0);
  for(const day of curriculum){if(day.kind==='letters')continue;for(const item of day.items){expect(seededAudioTexts).toContain(item.main);for(const word of normalizeWords(item.main))expect(seededAudioTexts).toContain(word);}}
 });
 it('gives each day a preview glyph and a title',()=>{
  for(let day=1;day<=totalDays;day++){const info=dayInfo(day);expect(info.glyph.length).toBeGreaterThan(0);expect(info.title.en.length).toBeGreaterThan(0);}
 });
});

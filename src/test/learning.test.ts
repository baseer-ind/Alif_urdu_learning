import {describe,it,expect} from 'vitest';
import {initialProgress,placementLevel,award,streak,levelFor,unlocked,compareWords,lessons} from '@/lib/learning';
describe('Alif learning rules',()=>{
 it('placement uses six questions and buckets beginners, intermediate and expert',()=>{expect(placementLevel(2)).toBe('beginner');expect(placementLevel(3)).toBe('intermediate');expect(placementLevel(4)).toBe('intermediate');expect(placementLevel(5)).toBe('expert');});
 it('covers the alphabet across thirteen lesson days',()=>expect(lessons).toHaveLength(13));
 it('locks days beyond the built lessons and unlocks earlier ones in order',()=>{const all=Array.from({length:lessons.length},(_,i)=>i+1);for(let day=lessons.length+1;day<=30;day++)expect(unlocked(day,{...initialProgress,completed:all})).toBe(false);expect(unlocked(lessons.length,{...initialProgress,completed:all.slice(0,lessons.length-1)})).toBe(true);expect(unlocked(7,{...initialProgress,completed:[1,2,3,4,5,6]})).toBe(true);});
 it('unlocks the next day only after the previous lesson',()=>{expect(unlocked(2,initialProgress)).toBe(false);expect(unlocked(2,award(initialProgress,'lesson-1',50,1))).toBe(true);});
 it('awards 50 XP only once for a lesson and records daily activity',()=>{const p=award(initialProgress,'lesson-1',50,1,'2026-10-09');const again=award(p,'lesson-1',50,1,'2026-10-09');expect(again.xp).toBe(50);expect(again.completed).toEqual([1]);expect(again.dates).toEqual(['2026-10-09']);});
 it('read tasks do not increase the lesson streak',()=>{expect(award(initialProgress,'read-1',20,undefined,'2026-10-09').dates).toEqual([]);});
 it('a missed day resets the streak',()=>expect(streak(['2026-10-06','2026-10-07'],new Date('2026-10-09T12:00:00'))).toBe(0));
 it('streak increments only for consecutive days',()=>expect(streak(['2026-10-07','2026-10-08','2026-10-09'],new Date('2026-10-09T12:00:00'))).toBe(3));
 it('level increases with accumulated XP',()=>{expect(levelFor(0)).toBe(1);expect(levelFor(100)).toBe(2);});
 it('compares by alignment so extra words do not shift correct words',()=>{const r=compareWords('یہ میرا گھر ہے۔','یہ بڑا میرا گھر ہے');expect(r.score).toBe(4);expect(r.extras).toEqual(['بڑا']);});
 it('marks missed and wrong words incorrect',()=>{const r=compareWords('یہ میرا گھر ہے','یہ تمہارا ہے');expect(r.correct).toEqual([true,false,false,true]);expect(r.extras).toEqual(['تمہارا']);});
});

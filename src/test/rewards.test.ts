import {describe,it,expect} from 'vitest';
import {initialProgress,normalizeProgress,translate,copy} from '@/lib/learning';
import {starsFor,milestones,levelComplete} from '@/lib/rewards';
import {validAvatar} from '@/lib/avatars';

describe('Stars, milestones and saved preferences',()=>{
 it('maps every 20 XP to one star, rounding down',()=>{expect(starsFor(0)).toBe(0);expect(starsFor(19)).toBe(0);expect(starsFor(20)).toBe(1);expect(starsFor(59)).toBe(2);expect(starsFor(-20)).toBe(0);});
 it('unlocks first lesson after one completed lesson',()=>{expect(milestones(initialProgress).find(b=>b.id==='lesson')?.earned).toBe(false);expect(milestones({...initialProgress,completed:[1]}).find(b=>b.id==='lesson')?.earned).toBe(true);});
 it('unlocks first story after one completed story',()=>{expect(milestones(initialProgress).find(b=>b.id==='story')?.earned).toBe(false);expect(milestones({...initialProgress,tasks:['story:one:complete']}).find(b=>b.id==='story')?.earned).toBe(true);});
 it('requires five distinct stories for five-story badge',()=>{const tasks=['one','two','three','four'].map(id=>`story:${id}:complete`);expect(milestones({...initialProgress,tasks:[...tasks,tasks[0]??'']}).find(b=>b.id==='five')?.earned).toBe(false);expect(milestones({...initialProgress,tasks:[...tasks,'story:five:complete']}).find(b=>b.id==='five')?.earned).toBe(true);});
 it('requires seven consecutive days for streak reward',()=>{const dates=Array.from({length:7},(_,i)=>`2026-10-${String(i+1).padStart(2,'0')}`);expect(milestones({...initialProgress,dates:dates.slice(0,6)}).find(b=>b.id==='streak')?.earned).toBe(false);expect(milestones({...initialProgress,dates}).find(b=>b.id==='streak')?.earned).toBe(true);});
 it('requires all six starter lessons for week one',()=>{expect(milestones({...initialProgress,completed:[1,2,3,4,5]}).find(b=>b.id==='week')?.earned).toBe(false);expect(milestones({...initialProgress,completed:[1,2,3,4,5,6]}).find(b=>b.id==='week')?.earned).toBe(true);});
 it('never unlocks completion of an empty reading level',()=>{expect(levelComplete(initialProgress,99)).toBe(false);});
 it('accepts only original avatar options',()=>{expect(validAvatar('panda')).toBe('panda');expect(validAvatar('unknown')).toBeUndefined();});
 it('preserves Urdu instructions and selected avatar without resetting XP',()=>{const p=normalizeProgress({...initialProgress,language:'ur',avatar:'frog',xp:120,tasks:['story:one:complete']});expect(p.language).toBe('ur');expect(p.avatar).toBe('frog');expect(p.xp).toBe(120);expect(p.tasks).toEqual(['story:one:complete']);expect(translate(copy.listen,'ur')).toBe('سنیں');});
});
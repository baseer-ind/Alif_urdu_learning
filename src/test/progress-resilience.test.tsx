import {act,cleanup,renderHook,waitFor} from '@testing-library/react';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {ProgressProvider,useProgress,useSpeech} from '@/lib/progress';
import {normalizeProgress,translate} from '@/lib/learning';
import {prewarmUrduAudio,requestUrduAudio} from '@/lib/urdu-tts-client';
import {playUrduAudio} from '@/lib/urdu-audio';

vi.mock('@/lib/urdu-audio',()=>({initializeUrduAudio:vi.fn(),subscribeUrduAudio:vi.fn(()=>()=>{}),getUrduAudioStatus:vi.fn(()=>'ready'),getServerAudioStatus:vi.fn(()=>'ready'),playUrduAudio:vi.fn(()=>'started'),stopUrduAudio:vi.fn(),primeUrduRecording:vi.fn()}));
vi.mock('@/lib/urdu-tts-client',()=>({prewarmUrduAudio:vi.fn().mockRejectedValue(new Error('Narration unavailable')),requestUrduAudio:vi.fn(),getCachedUrduUrl:vi.fn(),cloudAudioFailed:vi.fn(()=>false),isCloudAudioLoading:vi.fn(()=>false),subscribeCloudAudio:vi.fn(()=>()=>{}),getCloudAudioRevision:vi.fn(()=>0),getServerCloudAudioRevision:vi.fn(()=>0)}));
beforeEach(()=>{localStorage.clear();vi.mocked(playUrduAudio).mockClear();});
afterEach(()=>{cleanup();vi.restoreAllMocks();});

describe('Learning remains usable without optional services',()=>{
 it('isolates synchronous prewarm failures',async()=>{
  vi.mocked(prewarmUrduAudio).mockImplementationOnce(()=>{throw new Error('Synchronous prewarm failure');});
  const {result}=renderHook(()=>useProgress(),{wrapper:ProgressProvider});
  await waitFor(()=>expect(result.current.ready).toBe(true));
  expect(result.current.progress.xp).toBe(0);
 });
 it.each(['unavailable','rejected','synchronous'])('falls back to browser playback on %s narration without disrupting learning',async failure=>{
  if(failure==='unavailable')vi.mocked(requestUrduAudio).mockResolvedValueOnce(undefined);
  else if(failure==='rejected')vi.mocked(requestUrduAudio).mockRejectedValueOnce(new Error('503'));
  else vi.mocked(requestUrduAudio).mockImplementationOnce(()=>{throw new Error('Fetch failed');});
  const {result}=renderHook(()=>({speech:useSpeech(),learning:useProgress()}),{wrapper:ProgressProvider});
  act(()=>result.current.speech.speak('پانی'));
  await waitFor(()=>expect(playUrduAudio).toHaveBeenCalledWith('پانی',undefined,expect.any(Function)));
  act(()=>result.current.learning.reward('lesson-1',50,1));
  expect(result.current.learning.progress.xp).toBe(50);
 });
 it('repairs an invalid saved level without losing valid XP or lesson progress',()=>{
  const p=normalizeProgress({language:'en',placement:'Beginner',xp:50,completed:[1],tasks:['lesson-1'],dates:['2026-10-10']});
  expect(p).toEqual({language:'en',placement:null,xp:50,completed:[1],tasks:['lesson-1'],dates:['2026-10-10']});
 });
 it('filters invalid lesson, task and date entries and non-finite XP',()=>{
  expect(normalizeProgress({language:'invalid',placement:{},xp:Infinity,completed:[1,1,99,null],tasks:['read-0',null],dates:['2026-10-10','2026-02-31',null]})).toEqual({language:null,placement:null,xp:0,completed:[1],tasks:['read-0'],dates:['2026-10-10']});
 });
 it('normalizes an optional learner name and challenge date and drops malformed ones',()=>{
  expect(normalizeProgress({language:'en',placement:'beginner',xp:0,completed:[],tasks:[],dates:[],name:'  Sara  ',challengeDate:'2026-10-10'})).toEqual({language:'en',placement:'beginner',xp:0,completed:[],tasks:[],dates:[],name:'Sara',challengeDate:'2026-10-10'});
  expect(normalizeProgress({name:'   ',challengeDate:'2026-13-40'})).toEqual({language:null,placement:null,xp:0,completed:[],tasks:[],dates:[]});
 });
 it('handles absent translated content and falls back to English',()=>{
  expect(translate(undefined,'en')).toBe('');expect(translate({en:'Water'},'hi')).toBe('Water');
 });
 it('restores saved progress safely even when narration prewarm rejects',async()=>{
  localStorage.setItem('alif-progress-v1',JSON.stringify({language:'en',placement:'Beginner',xp:50,completed:[1],tasks:[],dates:[]}));
  const {result}=renderHook(()=>useProgress(),{wrapper:ProgressProvider});
  await waitFor(()=>expect(result.current.ready).toBe(true));
  expect(result.current.progress.placement).toBeNull();expect(result.current.progress.xp).toBe(50);
 });
 it('continues awarding lesson XP when device storage writes throw',async()=>{
  vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new DOMException('Storage unavailable','SecurityError');});
  const {result}=renderHook(()=>useProgress(),{wrapper:ProgressProvider});
  await waitFor(()=>expect(result.current.ready).toBe(true));
  act(()=>result.current.reward('lesson-1',50,1));
  expect(result.current.progress.xp).toBe(50);expect(result.current.progress.completed).toEqual([1]);
 });
 it('uses defaults when device storage reads throw',async()=>{
  vi.spyOn(Storage.prototype,'getItem').mockImplementation(()=>{throw new DOMException('Storage unavailable','SecurityError');});
  const {result}=renderHook(()=>useProgress(),{wrapper:ProgressProvider});
  await waitFor(()=>expect(result.current.ready).toBe(true));expect(result.current.progress.xp).toBe(0);
 });
});
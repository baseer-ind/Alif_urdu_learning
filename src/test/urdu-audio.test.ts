import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';

function voice(lang:string,isDefault=false){return {lang,default:isDefault} as SpeechSynthesisVoice;}

describe('Urdu browser audio',()=>{
 let available:SpeechSynthesisVoice[];
 let events:EventTarget;
 let calls:string[];
 let spoken:SpeechSynthesisUtterance[];
 let speech:{getVoices:ReturnType<typeof vi.fn>;cancel:ReturnType<typeof vi.fn>;speak:ReturnType<typeof vi.fn>;addEventListener:EventTarget['addEventListener']};
 beforeEach(()=>{
  vi.resetModules();vi.useFakeTimers();available=[];events=new EventTarget();calls=[];spoken=[];
  speech={getVoices:vi.fn(()=>available),cancel:vi.fn(()=>calls.push('cancel')),speak:vi.fn((u:SpeechSynthesisUtterance)=>{calls.push('speak');spoken.push(u);}),addEventListener:events.addEventListener.bind(events)};
  vi.stubGlobal('speechSynthesis',speech);
  vi.stubGlobal('SpeechSynthesisUtterance',class {text:string;constructor(text:string){this.text=text;}});
 });
 afterEach(()=>{vi.clearAllTimers();vi.useRealTimers();vi.unstubAllGlobals();});
 it('waits for voiceschanged and caches voices without delayed speech',async()=>{
  const audio=await import('@/lib/urdu-audio');audio.initializeUrduAudio();
  expect(audio.playUrduAudio('ا')).toBe('loading');expect(speech.speak).not.toHaveBeenCalled();
  available=[voice('ur-PK')];events.dispatchEvent(new Event('voiceschanged'));
  expect(audio.getUrduAudioStatus()).toBe('ready');expect(speech.speak).not.toHaveBeenCalled();
  audio.playUrduAudio('ب');expect(spoken[0]?.lang).toBe('ur-PK');
  const reads=speech.getVoices.mock.calls.length;audio.playUrduAudio('پ');expect(speech.getVoices).toHaveBeenCalledTimes(reads);
 });
 it('prioritizes Urdu over Arabic and default voices',async()=>{
  available=[voice('en-US',true),voice('ar-SA'),voice('ur-IN')];const audio=await import('@/lib/urdu-audio');audio.playUrduAudio('پ');expect(spoken[0]?.voice).toBe(available[2]);expect(spoken[0]?.lang).toBe('ur-IN');
 });
 it('uses Arabic when Urdu is not installed',async()=>{
  available=[voice('en-US',true),voice('ar-SA')];const audio=await import('@/lib/urdu-audio');audio.playUrduAudio('پ');expect(spoken[0]?.lang).toBe('ar-SA');
 });
 it('uses the default voice when neither Urdu nor Arabic exists',async()=>{
  available=[voice('fr-FR'),voice('en-US',true)];const audio=await import('@/lib/urdu-audio');audio.playUrduAudio('پ');expect(spoken[0]?.voice).toBe(available[1]);expect(spoken[0]?.lang).toBe('en-US');
 });
 it('defaults the utterance language to ur-PK if the voice has no language',async()=>{
  available=[voice('',true)];const audio=await import('@/lib/urdu-audio');audio.playUrduAudio('پ');expect(spoken[0]?.lang).toBe('ur-PK');
 });
 it('cancels immediately before speaking synchronously in the same call',async()=>{
  available=[voice('ur-PK')];const audio=await import('@/lib/urdu-audio');expect(audio.playUrduAudio('ا')).toBe('started');expect(calls.slice(-2)).toEqual(['cancel','speak']);expect(spoken[0]?.text).toBe('ا');
 });
 it('reports unavailable after voice loading times out and recovers on a later voice event',async()=>{
  const audio=await import('@/lib/urdu-audio');audio.initializeUrduAudio();vi.advanceTimersByTime(3000);expect(audio.getUrduAudioStatus()).toBe('unavailable');expect(audio.playUrduAudio('ا')).toBe('unavailable');available=[voice('ur-PK')];events.dispatchEvent(new Event('voiceschanged'));expect(audio.getUrduAudioStatus()).toBe('ready');
 });
 it('notifies when speech fails without blocking the interface',async()=>{
  available=[voice('ur-PK')];const notify=vi.fn();const audio=await import('@/lib/urdu-audio');audio.playUrduAudio('ا',undefined,notify);spoken[0]?.onerror?.({error:'voice-unavailable'} as SpeechSynthesisErrorEvent);expect(notify).toHaveBeenCalledOnce();expect(audio.getUrduAudioStatus()).toBe('unavailable');
 });
 it('plays supplied recordings synchronously instead of speech even without voices',async()=>{
  const play=vi.fn(()=>Promise.resolve());vi.stubGlobal('Audio',class{constructor(public src:string){}play=play;pause=vi.fn();});const audio=await import('@/lib/urdu-audio');expect(audio.playUrduAudio('ا','/audio/alif.mp3')).toBe('started');expect(play).toHaveBeenCalledOnce();expect(speech.speak).not.toHaveBeenCalled();
 });
 it('plays inline MP3 data URLs without browser speech',async()=>{
  const play=vi.fn(()=>Promise.resolve());const sources:string[]=[];
  vi.stubGlobal('Audio',class{constructor(public src:string){sources.push(src);}play=play;pause=vi.fn();});
  const audio=await import('@/lib/urdu-audio');
  expect(audio.playUrduAudio('پانی','data:audio/mp3;base64,SUQzAQ==')).toBe('started');
  expect(sources).toEqual(['data:audio/mp3;base64,SUQzAQ==']);expect(play).toHaveBeenCalledOnce();expect(speech.speak).not.toHaveBeenCalled();
 });
 it('does not switch to synthesized speech if a supplied recording fails',async()=>{
  available=[voice('ur-PK')];const notify=vi.fn();vi.stubGlobal('Audio',class{play=()=>Promise.reject(new Error('not found'));pause=vi.fn();});const audio=await import('@/lib/urdu-audio');audio.playUrduAudio('ا','/missing.mp3',notify);await Promise.resolve();expect(notify).toHaveBeenCalledOnce();expect(speech.speak).not.toHaveBeenCalled();
 });
});
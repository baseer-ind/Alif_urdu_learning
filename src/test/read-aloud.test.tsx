import {act,renderHook,waitFor} from '@testing-library/react';
import {afterEach,describe,expect,it,vi} from 'vitest';
import {useReadAloud} from '@/hooks/use-read-aloud';

class RecognitionMock {
 static instances:RecognitionMock[]=[];
 lang='';interimResults=false;continuous=false;
 onresult:((e:{results:{isFinal:boolean;0:{transcript:string}}[]})=>void)|null=null;
 onerror:((e:{error:string})=>void)|null=null;onend:(()=>void)|null=null;
 start=vi.fn();stop=vi.fn();abort=vi.fn();
 constructor(){RecognitionMock.instances.push(this);}
}
afterEach(()=>{vi.unstubAllGlobals();RecognitionMock.instances=[];});
describe('Shared Urdu recognition',()=>{
 it('only completes a sentence for a perfect reading with no extra words',()=>{
  vi.stubGlobal('SpeechRecognition',RecognitionMock);const perfect=vi.fn();const {result}=renderHook(()=>useReadAloud('ایک کوا پیاسا تھا۔',perfect));
  act(()=>result.current.start());const r=RecognitionMock.instances[0];expect(r?.lang).toBe('ur-PK');
  act(()=>r?.onresult?.({results:[{isFinal:true,0:{transcript:'ایک کوا بہت تھا'}}]}));expect(perfect).not.toHaveBeenCalled();expect(result.current.result?.extras).toEqual(['بہت']);
  act(()=>result.current.start());act(()=>RecognitionMock.instances[1]?.onresult?.({results:[{isFinal:true,0:{transcript:'ایک کوا پیاسا تھا'}}]}));expect(perfect).toHaveBeenCalledTimes(1);
 });
 it('falls back from ur-PK to ur-IN when the language is unsupported',()=>{
  vi.stubGlobal('SpeechRecognition',RecognitionMock);const {result}=renderHook(()=>useReadAloud('یہ میرا گھر ہے۔',vi.fn()));act(()=>result.current.start());act(()=>RecognitionMock.instances[0]?.onerror?.({error:'language-not-supported'}));expect(RecognitionMock.instances[1]?.lang).toBe('ur-IN');expect(result.current.listening).toBe(true);
 });
 it('reports unsupported browsers without trying to record',async()=>{
  vi.stubGlobal('SpeechRecognition',undefined);vi.stubGlobal('webkitSpeechRecognition',undefined);const {result}=renderHook(()=>useReadAloud('یہ میرا گھر ہے۔',vi.fn()));await waitFor(()=>expect(result.current.supported).toBe(false));act(()=>result.current.start());expect(result.current.listening).toBe(false);
 });
 it('aborts recording and removes callbacks when leaving a sentence',()=>{
  vi.stubGlobal('SpeechRecognition',RecognitionMock);const {result,unmount}=renderHook(()=>useReadAloud('یہ میرا گھر ہے۔',vi.fn()));act(()=>result.current.start());const r=RecognitionMock.instances[0];unmount();expect(r?.abort).toHaveBeenCalled();expect(r?.onresult).toBeNull();
 });
});
import type {ComponentProps} from 'react';
import {LoaderCircle, Volume2, VolumeX} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useSpeech} from '@/lib/progress';

type ListenButtonProps = Omit<ComponentProps<typeof Button>, 'onClick'> & {text:string; showIcon?:boolean};
export function ListenButton({text, showIcon=true, children, className='', title, ...props}:ListenButtonProps) {
  const {speak, isAudioLoading, audioUnavailable, audioTitle} = useSpeech();
  const loading = isAudioLoading(text);
  const unavailable = audioUnavailable(text);
  return <Button {...props} className={`${className} ${unavailable?'opacity-50':''}`} title={audioTitle(text)??title} aria-disabled={unavailable||undefined} aria-busy={loading||undefined} data-audio-unavailable={unavailable||undefined} onClick={()=>speak(text)}>
    {loading?<LoaderCircle className="animate-spin motion-reduce:animate-none" aria-hidden="true"/>:showIcon?(unavailable?<VolumeX/>:<Volume2/>):null}{children}
  </Button>;
}
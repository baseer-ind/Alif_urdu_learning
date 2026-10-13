import crow from '@/assets/story-0.jpg';
import woodcutter from '@/assets/story-1.jpg';
import lion from '@/assets/story-2.jpg';
import family from '@/assets/story-3.jpg';
import type {Story} from '@/lib/stories';
const covers=[crow,woodcutter,lion,family];
export function StoryCover({story,className=''}:{story:Story;className?:string}) {
 return <img src={covers[story.cover]} alt="" width={762} height={506} loading="lazy" className={`story-cover ${className}`}/>;
}
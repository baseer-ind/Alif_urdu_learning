import {validAvatar,type AvatarId} from '@/lib/avatars';

// Original Alif characters, drawn from simple geometric shapes.
export function CharacterAvatar({id,className=''}:{id?:AvatarId;className?:string}) {
 const character=validAvatar(id)??'fox';
 return <svg className={`character-avatar character-${character} ${className}`} viewBox="0 0 100 100" role="img" aria-label={character}>
  <circle className="character-bg" cx="50" cy="50" r="48"/>
  {character==='bunny'?<><ellipse className="character-face" cx="35" cy="28" rx="9" ry="23"/><ellipse className="character-face" cx="65" cy="28" rx="9" ry="23"/></>:character==='frog'?<><circle className="character-face" cx="30" cy="32" r="16"/><circle className="character-face" cx="70" cy="32" r="16"/></>:character==='panda'?<><circle className="character-ink" cx="26" cy="27" r="13"/><circle className="character-ink" cx="74" cy="27" r="13"/></>:<><path className="character-face" d="M20 47 L17 17 L45 36Z"/><path className="character-face" d="M80 47 L83 17 L55 36Z"/></>}
  <ellipse className="character-face" cx="50" cy="57" rx="34" ry="30"/>
  {(character==='fox'||character==='owl')&&<><ellipse className="character-light" cx="35" cy="57" rx="16" ry="19"/><ellipse className="character-light" cx="65" cy="57" rx="16" ry="19"/></>}
  {character==='panda'&&<><ellipse className="character-ink" cx="35" cy="49" rx="11" ry="14"/><ellipse className="character-ink" cx="65" cy="49" rx="11" ry="14"/></>}
  <circle className={character==='panda'?'character-light':'character-ink'} cx="36" cy="51" r="4"/><circle className={character==='panda'?'character-light':'character-ink'} cx="64" cy="51" r="4"/>
  <path className="character-ink" d="M44 63 Q50 58 56 63 L50 69Z"/>
  <path className="character-smile" d="M40 73 Q50 81 60 73"/>
  <circle className="character-cheek" cx="25" cy="65" r="5"/><circle className="character-cheek" cx="75" cy="65" r="5"/>
 </svg>;
}
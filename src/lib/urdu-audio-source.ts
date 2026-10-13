// Only HTTP recordings and bounded MP3 data URLs are accepted from narration.
export function isUrduAudioSource(value:unknown):value is string {
  if(typeof value!=='string')return false;
  return /^https?:\/\//.test(value) || (value.length<=2800030 && /^data:audio\/(?:mp3|mpeg);base64,[A-Za-z0-9+/]+={0,2}$/.test(value));
}
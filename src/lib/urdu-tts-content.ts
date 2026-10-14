import {letters, sentences, normalizeWords} from './learning';
import {stories} from './stories';
import {lessonAudioTexts} from './curriculum';

export const urduVoices = ['ur-IN-Chirp3-HD-Aoede', 'ur-IN-Chirp3-HD-Charon', 'ur-IN-Chirp3-HD-Kore', 'ur-IN-Chirp3-HD-Puck', 'ur-IN-Wavenet-A', 'ur-IN-Wavenet-B', 'ur-IN-Wavenet-C', 'ur-IN-Wavenet-D'] as const;
export type UrduVoice = typeof urduVoices[number];
export const defaultUrduVoice: UrduVoice = 'ur-IN-Chirp3-HD-Aoede';
export const seededAudioTexts = [...new Set([
  ...letters.flatMap(letter => [letter.glyph, letter.word]),
  ...sentences.flatMap(sentence => [sentence.urdu, ...normalizeWords(sentence.urdu)]),
  ...stories.flatMap(story => story.sentences.flatMap(sentence => [sentence.urdu, ...normalizeWords(sentence.urdu)])),
  ...lessonAudioTexts,
  'پانی اور روٹی',
])];

export function normalizeUrduVoice(voice: string): string {
  return voice.startsWith('ur-PK') ? defaultUrduVoice : voice;
}

export async function audioHash(text: string, voice: UrduVoice) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text + voice));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}
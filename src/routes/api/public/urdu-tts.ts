import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/api/public/urdu-tts')({
  server:{handlers:{POST:async ({request}) => {
    const {handleUrduTts} = await import('@/lib/urdu-tts.server');
    return handleUrduTts(request);
  }}},
});
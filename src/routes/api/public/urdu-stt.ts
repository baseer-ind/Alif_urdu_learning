import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/api/public/urdu-stt')({
  server:{handlers:{POST:async ({request}) => {
    const {handleUrduStt} = await import('@/lib/urdu-stt.server');
    return handleUrduStt(request);
  }}},
});

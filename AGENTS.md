<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Use a shared progress provider with device-local storage for v1 learning state; this keeps the requested mock experience consistent across routes without a backend.
- Validate persisted progress before rendering and isolate storage and optional narration failures; device restrictions and stale data must not interrupt learning.
- Keep curriculum, translations, progress rules, and word alignment in browser-safe learning modules; this enables independent rule tests and future data integration.
- Give each learning screen its own TanStack route inside shared navigation; this provides direct links and independent metadata.
- Keep stories in a browser-safe translated data module, reuse one read-aloud hook and practice view across exercises and stories, and derive story completion from task IDs; this avoids duplicated recognition logic and preserves existing stored progress.
- Generate offline support with vite-plugin-pwa and register through one guarded wrapper; this protects editor previews from stale service workers.
- Print worksheets through an A4-only stylesheet and browser print dialog; handwriting stays a paper-only activity.
- Route all Urdu playback through shared ListenButton controls, a device-local narration URL cache, and playUrduAudio; prime media in the tap and use browser speech only after cloud failure to preserve device playback permissions.
- Implement Google TTS narration in a TanStack server endpoint with a fixed curriculum allowlist and server-only storage writes; the no-account mock must not expose unrestricted paid synthesis.
- Treat private narration storage as an optional bounded cache: return renewable signed links when usable and inline MP3 data URLs otherwise; storage failures must never prevent Google audio delivery.
- Optional narration requests resolve without audio on any failure, and all prewarm/playback callers isolate synchronous and asynchronous errors; learning must never depend on narration availability.
- Check narration cache objects with bounded exact-name storage listings rather than HEAD existence checks; storage can report a normal missing object as a HEAD error.
- Report the actual synthesis voice and hash storage by that voice, with bounded config retry and voice fallback; this prevents fallback clips from masquerading as the preferred voice.

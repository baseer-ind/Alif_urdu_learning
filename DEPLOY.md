# Deploying Alif

Alif is a TanStack Start app that builds to a **Cloudflare Worker**. It runs
fully on Cloudflare's **free** tier — no paid services are required. Progress
is stored on each device; narration uses the browser's built-in Urdu/Arabic
voice unless you add a Google key.

---

## 1. Build

```bash
bun install
bun run build
```

This produces `.output/` (the Worker bundle) and generates
`.output/server/wrangler.json` automatically.

## 2. Deploy to Cloudflare (free)

You need a free Cloudflare account. Only you can do this step — it signs in
as you.

```bash
npx wrangler login                                   # opens the browser once
npx wrangler deploy --config .output/server/wrangler.json
```

Wrangler prints your live URL, e.g. `https://alif-urdu-learning.<you>.workers.dev`.
Re-run the two build + deploy commands any time to ship an update. (Pushing to
the connected GitHub branch does **not** auto-deploy anymore — this repo is
self-hosted now, so deploys are manual unless you add a GitHub Action.)

## 3. (Optional) Turn on Google cloud narration

Skip this and the app still talks, using the device's built-in voice. To use
your Google Cloud Text-to-Speech credits instead:

```bash
npx wrangler secret put GOOGLE_TTS_API_KEY --config .output/server/wrangler.json
# paste the key when prompted
```

Note: the voice is `ur-IN` (Indian Urdu) — the best Google offers for Urdu. To a
native Pakistani-Urdu ear it can lean Hindi. True `ur-PK` needs Azure or human
recordings, which are a paid/manual step we deliberately did not take.

## 4. Accounts

v1 has **no accounts and no login** — progress is device-local by design. The
auth scaffolding has been removed. The only remaining Supabase hook is an
*optional* server-side cache for cloud narration MP3s (step 3); it stays
dormant and inline-only unless you set the `SUPABASE_*` secrets, and narration
works fine without it. Adding real accounts later is a separate feature, not a
config toggle.

## 5. Put it on Google Play (PWA → Android app)

Alif is an installable PWA, so it wraps into an Android app with a Trusted Web
Activity — no rewrite.

1. Deploy first (steps 1–2) so you have an HTTPS URL.
2. Generate the Android package from the manifest:
   ```bash
   npx @bubblewrap/cli init --manifest https://YOUR_URL/manifest.webmanifest
   npx @bubblewrap/cli build
   ```
3. Upload the resulting `.aab` to the Google Play Console (a one-time $25
   developer account is required by Google).

---

## Security — do this now

The two Google API keys shared earlier in chat are exposed. **Regenerate (or
delete) them in Google Cloud Console → APIs & Services → Credentials**, and use
the new key only via `wrangler secret put` (step 3) — never commit it. The repo
is clean: secrets live in Worker secrets, and only `.env.example` (blank
placeholders) is tracked.

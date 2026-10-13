# Urdu Steps Alif

Build a mobile-first Progressive Web App (installable PWA, works great on phones and desktop) for learning to READ and WRITE Urdu. The app teaches Urdu to speakers of OTHER languages (Hindi, English, Arabic, etc.), so the learner first picks their own language and all instructions/explanations appear in THAT language, while the Urdu content stays in Urdu script.

IMPORTANT DESIGN DIRECTION: Use a BRIGHT, VIBRANT color scheme — light/white backgrounds with bold, saturated accent colors (think warm teal, coral, sunny yellow, vivid purple). NEVER dark mode or black themes. Big rounded cards, playful but clean, large tap targets, friendly. Use the Urdu font "Noto Nastaliq Urdu" (Google Fonts) for all Urdu text, rendered large and clearly. A friendly cartoon character mascot (call it "Alif") guides the learner through lessons with speech bubbles.

Core v1 screens and flow:

1. WELCOME / LANGUAGE PICKER: User selects their native language from a grid (English, हिन्दी Hindi, العربية Arabic, and a few more). This choice drives the UI language for all instructional text.

2. PLACEMENT TEST: 5–6 quick questions (recognize an Urdu letter, match a letter to its sound, read a simple word). Score the answers and bucket the user into Beginner / Intermediate / Expert. Show a friendly result screen with the mascot.

3. HOME / DASHBOARD: Shows a 30-DAY CHALLENGE as a vertical path of 30 day-nodes (locked/unlocked/completed states, like a game map). Prominently display: current STREAK (🔥 with day count), total XP points, and current LEVEL. A "Continue" button jumps to today's lesson.

4. LESSON SCREEN (character-guided): The mascot teaches 2–3 Urdu letters or one short word per lesson. For each item: show the large Urdu glyph, a "listen" button that speaks it aloud using the browser's speechSynthesis (SpeechSynthesis Web Speech API, pick an Urdu/Arabic voice if available), the transliteration, and the meaning in the user's chosen language. Interactive tap-to-reveal and simple multiple-choice checks. Award XP on completion.

5. READ-ALOUD EXERCISE (the hero feature): Show an Urdu sentence. A big mic button lets the user read it aloud. Use the browser Web Speech API (window.SpeechRecognition / webkitSpeechRecognition) with language set to Urdu ("ur-PK", fall back to "ur-IN"). Compare the recognized transcript word-by-word against the expected Urdu sentence: words read correctly turn GREEN, words that were wrong, missed, or extra are highlighted RED. Show a score (e.g. 8/10 words correct) and let the user TAP ANY WORD to hear it, then retry. Include a clear "try again" button and handle the case where the browser doesn't support speech recognition by showing a friendly message.

6. PRINTABLE WORKSHEETS: A "Practice Writing" section where the user picks a letter or set of letters and generates a printable tracing worksheet — large light-grey outline Urdu letters repeated in rows with guide lines, plus header with the letter name and date. A "Print" button opens the browser print dialog with a clean print-only layout (A4). The app does NOT accept uploaded handwriting — it only gives worksheets to print and practice on paper.

7. PROFILE: Shows level, XP, streak history, badges earned, and the native language setting (changeable).

GAMIFICATION: XP for every completed task, daily streak that increments when they do at least one lesson per day (and resets if they miss a day), levels that increase as XP accumulates, and badges/rewards for milestones (first lesson, 7-day streak, finishing week 1, etc.). Make it feel rewarding with confetti/animations on completion.

Seed real starter content: the first ~6 days of the 30-day beginner track (a handful of Urdu letters like ا ب پ ت ٹ ث ج with sounds and example words), 3–4 read-aloud sentences, and worksheets for those letters. Leave the rest of the 30 days as locked "coming soon" nodes.

Make it a proper installable PWA: web app manifest with name "Alif — Learn Urdu", app icons, theme color matching the vibrant palette, and offline-friendly shell. Mobile-first responsive layout that also looks good on desktop.

Build the full UI and flows now with local state/mock data for progress; we will wire up real auth and a database next.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://urdu-steps-alif.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/28aef886-5a96-4f1d-851b-bb9253946188).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

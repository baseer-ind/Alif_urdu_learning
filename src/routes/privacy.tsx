import {createFileRoute,Link} from '@tanstack/react-router';
import {ArrowLeft,ShieldCheck} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {PageTitle} from '@/components/alif/shell';
export const Route=createFileRoute('/privacy')({head:()=>({meta:[{title:'Privacy — Alif'},{name:'description',content:'How Alif handles your data: no accounts, progress stays on your device, and the microphone is optional.'},{property:'og:title',content:'Privacy — Alif'},{property:'og:description',content:'Alif keeps your learning on your own device.'},{property:'og:type',content:'website'}]}),component:Privacy});
function Privacy(){
 return <div className="legal">
  <div className="legal-badge"><ShieldCheck size={26}/></div>
  <PageTitle title="Privacy" subtitle="Last updated 14 October 2026"/>
  <p className="legal-lead">Alif is a learn-to-read-Urdu app. The short version: there are no accounts, your learning progress stays on your own device, and we don’t collect or sell your personal data.</p>
  <section className="legal-section"><h2>What stays on your device</h2><p>Your progress — XP, streak, completed days, the language you chose, and the name you type on your certificate — is saved only in your browser on this device. It is never sent to us or to anyone else, and clearing your browser’s site data removes it.</p></section>
  <section className="legal-section"><h2>The microphone (read-aloud)</h2><p>The read-aloud exercise is optional. When you use it, the app relies on your browser’s built-in speech recognition. In some browsers (for example, Chrome) your browser sends the audio to its own speech service to turn it into text. Alif receives only the recognized text — it does not record, keep, or upload your voice. You can use the whole app without ever turning on the microphone.</p></section>
  <section className="legal-section"><h2>Narration audio</h2><p>When higher-quality cloud narration is switched on, only the Urdu text of the lesson (never anything personal) is sent to Google’s Text-to-Speech service to generate the audio. With it switched off, your device’s own voice is used and nothing leaves the device.</p></section>
  <section className="legal-section"><h2>No ads, no tracking</h2><p>Alif shows no advertising and includes no third-party analytics or tracking tools. As with any website, the hosting provider may process standard technical logs (such as IP address) to serve the app securely.</p></section>
  <section className="legal-section"><h2>Children</h2><p>Alif does not knowingly collect personal information from anyone, including children. Because it keeps no accounts and stores progress only on the device, no personal profile is ever created.</p></section>
  <section className="legal-section"><h2>Changes &amp; contact</h2><p>If this policy changes, the date above will be updated. Questions about privacy can be sent to <strong>[add your contact email]</strong>.</p></section>
  <Button asChild variant="learn"><Link to="/"><ArrowLeft/>Back to learning</Link></Button>
 </div>;
}

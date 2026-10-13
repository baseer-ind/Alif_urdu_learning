export async function registerOfflineShell() {
 if(!('serviceWorker' in navigator))return;
 const host=window.location.hostname;
 const refused=!import.meta.env.PROD||window.self!==window.top||host.startsWith('id-preview--')||host.startsWith('preview--')||['lovableproject.com','lovableproject-dev.com','beta.lovable.dev'].some(domain=>host===domain||host.endsWith(`.${domain}`))||new URLSearchParams(window.location.search).get('sw')==='off';
 if(refused){const regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.filter(r=>[r.active,r.waiting,r.installing].some(w=>w&&new URL(w.scriptURL).pathname==='/sw.js')).map(r=>r.unregister()));return;}
 const {Workbox}=await import('workbox-window');const wb=new Workbox('/sw.js');await wb.register();
}

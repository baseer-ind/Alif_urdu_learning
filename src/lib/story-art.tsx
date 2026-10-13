// Original flat-vector illustrations for story books, drawn as inline SVG.
// Keyed by scene name; a story page references one by `art`.

const tortoise = (x:number,y:number,s:number) => `<g transform="translate(${x},${y}) scale(${s})">
  <ellipse cx="0" cy="26" rx="48" ry="9" fill="#00000022"/>
  <rect x="-34" y="12" width="11" height="14" rx="5" fill="#9CCC65"/><rect x="20" y="12" width="11" height="14" rx="5" fill="#9CCC65"/>
  <path d="M-46 8a46 30 0 0 1 92 0z" fill="#66BB6A"/>
  <g stroke="#2E7D32" stroke-width="2.4" fill="none" opacity=".7"><path d="M-30 -6v12"/><path d="M0 -14v20"/><path d="M30 -6v12"/><path d="M-22 0h44"/></g>
  <path d="M-46 8a46 30 0 0 1 92 0" fill="none" stroke="#2E7D32" stroke-width="3.5"/>
  <circle cx="50" cy="4" r="12" fill="#9CCC65"/><circle cx="55" cy="1" r="2.4" fill="#2A2320"/>
  <path d="M46 10q6 4 10 0" stroke="#2A2320" stroke-width="1.8" fill="none" stroke-linecap="round"/></g>`;

const hare = (x:number,y:number,s:number,sleep:boolean) => {
  const eyes = sleep
    ? `<path d="M-9 -9q4 3 8 0M4 -9q4 3 8 0" stroke="#2A2320" stroke-width="2" fill="none" stroke-linecap="round"/>`
    : `<circle cx="-5" cy="-9" r="3" fill="#2A2320"/><circle cx="8" cy="-9" r="3" fill="#2A2320"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">
    <ellipse cx="0" cy="40" rx="30" ry="8" fill="#00000022"/>
    <ellipse cx="0" cy="18" rx="24" ry="24" fill="#B0BEC5"/>
    <circle cx="26" cy="30" r="8" fill="#CFD8DC"/>
    <g><rect x="-13" y="-52" width="10" height="36" rx="5" fill="#CFD8DC"/><rect x="-10.5" y="-49" width="5" height="30" rx="2.5" fill="#FFB4C0"/>
       <rect x="5" y="-52" width="10" height="36" rx="5" fill="#CFD8DC"/><rect x="7.5" y="-49" width="5" height="30" rx="2.5" fill="#FFB4C0"/></g>
    <circle cx="2" cy="-6" r="17" fill="#CFD8DC"/>${eyes}
    <circle cx="1.5" cy="-2" r="2.6" fill="#FF8A9B"/>
    <path d="M-4 2q5 4 10 0" stroke="#2A2320" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    ${sleep?'<text x="26" y="-30" font-family="Fredoka,sans-serif" font-size="16" fill="#7C5CFC">z z Z</text>':''}</g>`;
};

const tree = (x:number,y:number,s:number) => `<g transform="translate(${x},${y}) scale(${s})"><rect x="-9" y="-8" width="18" height="72" rx="4" fill="#8B5A2B"/><circle cx="0" cy="-30" r="46" fill="#5FB85b"/><circle cx="-36" cy="-8" r="30" fill="#66bb6a"/><circle cx="36" cy="-8" r="30" fill="#66bb6a"/></g>`;
const ground = (c:string) => `<rect width="400" height="360" fill="${c}"/><rect y="272" width="400" height="88" fill="#BDE8A8"/>`;
const flag = (x:number) => `<g transform="translate(${x},150)"><rect x="-3" y="0" width="6" height="130" fill="#6b5a4a"/><g>${[0,1,2].map(r=>[0,1,2].map(col=>`<rect x="${3+col*14}" y="${r*14}" width="14" height="14" fill="${(r+col)%2?'#2A2320':'#fff'}"/>`).join('')).join('')}</g></g>`;

const ART:Record<string,string> = {
  pair: `${ground('#D8F3EE')}<circle cx="330" cy="60" r="30" fill="#FFD766"/>${tree(60,250,.8)}${tortoise(140,228,1.15)}${hare(300,214,1.05,false)}`,
  tease: `${ground('#FFF1CC')}${tortoise(110,250,1)}${hare(290,208,1.2,false)}<text x="250" y="150" font-family="Fredoka,sans-serif" font-size="26" fill="#FF6B5E">!!</text>`,
  startline: `${ground('#ECE6FF')}${flag(330)}<rect x="60" y="250" width="200" height="6" rx="3" fill="#fff"/>${tortoise(120,232,1)}${hare(210,220,.95,false)}<rect x="150" y="40" width="110" height="30" rx="8" fill="#FF6B5E"/><text x="205" y="61" text-anchor="middle" font-family="Fredoka,sans-serif" font-size="18" fill="#fff">START</text>`,
  sleep: `${ground('#D8F3EE')}<circle cx="320" cy="60" r="26" fill="#FFD766"/>${tree(150,250,1.1)}${hare(150,262,1.1,true)}`,
  pass: `${ground('#FFF1CC')}${tree(320,230,.75)}${hare(320,246,.72,true)}${tortoise(130,262,1.2)}`,
  win: `${ground('#ECE6FF')}${flag(300)}${tortoise(170,262,1.2)}${[['#FF6B5E',120,60],['#FFC23D',240,50],['#7C5CFC',180,90],['#0FA594',270,100]].map(c=>`<circle cx="${c[1]}" cy="${c[2]}" r="6" fill="${c[0]}"/>`).join('')}`,
  trophy: `${ground('#FFF1CC')}<g transform="translate(200,120)"><path d="M-34 -40h68v22a34 34 0 0 1-68 0z" fill="#FFC23D"/><path d="M-34 -30c-22 0-22 26 6 28M34 -30c22 0 22 26-6 28" stroke="#FFC23D" stroke-width="7" fill="none"/><rect x="-10" y="14" width="20" height="20" fill="#E0A82E"/><rect x="-26" y="34" width="52" height="12" rx="3" fill="#C8902A"/><text x="0" y="-8" text-anchor="middle" font-family="Fredoka,sans-serif" font-size="22" fill="#fff">★</text></g>${tortoise(200,280,1.1)}<text x="70" y="90" font-size="22">✨</text><text x="320" y="110" font-size="22">✨</text>`,
};

export const storyArtKeys = Object.keys(ART);

export function StoryArt({art,className}:{art:string;className?:string}) {
  const scene = ART[art] ?? ART['pair'];
  return (
    <div
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{__html:`<svg viewBox="0 0 400 360" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">${scene}</svg>`}}
    />
  );
}

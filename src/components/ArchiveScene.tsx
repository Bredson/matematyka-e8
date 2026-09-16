import { useId } from 'react'

export function CatMark({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M9 27V9l12 8h6L39 9v18c0 17-30 17-30 0Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M16 26h3m10 0h3m-10 6h4m-14-1-8-2m9 6-8 2m31-6 8-2m-9 6 8 2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
}

export function ArchiveScene({ small = false }: { small?: boolean }) {
  const id = useId().replace(/:/g, '')
  return <svg className={`archive-scene ${small ? 'small' : ''}`} viewBox="0 0 640 560" role="img" aria-labelledby={`${id}-title`}>
    <title id={`${id}-title`}>Kot Luna na dachu fantastycznego archiwum, otoczonego gwiazdami i unoszącymi się wyspami</title>
    <defs>
      <linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor="#25283f" /><stop offset="1" stopColor="#575473" /></linearGradient>
      <linearGradient id={`${id}-rock`} x2="0.5" y2="1"><stop stopColor="#858298" /><stop offset="1" stopColor="#49485f" /></linearGradient>
      <radialGradient id={`${id}-glow`}><stop stopColor="#eedac0" stopOpacity=".28" /><stop offset="1" stopColor="#eedac0" stopOpacity="0" /></radialGradient>
      <pattern id={`${id}-stars`} width="117" height="123" patternUnits="userSpaceOnUse"><circle cx="23" cy="29" r="1.1" fill="#e7deed" opacity=".65" /><circle cx="87" cy="77" r=".8" fill="#e7deed" opacity=".4" /></pattern>
    </defs>
    <rect width="640" height="560" rx="24" fill={`url(#${id}-sky)`} />
    <rect width="640" height="560" rx="24" fill={`url(#${id}-stars)`} />
    <circle cx="493" cy="111" r="94" fill={`url(#${id}-glow)`} />
    <path d="M513 59a47 47 0 1 0 17 83 48 48 0 0 1-17-83" fill="#ecdbbd" />
    <g stroke="#b7a9cd" fill="none" opacity=".35"><ellipse cx="327" cy="285" rx="220" ry="193" strokeDasharray="2 10" /><path d="M46 423Q320 338 587 451M38 433Q320 350 587 462" /></g>
    <g fill="#e8d7b9"><path d="m119 94 2 8 8 2-8 2-2 8-2-8-8-2 8-2ZM567 273l2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" /><circle cx="367" cy="74" r="2" /><circle cx="83" cy="237" r="2" /></g>
    <g opacity=".75"><path d="m52 335 40-9 41 12-32 35-14 9-16-18Z" fill="#595a70" /><ellipse cx="92" cy="336" rx="43" ry="10" fill="#8a8a9d" /><path d="M83 332v-38h21v38" fill="#b1a7b8" /><path d="m77 294 16-23 18 23" fill="#6d6685" /><path d="M90 318v-13q5-7 9 0v13" fill="#ead7b6" /></g>
    <path d="m157 393 51 58 39 9 26 35 52-24 31 27 44-60 64-4 35-44Z" fill={`url(#${id}-rock)`} />
    <path d="m208 425 39 35 26 35 13-73m39 49 24-61 7 88m44-60 9-29" stroke="#a49bb6" strokeWidth="2" opacity=".4" fill="none" />
    <ellipse cx="326" cy="392" rx="173" ry="38" fill="#9d9aa8" />
    <ellipse cx="326" cy="385" rx="159" ry="30" fill="#b6b0b9" />
    <path d="M216 385V246h194v139" fill="#c5b6ba" />
    <path d="M216 246h194v23H216Z" fill="#a698aa" />
    <path d="m194 251 119-93 120 93Z" fill="#7e7494" />
    <path d="m205 244 108-84 110 84M231 240l83-65 82 65M260 241l53-44 55 44" stroke="#a69ab6" strokeWidth="3" fill="none" />
    <path d="M293 176v-50h43v50l-22-18Z" fill="#cfc0c5" />
    <path d="m286 128 29-37 28 37Z" fill="#9184a3" />
    <path d="M309 151v-16q6-8 12 0v16" fill="#f3dcae" />
    <path d="M177 383V264h61v119" fill="#b5a5b6" />
    <path d="m168 266 39-60 40 60Z" fill="#81728f" />
    <path d="M391 383V222h70v161" fill="#ae9eaf" />
    <path d="m381 226 46-76 45 76Z" fill="#81738f" />
    <path d="m394 216 33-52 31 52" stroke="#ab9cba" strokeWidth="2" fill="none" />
    <path d="M426 150v-22l28 7-28 7" stroke="#cfbacd" strokeWidth="2" fill="#cfbacd" />
    <g fill="#f1d6a5" stroke="#857588" strokeWidth="5">
      <path d="M192 302v-16q14-21 28 0v16Z" /><path d="M413 267v-22q15-23 29 0v22Z" />
      <path d="M253 310v-29q15-23 30 0v29Z" /><path d="M344 310v-29q15-23 30 0v29Z" />
    </g>
    <g stroke="#ad8f84" strokeWidth="2"><path d="M207 280v22m221-58v23m-160 10v32m91-31v32" /></g>
    <path d="M289 388v-42a25 25 0 0 1 50 0v42" fill="#544a69" stroke="#e1cbbb" strokeWidth="6" />
    <path d="M314 330v59m-13-47v38m27-38v38" stroke="#8d7d98" strokeWidth="2" />
    <circle cx="322" cy="364" r="2.5" fill="#f1d6a5" />
    <path d="M285 390h59v8h-59m-8 0h75v8h-75m-8 0h91v8h-91" fill="#d5c7c5" stroke="#aaa0b0" strokeWidth="1.5" />
    <path d="M244 325h39m60 0h39m-139 41h27m74 0h35m26-79h40m-252 33h27" stroke="#aa97a7" strokeWidth="2" />
    <g fill="#625b73"><ellipse cx="384" cy="397" rx="25" ry="5" opacity=".3" /><path d="M367 394q-5-24 3-42l-3-14 14 8 13-8-1 17q10 20 0 39Z" /><path d="M390 393q34 4 29-22-2-9-9-4" fill="none" stroke="#625b73" strokeWidth="8" strokeLinecap="round" /></g>
    <path d="m373 358 4 1m9 0 4-1" stroke="#f1d6a5" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M177 385q-20-36-24-26 1 17 24 26m-2-2q-2-51-12-49-6 13 12 49m-4-10q-29-23-32-12 7 12 32 12" fill="#858b8b" />
    <g transform="translate(518 372) rotate(12)"><path d="m-25 0 25-7 30 5L7 31-8 18Z" fill="#717083" /><ellipse rx="29" ry="7" fill="#a19aa9" /><path d="M-10-3v-21l11 3v21m4 0v-30l10-2V-3" fill="#d0b7ae" /></g>
    <g transform="translate(139 177) rotate(-16)" stroke="#d4c6d6" strokeWidth="1.5" fill="#8c7f9d"><path d="M-21-10q12-5 21 2 12-7 23-2v25q-12-5-23 2-10-7-21-2Z" /><path d="M0-8v25" /></g>
    <path d="M484 194q8-9 17 0 7-9 16-1" stroke="#d9cadb" strokeWidth="2" fill="none" />
    <text x="320" y="533" textAnchor="middle" fill="#e2d9e7" fontFamily="Manrope, sans-serif" fontSize="10" letterSpacing="4">ARCHIWUM OTWIERA SIĘ PO ZMROKU</text>
  </svg>
}

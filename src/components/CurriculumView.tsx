import { curriculumAreas, curriculumSourceNote, verifiedRequirements } from '../content/curriculum'
import { pilotSessions } from '../content/pilot'
import { taskRequirements } from '../content/pilot-coverage'

export function CurriculumView() {
  return <section className="report-page">
    <span className="eyebrow">MATERIAŁY A WYMAGANIA</span><h1>Mapa zakresu E8</h1>
    <p className="page-intro">{curriculumSourceNote}</p>
    <div className="review-note"><div><h2>Co znaczy „częściowe ćwiczenie”?</h2><p>Zadanie dotyczące pola trapezu nie pokrywa całej geometrii. Poniżej łączymy konkretne zadania z konkretnymi punktami podstawy. To mapa materiałów, a nie ocena wiedzy uczennicy.</p><p>Zweryfikowano treść {verifiedRequirements.length} punktów. Pozostałe podpunkty wymagają dalszej analizy i materiałów. Koła i okręgi należą do zakresu; możliwość realizacji po egzaminie dotyczy działu VII–VIII.XV, nie wcześniejszych osi symetrii.</p></div></div>
    {curriculumAreas.map(area => {
      const requirements = verifiedRequirements.filter(r => r.reference.startsWith(`${area.reference}.`))
      const covered = requirements.filter(r => Object.values(taskRequirements).some(refs => refs.includes(r.reference)))
      return <details className="curriculum-area" key={area.id}>
        <summary><span><small>{area.reference}</small><strong>{area.title}</strong></span><span className="badge">{covered.length ? `${covered.length} pkt częściowo ćwiczone` : 'Brak zadań w pilocie'}</span></summary>
        <p>{area.summary}</p><a href={area.sourceUrl} target="_blank" rel="noreferrer">Otwórz oficjalną podstawę — klasy {area.stage}</a>
        {requirements.length === 0 && <p className="quiet">Podpunkty tego działu nie są jeszcze odwzorowane w szczegółowej matrycy.</p>}
        {requirements.map(requirement => <div className="requirement" key={requirement.reference}>
          <h3>{requirement.reference}</h3><p>„{requirement.excerpt}”</p>
          {pilotSessions.filter(s => s.tasks.some(t => taskRequirements[t.id]?.includes(requirement.reference))).map(s => <p className="quiet" key={s.id}><strong>{s.title}:</strong> {s.tasks.filter(t => taskRequirements[t.id]?.includes(requirement.reference)).map(t => `${t.title} (${t.id})`).join('; ')}</p>)}
          {!Object.values(taskRequirements).some(refs => refs.includes(requirement.reference)) && <p className="quiet">Zweryfikowane wymaganie, bez zadania w tym pilocie.</p>}
        </div>)}
      </details>
    })}
  </section>
}

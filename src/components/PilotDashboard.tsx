import { ArrowRight, Check, Clock3, LockKeyhole, NotebookPen } from 'lucide-react'
import { pilotSessions } from '../content/pilot'
import { addDays, localDate, sessionAvailability, sessionComplete, type Progress } from '../lib/progress'
import { kindLabels } from '../lib/reporting'

export function PilotDashboard({ progress, now, start, changeDate }: {
  progress: Progress; now: Date; start: (id: string) => void; changeDate: (date: string | null) => void
}) {
  const completed = pilotSessions.filter(s => sessionComplete(progress, s.id)).length
  return <section className="chapter-section" aria-labelledby="pilot-heading">
    <div className="section-heading"><div><span className="eyebrow">OSIEM SPOTKAŃ Z MATEMATYKĄ</span><h2 id="pilot-heading">Twoje pierwsze dwa tygodnie</h2></div><span className="chapter-count">{completed} / 8 sesji</span></div>
    <div className="pilot-intro">
      <p>Po dwie godziny w każdym tygodniu, razem z rozmowami z rodzicem. Daty są planem, nie terminem oddania. Masz do godziny zapasu tygodniowo na spokojne dokończenie.</p>
      <label htmlFor="pilot-start">Początek pilota<input id="pilot-start" type="date" min="0001-01-01" max="9999-12-31" value={progress.pilotStart ?? ''} onChange={e => changeDate(e.target.value || null)} /></label>
    </div>
    <p className="quiet">Możesz przetestować pilot przed październikiem. Powtórki odblokowują się co najmniej 3 dni kalendarzowe po ukończeniu odpowiedniej przygody, niezależnie od wybranej daty planu.</p>
    {[1, 2].map(week => <section className="pilot-week" key={week} aria-labelledby={`week-${week}`}>
      <h3 id={`week-${week}`}><span>Tydzień {week}</span><small>4 sesje · 120 minut</small></h3>
      <div className="session-grid">{pilotSessions.filter(s => s.week === week).map(session => {
        const available = sessionAvailability(progress, session.id, now)
        const done = sessionComplete(progress, session.id)
        const started = Boolean(progress.sessions[session.id].startedAt)
        const date = progress.pilotStart ? localDate(addDays(new Date(`${progress.pilotStart}T12:00:00`), session.day)) : `Dzień ${session.day + 1}`
        const due = session.reviewAfter && available.dueAt && !done
        return <article key={session.id} className={`session-card ${done ? 'is-complete' : ''}`}>
          <div className="session-card-top"><span className="eyebrow">{kindLabels[session.kind]}</span><span className="quiet">{date}</span></div>
          <h4>{session.title}</h4><p>{session.description}</p>
          <div className="session-meta"><span><Clock3 size={14} />{session.minutes} min</span><span>{session.tasks.length} zadań</span>{done && <span><Check size={14} />Ukończona</span>}</div>
          {!available.available && <p className="availability-note"><LockKeyhole size={14} />{available.reason}</p>}
          {due && available.available && <p className="availability-note ready">Gotowa do powtórzenia od {localDate(available.dueAt!)}. Bez nadrabiania wszystkiego naraz.</p>}
          <button className="button secondary" disabled={!available.available} onClick={() => start(session.id)} aria-label={`${done ? 'Zobacz' : started ? 'Kontynuuj' : 'Rozpocznij'}: ${session.title}`}>
            {done ? 'Zobacz sesję' : started ? 'Kontynuuj' : 'Rozpocznij'}<ArrowRight size={16} />
          </button>
        </article>
      })}</div>
    </section>)}
    <div className="review-note"><NotebookPen size={23} /><div><h2>To pilot, nie cały egzamin.</h2><p>Diagnoza próbkuje 12 obszarów. Przygody rozwijają wybrane umiejętności rachunkowe. W zakładce „Zakres” zobaczysz dokładne powiązania z podstawą i tematy, których jeszcze tu nie ma.</p></div></div>
  </section>
}

import { ArrowDownToLine, ArrowRight, BookOpen, Printer, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { pilotSessions } from '../content/pilot'
import { skillLabels } from '../content/curriculum'
import type { PilotSession } from '../content/pilot-types'
import { canShowSolutions, kindLabels, visibleResult } from '../lib/reporting'
import { diagnosisComplete, downloadBackup, firstTryIndependent, sessionAvailability, sessionComplete, type Progress, type SessionProgress, type TaskProgress } from '../lib/progress'

export function SessionPicker({ id, onChange }: { id: string; onChange: (id: string) => void }) {
  return <div className="session-picker"><label htmlFor="session-select">Wybierz sesję</label><select id="session-select" value={id} onChange={e => onChange(e.target.value)}>{pilotSessions.map(s => <option key={s.id} value={s.id}>{kindLabels[s.kind]} · {s.title}</option>)}</select></div>
}

export function DiagnosticResults({ progress, start }: { progress: Progress; start: (id: string) => void }) {
  const complete = diagnosisComplete(progress)
  const diagnosis = pilotSessions.filter(s => s.kind === 'diagnostic')
  const tasks = diagnosis.flatMap(s => s.tasks)
  const finished = tasks.filter(t => progress.tasks[t.id].completion).length
  const correct = tasks.filter(t => firstTryIndependent(progress.tasks[t.id])).length
  return <section className="diagnostic-results" aria-labelledby="diagnosis-heading">
    <h2 id="diagnosis-heading">Punkt startu — wyniki diagnozy</h2>
    {!complete ? <>
      <p>Przyjęto {finished} z 12 odpowiedzi lub pominięć. Poprawność, klucz i sugestie pokażemy po obu częściach, aby nie wpływać na pozostałe odpowiedzi.</p>
      <button className="button secondary" onClick={() => start(diagnosis.find(s => !sessionComplete(progress, s.id))!.id)}>Dokończ diagnozę<ArrowRight size={16} /></button>
    </> : <>
      <p><strong>{correct} z 12 odpowiedzi poprawnych bez zadeklarowanej pomocy.</strong> To próbka, nie wynik egzaminu ani diagnoza całej podstawy. Punkty za rozumowanie rodzic przyznaje oddzielnie.</p>
      <div className="diagnosis-grid">{tasks.map(task => {
        const state = progress.tasks[task.id]
        const label = state.completion === 'skipped' ? 'Pominięto — sprawdź spokojnie ponownie' : firstTryIndependent(state) ? 'Dobry sygnał — potwierdź w nowym zadaniu' : state.externalHelp ? 'Potrzebna próba bez pomocy' : 'Warto sprawdzić sposób rozwiązania'
        const practiced = pilotSessions.filter(s => s.kind !== 'diagnostic' && s.tasks.some(t => t.skillId === task.skillId))
        return <article key={task.id}><strong>{skillLabels[task.skillId]}</strong><p>{label}</p><small>{practiced.length ? `W pilocie: ${practiced.map(s => s.title).join(', ')}.` : 'Brak dalszych ćwiczeń w tym pilocie — temat do kolejnego zestawu.'}</small></article>
      })}</div>
      <p className="quiet">Plan ma stały zakres. Wynik pomaga wybrać temat do kolejnego zestawu, ale nie zmienia automatycznie zadań ani nie mierzy przyrostu wiedzy między różnymi testami.</p>
    </>}
  </section>
}

export function SessionReflection({ session, progress, update }: {
  session: PilotSession; progress: Progress; update: (patch: Partial<SessionProgress['reflection']>) => void
}) {
  const reflection = progress.sessions[session.id].reflection
  if (!sessionComplete(progress, session.id)) return null
  return <section className="reflection no-print">
    <h2>Jak ci się pracowało?</h2><p className="quiet">Krótka, opcjonalna notatka. Pomoże dopasować kolejne przygody. Zmiany zapisują się automatycznie.</p>
    <div className="reflection-fields">
      <label>Ile minut zajęła sesja?<input type="number" min="1" max="180" value={reflection.minutes ?? ''} onChange={e => {
        const value = e.target.value === '' ? null : Number(e.target.value)
        if (value === null || (Number.isInteger(value) && value >= 1 && value <= 180)) update({ minutes: value })
      }} /></label>
      <div className="reflection-field"><label htmlFor="reflection-difficulty">Trudność</label><select id="reflection-difficulty" value={reflection.difficulty ?? ''} onChange={e => update({ difficulty: (e.target.value || null) as SessionProgress['reflection']['difficulty'] })}><option value="">Wybierz, jeśli chcesz</option><option value="easy">Za łatwo</option><option value="right">W sam raz</option><option value="hard">Trudno</option></select></div>
      <div className="reflection-field"><label htmlFor="reflection-enjoyment">Chcę wrócić do kolejnej sesji</label><select id="reflection-enjoyment" value={reflection.enjoyment ?? ''} onChange={e => update({ enjoyment: (e.target.value || null) as SessionProgress['reflection']['enjoyment'] })}><option value="">Wybierz, jeśli chcesz</option><option value="yes">Tak</option><option value="some">Raczej tak</option><option value="no">Niezbyt</option></select></div>
    </div>
    <label>Co pomogło, a co warto zmienić?<textarea rows={3} maxLength={1000} value={reflection.note} onChange={e => update({ note: e.target.value })} /></label>
  </section>
}

export function JournalView({ progress, session, setSession, start, updateReflection }: {
  progress: Progress; session: PilotSession; setSession: (id: string) => void; start: (id: string) => void
  updateReflection: (patch: Partial<SessionProgress['reflection']>) => void
}) {
  const practice = pilotSessions.filter(s => s.kind !== 'diagnostic').flatMap(s => s.tasks)
  const completed = pilotSessions.filter(s => sessionComplete(progress, s.id)).length
  return <section className="report-page">
    <span className="eyebrow">TWOJA HISTORIA NAUKI</span><h1>Dziennik odkryć</h1>
    <p className="page-intro">Oddzielamy ukończenie sesji, wynik pierwszej próby i pracę z pomocą. Żaden z tych wskaźników sam nie potwierdza opanowania całego działu.</p>
    <div className="report-stats"><div><strong>{completed}<span> / 8</span></strong><p>ukończone sesje</p></div><div><strong>{practice.filter(t => progress.tasks[t.id].completion).length}<span> / {practice.length}</span></strong><p>zadania poza diagnozą</p></div><div><strong>{practice.filter(t => firstTryIndependent(progress.tasks[t.id])).length}</strong><p>poprawne pierwsze próby bez pomocy, poza diagnozą</p></div></div>
    <DiagnosticResults progress={progress} start={start} />
    <SessionPicker id={session.id} onChange={setSession} />
    <div className="journal-list">{session.tasks.map(task => <article className="journal-entry" key={task.id}>
      <span className="result-icon"><BookOpen size={18} /></span><div><h2>{task.title}</h2><p>{task.skill} · {progress.tasks[task.id].attempts.length} prób · {progress.tasks[task.id].hintsUsed} wskazówek</p></div><span className="badge">{visibleResult(progress, session, progress.tasks[task.id])}</span>
    </article>)}</div>
    <SessionReflection session={session} progress={progress} update={updateReflection} />
    <div className="button-row"><button className="button secondary" onClick={() => downloadBackup(progress)}><ArrowDownToLine size={17} />Pobierz kopię postępu</button></div>
    <p className="quiet">Po tygodniu zachowaj kopię także poza przeglądarką. Postęp nie synchronizuje się między urządzeniami.</p>
  </section>
}

export function ParentView({ progress, session, now, setSession, updateTask }: {
  progress: Progress; session: PilotSession; now: Date; setSession: (id: string) => void; updateTask: (id: string, patch: Partial<TaskProgress>) => void
}) {
  const [printMode, setPrintMode] = useState<'worksheet' | 'report'>('worksheet')
  const showSolutions = canShowSolutions(progress, session)
  const completedTasks = session.tasks.filter(t => progress.tasks[t.id].completion)
  const scoredTasks = completedTasks.filter(t => progress.tasks[t.id].parentPoints !== null)
  const points = scoredTasks.reduce((sum, task) => sum + (progress.tasks[task.id].parentPoints ?? 0), 0)
  const reflection = progress.sessions[session.id].reflection

  const availability = sessionAvailability(progress, session.id, now)
  if (!availability.available) return <section className="report-page parent-page">
    <div className="no-print"><span className="eyebrow">KILKA MINUT WSPÓLNEJ UWAGI</span><h1>Przystanek dla rodzica</h1><SessionPicker id={session.id} onChange={setSession} /></div>
    <h2>{session.title}</h2><p>{availability.reason}</p><p className="quiet">Polecenia i karta pracy pojawią się w dniu udostępnienia powtórki. Nowe zadania sprawdzamy po przerwie.</p>
  </section>

  return <section className={`report-page parent-page print-${printMode}`}>
    <div className="no-print"><span className="eyebrow">KILKA MINUT WSPÓLNEJ UWAGI</span><h1>Przystanek dla rodzica</h1><p className="page-intro">W sesjach 4 i 8 zaplanowano około 10 minut wspólnego przeglądu. Wybierz jeden–dwa zapisy z zeszytu i zapytaj, skąd wziął się każdy krok.</p>
      <div className="parent-instructions"><ShieldCheck size={24} /><p><strong>Oceniaj zapis, nie szybkość.</strong> Uwzględnij każdą poprawną metodę. Dwa punkty robocze za zadanie nie są oficjalną skalą CKE. Wynik automatyczny jest oddzielny od oceny rozumowania.</p></div>
      <SessionPicker id={session.id} onChange={setSession} />
      <div className="print-controls"><label htmlFor="print-mode">Co wydrukować?</label><select id="print-mode" value={printMode} onChange={e => setPrintMode(e.target.value as 'worksheet' | 'report')}><option value="worksheet">Karta pracy bez odpowiedzi</option><option value="report">Podsumowanie i dostępny klucz</option></select><button className="button secondary" onClick={() => window.print()}><Printer size={17} />Drukuj</button></div>
    </div>
    <div className="print-only worksheet"><h1>Kocie Archiwum — karta pracy</h1><p>{session.title} · {session.minutes} min · Zapisuj metody i odpowiedzi w swoim tempie.</p>{session.tasks.map((p, i) => <article className="worksheet-task" key={p.id}><h2>{i + 1}. {p.title}</h2><p>{p.id}</p><p>{p.prompt}</p><div className="writing-space" /></article>)}</div>
    <div className="parent-report">
      <div className="report-heading"><h2>{session.title}</h2>
        {showSolutions ? <p>Sprawdzono {scoredTasks.length} z {completedTasks.length} ukończonych zadań. Punkty za sprawdzone zapisy: {points}/{scoredTasks.length * 2}.</p> : <p>Klucz i oceny pojawią się po {session.kind === 'diagnostic' ? 'obu częściach diagnozy' : 'ukończeniu tej sesji'}. Karta pracy jest dostępna już teraz.</p>}
        <p className="quiet">To wynik wybranych ćwiczeń, a nie prognoza wyniku egzaminu.</p>
      </div>
      {session.tasks.map((puzzle, i) => {
        const task = progress.tasks[puzzle.id]
        return <article className="parent-task" key={puzzle.id}>
          <div className="parent-task-heading"><h3>{i + 1}. {puzzle.title}</h3><span className="badge">{visibleResult(progress, session, task)}</span></div>
          <p>{puzzle.prompt}</p><p className="quiet">ID: {puzzle.id} · Odpowiedź: {task.attempts.at(-1)?.answer ?? 'brak'} · Pomoc poza aplikacją: {task.externalHelp ? 'tak' : 'nie'} · Wskazówki: {task.hintsUsed}</p>
          {showSolutions && <>
            <div className="solution-grid"><div><h4>Rozwiązanie</h4><ol>{puzzle.solution.map(line => <li key={line}>{line}</li>)}</ol></div><div><h4>Kryteria zapisu w zeszycie</h4><ul>{puzzle.rubric.map(line => <li key={line}>{line}</li>)}</ul></div></div>
            <div className="score-field no-print"><label htmlFor={`score-${puzzle.id}`}>Ocena zapisu — {puzzle.title}</label><select id={`score-${puzzle.id}`} value={task.parentPoints ?? ''} onChange={e => updateTask(puzzle.id, { parentPoints: e.target.value === '' ? null : Number(e.target.value) })}><option value="">Jeszcze niesprawdzone</option><option value="0">0 / 2 pkt</option><option value="1">1 / 2 pkt</option><option value="2">2 / 2 pkt</option></select></div>
            <p className="print-only">Ocena rodzica: {task.parentPoints === null ? 'jeszcze niesprawdzone' : `${task.parentPoints}/2 pkt`}.</p>
          </>}
        </article>
      })}
      {sessionComplete(progress, session.id) && <div className="review-note"><div><h2>Notatka po sesji</h2><p>Czas: {reflection.minutes ?? 'nie podano'} min · Trudność: {reflection.difficulty ? { easy: 'za łatwo', right: 'w sam raz', hard: 'trudno' }[reflection.difficulty] : 'nie podano'} · Chęć powrotu: {reflection.enjoyment ? { yes: 'tak', some: 'raczej tak', no: 'niezbyt' }[reflection.enjoyment] : 'nie podano'}</p><p className="user-note">{reflection.note || 'Brak notatki.'}</p></div></div>}
    </div>
  </section>
}

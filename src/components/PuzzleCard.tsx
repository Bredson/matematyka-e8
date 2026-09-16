import { lazy, Suspense, useState, type FormEvent } from 'react'
import { ArrowRight, Check, Lightbulb } from 'lucide-react'
import type { PilotSession } from '../content/pilot-types'
import { checkAnswer } from '../lib/answers'
import { resultLabel, type TaskProgress } from '../lib/progress'
import { CatMark } from './ArchiveScene'

const MathText = lazy(() => import('./MathText').then(module => ({ default: module.MathText })))

export function PuzzleCard({ session, task, index, revealDiagnosis, update, next }: {
  session: PilotSession
  task: TaskProgress
  index: number
  revealDiagnosis: boolean
  update: (patch: Partial<TaskProgress>) => void
  next: () => void
}) {
  const puzzle = session.tasks[index]
  const diagnostic = session.kind === 'diagnostic'
  const [feedback, setFeedback] = useState('')
  const finished = Boolean(task.completion)
  const lastAttempt = task.attempts.at(-1)
  const hiddenResult = diagnostic && !revealDiagnosis

  function submit(event: FormEvent) {
    event.preventDefault()
    if (finished) return
    const result = checkAnswer(task.draft, puzzle.expected)
    if (result === 'invalid') {
      setFeedback('Wpisz liczbę (np. 0,5) albo ułamek (np. 1/2). Jednostka jest obok pola. Mianownik nie może być zerem.')
      return
    }
    if (task.attempts.length >= 500) {
      setFeedback('Zapisano już 500 prób. Skorzystaj z podpowiedzi i omówienia, żeby przejść dalej.')
      return
    }
    const now = new Date().toISOString()
    update({
      attempts: [...task.attempts, {
        answer: task.draft, correct: result === 'correct', at: now,
        assisted: Boolean(task.hintsUsed || task.externalHelp),
      }],
      ...(diagnostic ? { completion: 'submitted', completedAt: now } :
        result === 'correct' ? { completion: 'solved', completedAt: now } : {}),
    })
    setFeedback(diagnostic || result === 'correct' ? '' : 'To jeszcze nie ten wynik. Sprawdź obliczenia w zeszycie. Możesz spróbować ponownie albo skorzystać ze wskazówki.')
  }

  return <article className="puzzle-card">
    <div className="puzzle-topline">
      <span className="eyebrow">{diagnostic ? 'DIAGNOZA' : puzzle.kind === 'story' ? 'ZAGADKA' : 'SAMODZIELNA PRÓBA'} {index + 1} / {session.tasks.length}</span>
      <span className="skill-tag">{puzzle.skill}</span>
    </div>
    <h1>{puzzle.title}</h1>
    <div className={`story-box ${puzzle.kind === 'transfer' ? 'transfer' : ''}`}>
      {!diagnostic && <span className="cat-avatar"><CatMark /></span>}
      <p>{diagnostic ? 'Jedna odpowiedź, bez podpowiedzi. Możesz pominąć zadanie. Wyniki i rozwiązania zobaczysz po zakończeniu obu części diagnozy.' : puzzle.story}</p>
    </div>
    <div className="task-body">
      <span className="eyebrow">TWOJE ZADANIE · {puzzle.id}</span>
      <p>{puzzle.prompt}</p>
      {puzzle.formula && <Suspense fallback={<p className="quiet">Wczytywanie wzoru…</p>}><MathText expression={puzzle.formula} /></Suspense>}
    </div>
    <form onSubmit={submit} className="answer-form">
      <label htmlFor="answer">Twoja odpowiedź</label>
      <div className="answer-row">
        <div className="answer-input">
          <input id="answer" value={task.draft} readOnly={finished} maxLength={80} autoComplete="off" spellCheck={false}
            aria-describedby="answer-help answer-feedback" onChange={e => { update({ draft: e.target.value }); setFeedback('') }} placeholder="Wpisz wynik" />
          <span>{puzzle.unit}</span>
        </div>
        <button className="button primary" disabled={finished} type="submit">
          {finished ? <><Check size={17} />Przyjęto</> : <>{diagnostic ? 'Zatwierdź odpowiedź' : 'Sprawdź'}<ArrowRight size={17} /></>}
        </button>
      </div>
      <p id="answer-help" className="quiet">Użyj przecinka lub kropki. Ułamki zapisuj jako 1/2. Obliczenia zostaw w zeszycie.</p>
      <label className="external-help"><input type="checkbox" checked={task.externalHelp} onChange={e => update({ externalHelp: e.target.checked })} />Korzystałam z pomocy poza aplikacją</label>
      <div id="answer-feedback" aria-live="polite">
        {feedback && <p className="answer-feedback">{feedback}</p>}
        {!diagnostic && !feedback && !finished && lastAttempt && !lastAttempt.correct && <p className="answer-feedback">Ostatnia próba: {lastAttempt.answer}. Sprawdź obliczenia i spróbuj ponownie.</p>}
      </div>
      {diagnostic && !finished && <button className="text-button" type="button" onClick={() => {
        update({ completion: 'skipped', completedAt: new Date().toISOString() }); setFeedback('')
      }}>Nie wiem — pomiń zadanie</button>}
    </form>
    {!diagnostic && !finished && <section className="hints" aria-label="Podpowiedzi">
      <button className="text-button" disabled={task.hintsUsed === 3} onClick={() => update({ hintsUsed: task.hintsUsed + 1 })}>
        <Lightbulb size={18} />{['Potrzebuję wskazówki', 'Pokaż pierwszy krok', 'Pokaż pełne rozwiązanie', 'Wszystkie wskazówki odsłonięte'][task.hintsUsed]}<span>{task.hintsUsed}/3</span>
      </button>
      <div aria-live="polite">{puzzle.hints.slice(0, task.hintsUsed).map((hint, i) => <p key={hint}><strong>{i === 2 ? 'Rozwiązanie' : `Wskazówka ${i + 1}`}.</strong> {hint}</p>)}</div>
      {task.hintsUsed === 3 && <button className="button secondary" onClick={() => update({ completion: 'reviewed', completedAt: new Date().toISOString() })}>Rozumiem omówienie — przejdź dalej<ArrowRight size={17} /></button>}
    </section>}
    {finished && <section className="success-panel" aria-label="Wynik zadania">
      <span className="eyebrow"><Check size={15} />{hiddenResult ? 'ODPOWIEDŹ PRZYJĘTA' : resultLabel(task)}</span>
      <h2>{hiddenResult ? (task.completion === 'skipped' ? 'Możesz ruszyć dalej.' : 'Dziękuję. Przejdź do kolejnego kroku.') : diagnostic ? resultLabel(task) : task.completion === 'reviewed' ? 'Ważny krok: zrozumieć rozwiązanie.' : 'Tak, to poprawny wynik.'}</h2>
      <p>{hiddenResult ? 'Nie pokazujemy jeszcze poprawności ani rozwiązania, żeby kolejne odpowiedzi były samodzielne.' : puzzle.discovery}</p>
      {!hiddenResult && <>
        <p className="quiet">Sam wynik nie ocenia rozumowania. Porównaj zapis w zeszycie z rozwiązaniem; wynik z pomocą nie jest samodzielnym potwierdzeniem umiejętności.</p>
        <details><summary>Porównaj z rozwiązaniem</summary><ol>{puzzle.solution.map(line => <li key={line}>{line}</li>)}</ol></details>
      </>}
      <button className="button primary" onClick={next}>{index === session.tasks.length - 1 ? 'Podsumuj sesję' : 'Idź dalej'}<ArrowRight size={17} /></button>
    </section>}
  </article>
}

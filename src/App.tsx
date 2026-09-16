import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDownToLine, ArrowLeft, ArrowRight, ArrowUpFromLine, BookOpen, Check, ChevronRight, Clock3, Compass, FileText, Lightbulb, LockKeyhole, Moon, NotebookPen, Printer, ShieldCheck, Sparkles, X } from 'lucide-react'
import { adventure, puzzles, type Puzzle } from './content/adventure'
import { ArchiveScene, CatMark } from './components/ArchiveScene'
import { checkAnswer } from './lib/answers'
import { BACKUP_LIMIT, downloadBackup, loadProgress, nextPuzzleIndex, parseProgress, resultLabel, STORAGE_KEY, type Progress, type TaskProgress } from './lib/progress'

type View = 'home' | 'play' | 'journal' | 'parent'
const MathText = lazy(() => import('./components/MathText').then(module => ({ default: module.MathText })))

function App() {
  const [initial] = useState(loadProgress)
  const [progress, setProgress] = useState(initial.progress)
  const [storageIssue, setStorageIssue] = useState(initial.issue)
  const [view, setView] = useState<View>('home')
  const [puzzleIndex, setPuzzleIndex] = useState(() => nextPuzzleIndex(initial.progress))
  const [notice, setNotice] = useState('')
  const [backupOpen, setBackupOpen] = useState(false)
  const [incoming, setIncoming] = useState<Progress | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const importDialog = useRef<HTMLDialogElement>(null)
  const main = useRef<HTMLElement>(null)
  const firstRender = useRef(true)
  const completed = puzzles.filter(p => progress.tasks[p.id].completion).length
  const independent = puzzles.filter(p => resultLabel(progress.tasks[p.id]) === 'Samodzielnie').length

  useEffect(() => {
    if (storageIssue) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)) }
    catch { setStorageIssue('Nie udało się zapisać zmian w przeglądarce. Pobierz kopię postępu przed zamknięciem aplikacji.') }
  }, [progress, storageIssue])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) setStorageIssue('Zapis zmienił się w innej karcie lub został usunięty. Zatrzymano zapis tej karty. Pobierz kopię swojej pracy, a następnie odśwież stronę, aby odczytać aktualne dane.')
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    main.current?.focus()
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [view, puzzleIndex])

  useEffect(() => { if (incoming) importDialog.current?.showModal() }, [incoming])

  function updateTask(id: string, patch: Partial<TaskProgress>) {
    setProgress(previous => ({ ...previous, updatedAt: new Date().toISOString(), tasks: {
      ...previous.tasks, [id]: { ...previous.tasks[id], ...patch },
    } }))
  }

  function startAdventure() {
    if (!progress.startedAt) setProgress(p => ({ ...p, startedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }))
    setPuzzleIndex(nextPuzzleIndex(progress))
    setView('play')
  }

  async function readBackup(file?: File) {
    if (!file) return
    try {
      if (file.size > BACKUP_LIMIT) throw new Error('Plik jest zbyt duży. Maksymalny rozmiar kopii to 1 MB.')
      setIncoming(parseProgress(await file.text()))
      setNotice('')
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Nie udało się otworzyć pliku.') }
    finally { if (fileInput.current) fileInput.current.value = '' }
  }

  function restoreBackup() {
    if (!incoming) return
    setProgress({ ...incoming, updatedAt: new Date().toISOString() })
    setStorageIssue(null)
    setPuzzleIndex(nextPuzzleIndex(incoming))
    setIncoming(null)
    setView('journal')
    setNotice('Wczytano kopię. Sprawdź postęp w dzienniku.')
  }

  return <>
    <a className="skip-link" href="#main">Przejdź do treści</a>
    <header className="site-header no-print">
      <button className="brand" onClick={() => setView('home')} aria-label="Kocie Archiwum — strona główna">
        <span className="brand-icon"><CatMark /></span>
        <span>Kocie Archiwum<small>MATEMATYKA Z INNEGO ŚWIATA</small></span>
      </button>
      <nav aria-label="Nawigacja główna">
        <button aria-current={view === 'home' || view === 'play' ? 'page' : undefined} onClick={() => setView('home')}><Compass size={17} />Przygoda</button>
        <button aria-current={view === 'journal' ? 'page' : undefined} onClick={() => setView('journal')}><BookOpen size={17} />Dziennik</button>
        <button aria-current={view === 'parent' ? 'page' : undefined} onClick={() => setView('parent')}><ShieldCheck size={17} />Dla rodzica</button>
      </nav>
      <button className="backup-toggle" aria-expanded={backupOpen} onClick={() => setBackupOpen(!backupOpen)}><ArrowDownToLine size={17} /><span>Kopia postępu</span></button>
    </header>

    {backupOpen && <section className="backup-panel no-print" aria-label="Kopie postępu">
      <div><strong>Twoja przygoda, bezpiecznie w pliku.</strong><p>Postęp jest tylko w tej przeglądarce. Pobierz kopię raz w tygodniu i przed zmianą komputera.</p></div>
      <div className="button-row"><button className="button secondary" onClick={() => { downloadBackup(progress); setNotice('Przekazano kopię do pobrania. Sprawdź folder Pobrane.') }}><ArrowDownToLine size={17} />Pobierz kopię</button>
        <button className="button secondary" onClick={() => fileInput.current?.click()}><ArrowUpFromLine size={17} />Wczytaj kopię</button></div>
    </section>}
    <input ref={fileInput} type="file" accept=".json,application/json" hidden aria-label="Plik kopii postępu" onChange={e => void readBackup(e.target.files?.[0])} />
    {storageIssue && <div className="alert error no-print" role="alert">{storageIssue} <button onClick={() => setBackupOpen(true)}>Otwórz kopie postępu</button></div>}
    {notice && <div className="alert no-print" role="status"><span>{notice}</span><button aria-label="Zamknij komunikat" onClick={() => setNotice('')}><X size={17} /></button></div>}

    <main id="main" ref={main} tabIndex={-1}>
      {view === 'home' && <>
        <div className="welcome-line"><span><span className="status-dot" /> TWÓJ MAŁY RYTUAŁ ODKRYWANIA</span><span>Pierwsza przygoda · wersja próbna</span></div>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><Moon size={15} /> WITAJ W KOCIM ARCHIWUM</div>
            <h1>Wielkie tajemnice.<br /><em>Małe kocie kroki.</em></h1>
            <p>Za tymi drzwiami znikają mapy, regały potrafią latać, a koty wiedzą więcej, niż mówią. Jedna zagadka i jesteś bliżej rozwiązania.</p>
            <button className="button primary hero-button" onClick={startAdventure}>{completed === puzzles.length ? 'Wróć do przygody' : progress.startedAt ? 'Kontynuuj przygodę' : 'Otwórz archiwum'}<ArrowRight size={19} /></button>
            <div className="hero-meta"><span><Clock3 size={16} />{adventure.duration}</span><span><NotebookPen size={16} />Przyda się zeszyt</span></div>
            <div className="companion-note"><span className="cat-avatar"><CatMark /></span><p>„Nie musisz wiedzieć wszystkiego.<br />Od tego są przygody.”<strong>Luna, opiekunka archiwum</strong></p></div>
          </div>
          <div className="hero-art"><ArchiveScene /><span className="art-label"><Sparkles size={13} /> MIEJSCE, GDZIE LICZBY OTWIERAJĄ DRZWI</span></div>
        </section>
        <section className="chapter-section" aria-labelledby="chapter-heading">
          <div className="section-heading"><div><span className="eyebrow">TWOJA PIERWSZA WYPRAWA</span><h2 id="chapter-heading">Tajemnica zaginionej strony</h2></div><span className="chapter-count">Prolog / 01</span></div>
          <div className="chapter-grid">
            <div className="chapter-route">
              {puzzles.map((puzzle, index) => {
                const done = Boolean(progress.tasks[puzzle.id].completion)
                const locked = index > 0 && !progress.tasks[puzzles[index - 1].id].completion
                return <button key={puzzle.id} disabled={locked} className={`route-stop ${done ? 'done' : ''}`} onClick={() => {
                  if (!progress.startedAt) setProgress(p => ({ ...p, startedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }))
                  setPuzzleIndex(index); setView('play')
                }}>
                  <span className="route-number">{done ? <Check size={18} /> : locked ? <LockKeyhole size={16} /> : String(index + 1).padStart(2, '0')}</span>
                  <span><small>{puzzle.kind === 'transfer' ? 'KRÓTKIE SPRAWDZENIE' : puzzle.place.toLocaleUpperCase('pl')}</small><strong>{puzzle.title}</strong></span>
                  <ChevronRight className="route-arrow" size={18} />
                </button>
              })}
            </div>
            <aside className="journey-note"><span className="eyebrow">WE WŁASNYM TEMPIE</span><h3>Tu nie ma<br />wyścigu.</h3><p>Możesz się pomylić, poprosić o wskazówkę albo zrobić przerwę. Luna poczeka.</p><div className="small-progress"><span>{completed} z 4 etapów</span><span>{Math.round(completed / 4 * 100)}%</span></div><progress max={4} value={completed} aria-label="Ukończenie pierwszej przygody" /></aside>
          </div>
        </section>
        <div className="home-bottom"><span><NotebookPen size={20} />Rozwiązuj na kartce.<br /><strong>Na ekranie wpisuj odpowiedzi.</strong></span><span><Lightbulb size={20} />Wskazówki są po to,<br /><strong>żeby pomóc ci ruszyć dalej.</strong></span><span><BookOpen size={20} />Ukończenie historii to początek.<br /><strong>Umiejętności sprawdzamy osobno.</strong></span></div>
      </>}

      {view === 'play' && <div className="play-layout">
        <aside className="play-sidebar no-print">
          <button className="text-button" onClick={() => setView('home')}><ArrowLeft size={16} />Wróć do archiwum</button>
          <span className="eyebrow">PROLOG · PIERWSZA WYPRAWA</span><h2>{adventure.title}</h2>
          <ol className="puzzle-nav">{puzzles.map((p, index) => <li key={p.id}><button aria-current={index === puzzleIndex ? 'step' : undefined} disabled={index > 0 && !progress.tasks[puzzles[index - 1].id].completion} onClick={() => setPuzzleIndex(index)}><span>{progress.tasks[p.id].completion ? <Check size={16} /> : index + 1}</span>{p.place}</button></li>)}</ol>
          <div className="sidebar-note"><CatMark /><p>„Najpierw ołówek… a właściwie długopis. Potem magia.”<strong>— Luna</strong></p></div>
          <p className="quiet">Nie musisz kończyć teraz. Wrócisz do zapisanych odpowiedzi w tej przeglądarce.</p>
        </aside>
        <PuzzleCard key={puzzles[puzzleIndex].id} puzzle={puzzles[puzzleIndex]} task={progress.tasks[puzzles[puzzleIndex].id]} index={puzzleIndex} update={patch => updateTask(puzzles[puzzleIndex].id, patch)} next={() => puzzleIndex < puzzles.length - 1 ? setPuzzleIndex(puzzleIndex + 1) : setView('journal')} />
      </div>}

      {view === 'journal' && <section className="report-page">
        <div className="eyebrow">TWOJA HISTORIA NAUKI</div><h1>Dziennik odkryć</h1><p className="page-intro">Każda próba coś pokazuje. Zobacz, co już za tobą i do czego warto wrócić.</p>
        <div className="report-stats"><div><strong>{completed}<span> / 4</span></strong><p>ukończone etapy</p></div><div><strong>{independent}</strong><p>bez podpowiedzi</p></div><div><strong>{completed - independent}</strong><p>z pomocą lub po omówieniu</p></div></div>
        {!progress.startedAt && <div className="empty-state"><CatMark /><h2>Jeszcze nie ma tu śladów łap.</h2><p>Pierwsza przygoda czeka. Jej wyniki pojawią się tutaj.</p><button className="button primary" onClick={startAdventure}>Otwórz archiwum<ArrowRight size={17} /></button></div>}
        <div className="journal-list">{puzzles.map(p => <article key={p.id} className="journal-entry"><span className={`result-icon ${progress.tasks[p.id].completion ? 'done' : ''}`}>{progress.tasks[p.id].completion ? <Check size={19} /> : <BookOpen size={18} />}</span><div><h2>{p.title}</h2><p>{p.skill} · {progress.tasks[p.id].attempts.length} prób · {progress.tasks[p.id].hintsUsed} wskazówek</p></div><span className="badge">{resultLabel(progress.tasks[p.id])}</span></article>)}</div>
        <div className="review-note"><Lightbulb size={24} /><div><h2>Odkrycie nie znika po jednym błędzie.</h2><p>Ten prolog sprawdza tylko wybrane umiejętności. Nawet samodzielny bilet wyjścia nie oznacza opanowania całego działu. Za kilka dni warto rozwiązać inne, podobne zadanie.</p><p className="quiet">Automatyczny harmonogram powtórek powstanie w kolejnej wersji.</p></div></div>
        <div className="button-row"><button className="button secondary" onClick={() => { downloadBackup(progress); setNotice('Przekazano kopię do pobrania. Zachowaj plik w folderze Pobrane.') }}><ArrowDownToLine size={17} />Pobierz kopię postępu</button><button className="text-button" onClick={() => setView('parent')}>Zobacz podsumowanie dla rodzica<ArrowRight size={16} /></button></div>
      </section>}

      {view === 'parent' && <ParentView progress={progress} updateTask={updateTask} />}
    </main>

    <footer className="site-footer no-print"><span><CatMark />Kocie Archiwum<span className="footer-separator">/</span>Małe kroki. Własna droga.</span><span>{storageIssue ? 'Zapis wymaga uwagi' : 'Postęp zapisywany w tej przeglądarce'}<span className={`status-dot ${storageIssue ? 'warning' : ''}`} /></span></footer>

    {incoming && <dialog ref={importDialog} onCancel={() => setIncoming(null)} className="import-dialog" aria-labelledby="import-heading">
      <div className="dialog-icon"><ArrowUpFromLine size={24} /></div><h2 id="import-heading">Wczytać tę kopię?</h2>
      <p>Kopia zawiera {puzzles.filter(p => incoming.tasks[p.id].completion).length} z 4 ukończonych etapów. Zapis z {new Date(incoming.updatedAt).toLocaleString('pl-PL')}.</p>
      <p><strong>Zastąpi obecny postęp ({completed}/4 etapów).</strong> Jeśli chcesz go zachować, najpierw pobierz obecną kopię.</p>
      <button className="text-button" onClick={() => downloadBackup(progress)}><ArrowDownToLine size={16} />Pobierz obecną kopię</button>
      <div className="button-row"><button className="button secondary" onClick={() => setIncoming(null)}>Anuluj</button><button className="button primary" onClick={restoreBackup}>Zastąp postęp kopią</button></div>
    </dialog>}
  </>
}

function PuzzleCard({ puzzle, task, index, update, next }: { puzzle: Puzzle; task: TaskProgress; index: number; update: (patch: Partial<TaskProgress>) => void; next: () => void }) {
  const [feedback, setFeedback] = useState('')
  const lastAttempt = task.attempts.at(-1)
  const finished = Boolean(task.completion)

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (finished) return
    const result = checkAnswer(task.draft, puzzle.expected)
    if (result === 'invalid') { setFeedback('Wpisz liczbę (np. 0,5) albo ułamek (np. 1/2). Jednostka jest obok pola. Mianownik nie może być zerem.'); return }
    if (task.attempts.length >= 500) { setFeedback('Zapisano już 500 prób. Skorzystaj z podpowiedzi i omówienia, żeby przejść dalej.'); return }
    const now = new Date().toISOString()
    update({ attempts: [...task.attempts, { answer: task.draft, correct: result === 'correct', at: now }], ...(result === 'correct' ? { completion: 'solved', completedAt: now } : {}) })
    setFeedback(result === 'correct' ? '' : 'To jeszcze nie ten wynik. Sprawdź obliczenia w zeszycie. Możesz spróbować ponownie albo skorzystać ze wskazówki.')
  }

  return <article className="puzzle-card">
    <div className="puzzle-topline"><span className="eyebrow">{puzzle.kind === 'story' ? 'ZAGADKA' : 'BILET WYJŚCIA'} {index + 1} / 4</span><span className="skill-tag">{puzzle.skill}</span></div>
    <h1>{puzzle.title}</h1>
    <div className={`story-box ${puzzle.kind === 'transfer' ? 'transfer' : ''}`}><span className="cat-avatar"><CatMark /></span><p>{puzzle.story}</p></div>
    <div className="task-body"><span className="eyebrow">TWOJE ZADANIE</span><p>{puzzle.prompt}</p>{puzzle.formula && <Suspense fallback={<p className="quiet">Wczytywanie wzoru…</p>}><MathText expression={puzzle.formula} /></Suspense>}</div>
    <form onSubmit={submit} className="answer-form">
      <label htmlFor="answer">Twoja odpowiedź</label>
      <div className="answer-row"><div className="answer-input"><input id="answer" value={task.draft} readOnly={finished} maxLength={80} autoComplete="off" spellCheck={false} aria-describedby="answer-help answer-feedback" onChange={e => { update({ draft: e.target.value }); setFeedback('') }} placeholder="Wpisz wynik" /><span>{puzzle.unit}</span></div><button className="button primary" disabled={finished} type="submit">{finished ? <><Check size={17} />Ukończone</> : <>Sprawdź<ArrowRight size={17} /></>}</button></div>
      <p id="answer-help" className="quiet">Użyj przecinka lub kropki. Ułamki zapisuj jako 1/2. Obliczenia zostaw w zeszycie.</p>
      <label className="external-help"><input type="checkbox" checked={task.externalHelp} onChange={e => update({ externalHelp: e.target.checked })} />Korzystałam z pomocy poza aplikacją</label>
      <div id="answer-feedback" aria-live="polite">{feedback && <p className="answer-feedback">{feedback}</p>}{!feedback && !finished && lastAttempt && !lastAttempt.correct && <p className="answer-feedback">Ostatnia próba: {lastAttempt.answer}. Sprawdź obliczenia i spróbuj ponownie.</p>}</div>
    </form>
    {!finished && <section className="hints" aria-label="Podpowiedzi">
      <button className="text-button" disabled={task.hintsUsed === 3} onClick={() => update({ hintsUsed: task.hintsUsed + 1 })}><Lightbulb size={18} />{task.hintsUsed === 0 ? 'Potrzebuję wskazówki' : task.hintsUsed === 1 ? 'Pokaż pierwszy krok' : task.hintsUsed === 2 ? 'Pokaż pełne rozwiązanie' : 'Wszystkie wskazówki odsłonięte'}<span>{task.hintsUsed}/3</span></button>
      <div aria-live="polite">{puzzle.hints.slice(0, task.hintsUsed).map((hint, i) => <p key={hint}><strong>{i === 2 ? 'Rozwiązanie' : `Wskazówka ${i + 1}`}.</strong> {hint}</p>)}</div>
      {task.hintsUsed === 3 && <button className="button secondary" onClick={() => update({ completion: 'reviewed', completedAt: new Date().toISOString() })}>Rozumiem omówienie — przejdź dalej<ArrowRight size={17} /></button>}
    </section>}
    {finished && <section className="success-panel" aria-label="Wynik zadania"><span className="eyebrow"><Check size={15} />{resultLabel(task)}</span><h2>{task.completion === 'reviewed' ? 'Ważny krok: zrozumieć rozwiązanie.' : 'Tak, to poprawny wynik.'}</h2><p>{puzzle.discovery}</p><p className="quiet">{task.hintsUsed || task.externalHelp ? 'Zapisano korzystanie z pomocy. Warto wrócić do tej umiejętności w nowym zadaniu.' : 'Zapisano wynik bez podpowiedzi. Poprawność rozumowania sprawdzisz, porównując zapis w zeszycie z rozwiązaniem.'}</p><details><summary>Porównaj z rozwiązaniem</summary><ol>{puzzle.solution.map(line => <li key={line}>{line}</li>)}</ol></details><button className="button primary" onClick={next}>{index === puzzles.length - 1 ? 'Zobacz dziennik odkryć' : 'Idź dalej'}<ArrowRight size={17} /></button></section>}
  </article>
}

function ParentView({ progress, updateTask }: { progress: Progress; updateTask: (id: string, patch: Partial<TaskProgress>) => void }) {
  const [printMode, setPrintMode] = useState<'worksheet' | 'report'>('worksheet')
  const completedTasks = puzzles.filter(p => progress.tasks[p.id].completion)
  const scoredTasks = completedTasks.filter(p => progress.tasks[p.id].parentPoints !== null)
  const points = scoredTasks.reduce((total, p) => total + (progress.tasks[p.id].parentPoints ?? 0), 0)

  return <section className={`report-page parent-page print-${printMode}`}>
    <div className="no-print"><span className="eyebrow">KILKA MINUT WSPÓLNEJ UWAGI</span><h1>Przystanek dla rodzica</h1><p className="page-intro">Wynik sprawdza aplikacja. Tok rozumowania najlepiej widać w zeszycie. Wybierz jedno lub dwa ukończone zadania i porównaj zapis z kluczem.</p>
      <div className="parent-instructions"><ShieldCheck size={24} /><p><strong>Oceniaj zapis, nie szybkość.</strong> Zapytaj: „Skąd wziął się ten krok?”. Uwzględnij każdą poprawną metodę. Poniżej są robocze kryteria ćwiczeń, nie oficjalna punktacja CKE.</p></div>
      <div className="print-controls"><label htmlFor="print-mode">Co wydrukować?</label><select id="print-mode" value={printMode} onChange={e => setPrintMode(e.target.value as 'worksheet' | 'report')}><option value="worksheet">Karta pracy bez odpowiedzi</option><option value="report">Podsumowanie i klucz dla rodzica</option></select><button className="button secondary" onClick={() => window.print()}><Printer size={17} />Drukuj</button></div>
    </div>
    <div className="print-only worksheet"><h1>Kocie Archiwum — karta pracy</h1><p>{adventure.title} · Zapisuj obliczenia i odpowiedzi. Pracuj we własnym tempie.</p>{puzzles.map((p, i) => <article className="worksheet-task" key={p.id}><h2>{i + 1}. {p.title}</h2><p>{p.prompt}</p><div className="writing-space" /></article>)}</div>
    <div className="parent-report"><div className="report-heading"><h2>Prolog: {adventure.title}</h2><p>Sprawdzono {scoredTasks.length} z {completedTasks.length} ukończonych zadań. Punkty za sprawdzone zapisy: {points}/{scoredTasks.length * 2}.</p><p className="quiet">To wynik wybranych ćwiczeń, a nie prognoza wyniku egzaminu.</p></div>
      {puzzles.map((puzzle, index) => {
        const task = progress.tasks[puzzle.id]
        return <article className="parent-task" key={puzzle.id}><div className="parent-task-heading"><h3>{index + 1}. {puzzle.title}</h3><span className="badge">{resultLabel(task)}</span></div><p>{puzzle.prompt}</p><div className="solution-grid"><div><h4>Rozwiązanie</h4><ol>{puzzle.solution.map(line => <li key={line}>{line}</li>)}</ol></div><div><h4>Kryteria zapisu w zeszycie</h4><ul>{puzzle.rubric.map(line => <li key={line}>{line}</li>)}</ul></div></div><p className="quiet">Próby: {task.attempts.length} · Użyte wskazówki: {task.hintsUsed}/3 · Ostatnia odpowiedź: {task.attempts.at(-1)?.answer ?? 'brak'}</p><div className="score-field no-print"><label htmlFor={`score-${puzzle.id}`}>Ocena zapisu — {puzzle.title}</label><select id={`score-${puzzle.id}`} disabled={!task.completion} value={task.parentPoints ?? ''} onChange={e => updateTask(puzzle.id, { parentPoints: e.target.value === '' ? null : Number(e.target.value) })}><option value="">Jeszcze niesprawdzone</option><option value="0">0 / 2 pkt</option><option value="1">1 / 2 pkt</option><option value="2">2 / 2 pkt</option></select>{!task.completion && <span className="quiet">Dostępne po ukończeniu zadania.</span>}</div><p className="print-only">Ocena rodzica: {task.parentPoints === null ? 'jeszcze niesprawdzone' : `${task.parentPoints}/2 pkt`}.</p></article>
      })}
    </div>
    <div className="review-note no-print"><FileText size={24} /><div><h2>Co zawiera ta wersja?</h2><p>Jedną przygodę z trzema zagadkami i biletem wyjścia. Diagnoza, kolejne przygody, plan powtórek i Detektyw błędów są zaplanowane w następnych etapach. Pełny zakres egzaminacyjny nie jest jeszcze pokryty.</p></div></div>
  </section>
}

export default App

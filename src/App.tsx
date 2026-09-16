import { useEffect, useRef, useState } from 'react'
import { ArrowDownToLine, ArrowLeft, ArrowRight, ArrowUpFromLine, BookOpen, Check, Compass, ListChecks, Moon, ShieldCheck, Sparkles, X } from 'lucide-react'
import { pilotSessions } from './content/pilot'
import { ArchiveScene, CatMark } from './components/ArchiveScene'
import { PuzzleCard } from './components/PuzzleCard'
import { PilotDashboard } from './components/PilotDashboard'
import { CurriculumView } from './components/CurriculumView'
import { JournalView, ParentView, SessionReflection } from './components/PilotReports'
import { kindLabels } from './lib/reporting'
import {
  BACKUP_LIMIT, diagnosisComplete, downloadBackup, LEGACY_STORAGE_KEY, loadProgress,
  localDate, nextPuzzleIndex, nextSessionId, parseProgress, pilotStartDateSchema, sessionAvailability,
  STORAGE_KEY, type Progress, type SessionProgress, type TaskProgress,
} from './lib/progress'

type View = 'home' | 'play' | 'summary' | 'journal' | 'parent' | 'curriculum'
const allTasks = pilotSessions.flatMap(session => session.tasks)

export default function App() {
  const [initial] = useState(loadProgress)
  const [progress, setProgress] = useState(initial.progress)
  const [storageIssue, setStorageIssue] = useState(initial.issue)
  const [view, setView] = useState<View>('home')
  const [sessionId, setSessionId] = useState(() => nextSessionId(initial.progress) ?? 'prolog')
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [notice, setNotice] = useState('')
  const [backupOpen, setBackupOpen] = useState(false)
  const [incoming, setIncoming] = useState<Progress | null>(null)
  const [now, setNow] = useState(() => new Date())
  const fileInput = useRef<HTMLInputElement>(null)
  const importDialog = useRef<HTMLDialogElement>(null)
  const main = useRef<HTMLElement>(null)
  const session = pilotSessions.find(s => s.id === sessionId)!
  const suggested = nextSessionId(progress, now)
  const completed = allTasks.filter(task => progress.tasks[task.id].completion).length

  useEffect(() => {
    if (storageIssue) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)) }
    catch { setStorageIssue('Nie udało się zapisać zmian w przeglądarce. Pobierz kopię postępu przed zamknięciem aplikacji.') }
  }, [progress, storageIssue])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if ([STORAGE_KEY, LEGACY_STORAGE_KEY, null].includes(event.key)) setStorageIssue('Zapis zmienił się w innej karcie lub został usunięty. Zatrzymano zapis tej karty. Pobierz kopię swojej pracy i odśwież stronę, aby odczytać aktualne dane.')
    }
    window.addEventListener('storage', onStorage)
    const interval = window.setInterval(() => setNow(new Date()), 60_000)
    return () => { window.removeEventListener('storage', onStorage); window.clearInterval(interval) }
  }, [])

  useEffect(() => {
    main.current?.focus()
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [view, puzzleIndex])

  useEffect(() => { if (incoming) importDialog.current?.showModal() }, [incoming])

  function updateTask(id: string, patch: Partial<TaskProgress>) {
    setProgress(previous => ({ ...previous, updatedAt: new Date().toISOString(), tasks: {
      ...previous.tasks, [id]: { ...previous.tasks[id], ...patch },
    } }))
  }

  function updateReflection(patch: Partial<SessionProgress['reflection']>) {
    setProgress(previous => ({ ...previous, updatedAt: new Date().toISOString(), sessions: {
      ...previous.sessions, [sessionId]: { ...previous.sessions[sessionId], reflection: {
        ...previous.sessions[sessionId].reflection, ...patch,
      } },
    } }))
  }

  function startSession(id: string) {
    const availability = sessionAvailability(progress, id, new Date())
    if (!availability.available) { setNotice(availability.reason); return }
    const at = new Date().toISOString()
    setProgress(previous => ({
      ...previous, updatedAt: at, startedAt: previous.startedAt ?? at,
      pilotStart: previous.pilotStart ?? localDate(),
      sessions: { ...previous.sessions, [id]: { ...previous.sessions[id], startedAt: previous.sessions[id].startedAt ?? at } },
    }))
    setSessionId(id)
    setPuzzleIndex(nextPuzzleIndex(progress, id))
    setView('play')
  }

  function changePilotDate(date: string | null) {
    if (date !== null && !pilotStartDateSchema.safeParse(date).success) {
      setNotice('Nie zmieniono daty. Wpisz poprawną datę z czterocyfrowym rokiem, np. 2026-10-01.')
      return
    }
    setProgress(previous => ({ ...previous, pilotStart: date, updatedAt: new Date().toISOString() }))
  }

  async function readBackup(file?: File) {
    if (!file) return
    try {
      if (file.size > BACKUP_LIMIT) throw new Error('Plik jest zbyt duży. Maksymalny rozmiar kopii to 5 MB.')
      setIncoming(parseProgress(await file.text()))
      setNotice('')
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Nie udało się otworzyć pliku.') }
    finally { if (fileInput.current) fileInput.current.value = '' }
  }

  function restoreBackup() {
    if (!incoming) return
    setProgress({ ...incoming, updatedAt: new Date().toISOString() })
    setStorageIssue(null)
    setSessionId(nextSessionId(incoming) ?? 'prolog')
    setPuzzleIndex(0)
    setIncoming(null)
    setView('journal')
    setNotice('Wczytano kopię. Sprawdź postęp w dzienniku. Kopie prologu są automatycznie uzupełniane o puste sesje pilota.')
  }

  return <>
    <a className="skip-link" href="#main">Przejdź do treści</a>
    <header className="site-header no-print">
      <button className="brand" onClick={() => setView('home')} aria-label="Kocie Archiwum — strona główna"><span className="brand-icon"><CatMark /></span><span>Kocie Archiwum<small>MATEMATYKA Z INNEGO ŚWIATA</small></span></button>
      <nav aria-label="Nawigacja główna">
        <button aria-current={['home', 'play', 'summary'].includes(view) ? 'page' : undefined} onClick={() => setView('home')}><Compass size={17} />Pilot</button>
        <button aria-current={view === 'journal' ? 'page' : undefined} onClick={() => setView('journal')}><BookOpen size={17} />Dziennik</button>
        <button aria-current={view === 'parent' ? 'page' : undefined} onClick={() => setView('parent')}><ShieldCheck size={17} />Dla rodzica</button>
        <button aria-current={view === 'curriculum' ? 'page' : undefined} onClick={() => setView('curriculum')}><ListChecks size={17} />Zakres</button>
      </nav>
      <button className="backup-toggle" aria-expanded={backupOpen} onClick={() => setBackupOpen(!backupOpen)}><ArrowDownToLine size={17} /><span>Kopia postępu</span></button>
    </header>
    {backupOpen && <section className="backup-panel no-print" aria-label="Kopie postępu">
      <div><strong>Twoja przygoda, bezpiecznie w pliku.</strong><p>Postęp jest tylko w tej przeglądarce. Kopia zawiera też diagnozę, oceny i notatki. Pobierz ją po tygodniu nauki.</p></div>
      <div className="button-row"><button className="button secondary" onClick={() => { downloadBackup(progress); setNotice('Przekazano kopię do pobrania. Sprawdź folder Pobrane.') }}><ArrowDownToLine size={17} />Pobierz kopię</button><button className="button secondary" onClick={() => fileInput.current?.click()}><ArrowUpFromLine size={17} />Wczytaj kopię</button></div>
    </section>}
    <input ref={fileInput} type="file" accept=".json,application/json" hidden aria-label="Plik kopii postępu" onChange={e => void readBackup(e.target.files?.[0])} />
    {storageIssue && <div className="alert error no-print" role="alert">{storageIssue}<button onClick={() => setBackupOpen(true)}>Otwórz kopie postępu</button></div>}
    {notice && <div className="alert no-print" role="status"><span>{notice}</span><button aria-label="Zamknij komunikat" onClick={() => setNotice('')}><X size={17} /></button></div>}

    <main id="main" ref={main} tabIndex={-1}>
      {view === 'home' && <>
        <div className="welcome-line"><span><span className="status-dot" /> TWÓJ MAŁY RYTUAŁ ODKRYWANIA</span><span>Pilot · 2 tygodnie · 34 zadania</span></div>
        <section className="hero"><div className="hero-copy">
          <div className="eyebrow"><Moon size={15} /> WITAJ W KOCIM ARCHIWUM</div>
          <h1>Wielkie tajemnice.<br /><em>Małe kocie kroki.</em></h1>
          <p>Najpierw sprawdzisz, co już wiesz. Potem ruszysz z Luną i Mrukiem po zaginione księgi. Krótkie spotkania, nowe zagadki i czas, żeby do nich wrócić.</p>
          <button className="button primary hero-button" onClick={() => suggested ? startSession(suggested) : setView('journal')}>{suggested ? progress.startedAt ? 'Kontynuuj pilot' : 'Rozpocznij pilot' : 'Zobacz dziennik'}<ArrowRight size={19} /></button>
          <div className="hero-meta"><span>2 godziny / tydzień</span><span>Zeszyt + aplikacja</span></div>
          <div className="companion-note"><span className="cat-avatar"><CatMark /></span><p>„Możesz nie wiedzieć. Możesz zapytać.<br />Najważniejsze, że odkrywasz.”<strong>Luna, opiekunka archiwum</strong></p></div>
        </div><div className="hero-art"><ArchiveScene /><span className="art-label"><Sparkles size={13} /> LICZBY OTWIERAJĄ DRZWI</span></div></section>
        <PilotDashboard progress={progress} now={now} start={startSession} changeDate={changePilotDate} />
      </>}

      {view === 'play' && <div className="play-layout">
        <aside className="play-sidebar no-print"><button className="text-button" onClick={() => setView('home')}><ArrowLeft size={16} />Wróć do planu</button><span className="eyebrow">{kindLabels[session.kind]} · {session.minutes} MIN</span><h2>{session.title}</h2>
          <ol className="puzzle-nav">{session.tasks.map((task, index) => <li key={task.id}><button aria-current={index === puzzleIndex ? 'step' : undefined} disabled={index > 0 && !progress.tasks[session.tasks[index - 1].id].completion} onClick={() => setPuzzleIndex(index)}><span>{progress.tasks[task.id].completion ? <Check size={16} /> : index + 1}</span>{task.title}</button></li>)}</ol>
          <div className="sidebar-note"><CatMark /><p>„Tu nie ma wyścigu. Zrób przerwę, kiedy jej potrzebujesz.”<strong>— Luna</strong></p></div><p className="quiet">Szkic odpowiedzi i ukończone kroki są zapisywane w tej przeglądarce.</p>
        </aside>
        <PuzzleCard key={session.tasks[puzzleIndex].id} session={session} index={puzzleIndex} task={progress.tasks[session.tasks[puzzleIndex].id]} revealDiagnosis={diagnosisComplete(progress)} update={patch => updateTask(session.tasks[puzzleIndex].id, patch)} next={() => puzzleIndex < session.tasks.length - 1 ? setPuzzleIndex(puzzleIndex + 1) : setView('summary')} />
      </div>}

      {view === 'summary' && <section className="report-page"><span className="eyebrow">SESJA ZAKOŃCZONA</span><h1>{session.title}</h1>
        <p className="page-intro">{session.kind === 'diagnostic' && !diagnosisComplete(progress) ? 'Pierwsza część przyjęta. Zrób przerwę; wynik poznamy po drugiej części.' : 'Zapisz krótką refleksję i zajrzyj do dziennika. Nie musisz od razu zaczynać kolejnej sesji.'}</p>
        <SessionReflection session={session} progress={progress} update={updateReflection} />
        <div className="button-row"><button className="button primary" onClick={() => setView('journal')}>Zobacz dziennik odkryć<ArrowRight size={17} /></button><button className="button secondary" onClick={() => setView('home')}>Wróć do planu</button></div>
      </section>}

      {view === 'journal' && <JournalView progress={progress} session={session} setSession={setSessionId} start={startSession} updateReflection={updateReflection} />}
      {view === 'parent' && <ParentView progress={progress} now={now} session={session} setSession={setSessionId} updateTask={updateTask} />}
      {view === 'curriculum' && <CurriculumView />}
    </main>
    <footer className="site-footer no-print"><span><CatMark />Kocie Archiwum<span className="footer-separator">/</span>Pilot · małe kroki, własna droga.</span><span>{storageIssue ? 'Zapis wymaga uwagi' : 'Postęp zapisywany w tej przeglądarce'}<span className={`status-dot ${storageIssue ? 'warning' : ''}`} /></span></footer>

    {incoming && <dialog ref={importDialog} onCancel={() => setIncoming(null)} className="import-dialog" aria-labelledby="import-heading">
      <h2 id="import-heading">Wczytać tę kopię?</h2>
      <p>Kopia zawiera {allTasks.filter(t => incoming.tasks[t.id].completion).length} z {allTasks.length} ukończonych zadań. Zapis z {new Date(incoming.updatedAt).toLocaleString('pl-PL')}.</p><p><strong>Zastąpi obecny postęp ({completed}/{allTasks.length}).</strong> Jeśli chcesz go zachować, najpierw pobierz obecną kopię.</p>
      <button className="text-button" onClick={() => downloadBackup(progress)}><ArrowDownToLine size={16} />Pobierz obecną kopię</button><div className="button-row"><button className="button secondary" onClick={() => setIncoming(null)}>Anuluj</button><button className="button primary" onClick={restoreBackup}>Zastąp postęp kopią</button></div>
    </dialog>}
  </>
}

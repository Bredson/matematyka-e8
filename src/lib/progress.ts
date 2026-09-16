import { z } from 'zod'
import { pilotSessions } from '../content/pilot'
import { checkAnswer } from './answers'
import { legacyProgressSchema } from './legacy-progress'

export const STORAGE_KEY = 'kocie-archiwum.progress.v2'
export const LEGACY_STORAGE_KEY = 'kocie-archiwum.progress.v1'
export const BACKUP_LIMIT = 5_000_000
const dateSchema = z.string().datetime({ offset: true })
export const pilotStartDateSchema = z.string().date()
const taskSchema = z.object({
  draft: z.string().max(80),
  attempts: z.array(z.object({
    answer: z.string().max(80), correct: z.boolean(), at: dateSchema, assisted: z.boolean(),
  }).strict()).max(500),
  hintsUsed: z.number().int().min(0).max(3),
  externalHelp: z.boolean(),
  completion: z.enum(['solved', 'reviewed', 'submitted', 'skipped']).nullable(),
  completedAt: dateSchema.nullable(),
  parentPoints: z.number().int().min(0).max(2).nullable(),
}).strict()
const sessionSchema = z.object({
  startedAt: dateSchema.nullable(),
  reflection: z.object({
    minutes: z.number().int().min(1).max(180).nullable(),
    difficulty: z.enum(['easy', 'right', 'hard']).nullable(),
    enjoyment: z.enum(['yes', 'some', 'no']).nullable(),
    note: z.string().max(1000),
  }).strict(),
}).strict()

export const progressSchema = z.object({
  version: z.literal(2),
  pilotId: z.literal('pilot-2026-v1'),
  startedAt: dateSchema.nullable(),
  pilotStart: pilotStartDateSchema.nullable(),
  updatedAt: dateSchema,
  tasks: z.record(z.string(), taskSchema),
  sessions: z.record(z.string(), sessionSchema),
}).strict().superRefine((data, context) => {
  const ids = pilotSessions.flatMap(session => session.tasks.map(task => task.id))
  const sessionIds = pilotSessions.map(session => session.id)
  const hasExactIds = (record: Record<string, unknown>, expected: string[]) =>
    Object.keys(record).length === expected.length && expected.every(id => Object.hasOwn(record, id))
  if (!hasExactIds(data.tasks, ids) || !hasExactIds(data.sessions, sessionIds)) {
    context.addIssue({ code: 'custom', message: 'Nieprawidłowy zestaw zadań lub sesji.' })
    return
  }
  for (const session of pilotSessions) {
    const state = data.sessions[session.id]
    const issue = (message: string, path: (string | number)[]) => context.addIssue({ code: 'custom', message, path })
    let active = Boolean(state.startedAt)
    for (const [index, puzzle] of session.tasks.entries()) {
      const task = data.tasks[puzzle.id]
      const taskIssue = (message: string) => issue(message, ['tasks', puzzle.id])
      if (task.attempts.some(attempt => {
        const result = checkAnswer(attempt.answer, puzzle.expected)
        return result === 'invalid' || (result === 'correct') !== attempt.correct
      })) taskIssue('Niespójna odpowiedź.')
      if (Boolean(task.completion) !== Boolean(task.completedAt)) taskIssue('Niespójne ukończenie zadania.')
      if (task.parentPoints !== null && !task.completion) taskIssue('Ocena nieukończonego zadania.')
      if (session.kind === 'diagnostic') {
        if (task.hintsUsed || task.completion === 'solved' || task.completion === 'reviewed') taskIssue('Diagnoza nie dopuszcza podpowiedzi ani omówienia.')
        if (task.attempts.length !== (task.completion === 'submitted' ? 1 : 0)) taskIssue('Diagnoza wymaga jednej odpowiedzi lub pominięcia bez prób.')
      } else {
        if (task.completion === 'submitted' || task.completion === 'skipped') taskIssue('Ten wynik jest dostępny tylko w diagnozie.')
        if (task.completion === 'solved' && !task.attempts.at(-1)?.correct) taskIssue('Brak poprawnej odpowiedzi.')
        if (task.completion === 'reviewed' && task.hintsUsed !== 3) taskIssue('Brak omówienia rozwiązania.')
      }
      const activity = Boolean(task.attempts.length || task.draft || task.hintsUsed || task.completion)
      if (activity && index > 0 && !data.tasks[session.tasks[index - 1].id].completion) taskIssue('Zadanie jeszcze niedostępne.')
      if (activity || task.externalHelp) active = true
    }
    const reflection = state.reflection
    if (reflection.minutes !== null || reflection.difficulty !== null || reflection.enjoyment !== null || reflection.note !== '') {
      active = true
      if (!session.tasks.every(task => data.tasks[task.id].completion)) issue('Refleksja wymaga ukończenia sesji.', ['sessions', session.id, 'reflection'])
    }
    if (active && (!state.startedAt || !data.startedAt)) issue('Brak rozpoczęcia sesji lub pilota.', ['sessions', session.id, 'startedAt'])
  }
})

export type Progress = z.infer<typeof progressSchema>
export type TaskProgress = Progress['tasks'][string]
export type SessionProgress = Progress['sessions'][string]

export function freshProgress(): Progress {
  return {
    version: 2, pilotId: 'pilot-2026-v1', startedAt: null, pilotStart: null, updatedAt: new Date().toISOString(),
    tasks: Object.fromEntries(pilotSessions.flatMap(session => session.tasks).map(p => [p.id, {
      draft: '', attempts: [], hintsUsed: 0, externalHelp: false, completion: null, completedAt: null, parentPoints: null,
    }])),
    sessions: Object.fromEntries(pilotSessions.map(session => [session.id, {
      startedAt: null, reflection: { minutes: null, difficulty: null, enjoyment: null, note: '' },
    }])),
  }
}

export function parseProgress(text: string): Progress {
  if (text.length > BACKUP_LIMIT || new TextEncoder().encode(text).length > BACKUP_LIMIT) throw new Error('Plik kopii jest zbyt duży (maksymalnie 5 MB).')
  try {
    const data: unknown = JSON.parse(text)
    if (typeof data === 'object' && data !== null && 'version' in data && data.version === 1) {
      const legacy = legacyProgressSchema.parse(data)
      const progress = freshProgress()
      progress.startedAt = legacy.startedAt
      progress.updatedAt = legacy.updatedAt
      progress.sessions.prolog.startedAt = legacy.startedAt
      for (const [id, task] of Object.entries(legacy.tasks)) {
        progress.tasks[id] = {
          ...task,
          // v1 did not record when support was used: preserve evidence conservatively.
          attempts: task.attempts.map(attempt => ({ ...attempt, assisted: task.hintsUsed > 0 || task.externalHelp })),
        }
      }
      return progressSchema.parse(progress)
    }
    return progressSchema.parse(data)
  }
  catch { throw new Error('To nie jest zgodna kopia Kociego Archiwum. Wybierz plik wyeksportowany z tej wersji aplikacji.') }
}

export function loadProgress(): { progress: Progress; issue: string | null } {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY)
    return { progress: saved !== null ? parseProgress(saved) : freshProgress(), issue: null }
  } catch {
    return { progress: freshProgress(), issue: 'Nie udało się odczytać zapisu. Poprzednie dane nie zostały nadpisane. Możesz ćwiczyć bez zapisu i eksportować postęp albo wczytać poprawną kopię.' }
  }
}

export function resultLabel(task: TaskProgress): string {
  if (!task.completion) return task.attempts.length || task.hintsUsed ? 'W trakcie' : 'Przed tobą'
  if (task.completion === 'skipped') return 'Pominięto'
  if (task.completion === 'reviewed') return 'Po omówieniu'
  if (task.completion === 'submitted' && !task.attempts[0]?.correct) return 'Do wyjaśnienia'
  if (task.hintsUsed || task.externalHelp || task.attempts.some(attempt => attempt.assisted)) return 'Z pomocą'
  return task.completion === 'submitted' ? 'Odpowiedź poprawna' : 'Samodzielnie'
}

export function nextPuzzleIndex(progress: Progress, sessionId = 'prolog'): number {
  const puzzles = pilotSessions.find(session => session.id === sessionId)?.tasks
  if (!puzzles) return -1
  const index = puzzles.findIndex(p => !progress.tasks[p.id].completion)
  return index === -1 ? puzzles.length - 1 : index
}

export function sessionComplete(progress: Progress, id: string): boolean {
  const session = pilotSessions.find(session => session.id === id)
  return Boolean(session && session.tasks.every(task => progress.tasks[task.id].completion))
}

export function sessionCompletedAt(progress: Progress, id: string): string | null {
  const session = pilotSessions.find(session => session.id === id)
  if (!session || !sessionComplete(progress, id)) return null
  return session.tasks.reduce<string | null>((latest, task) => {
    const at = progress.tasks[task.id].completedAt
    return at && (!latest || Date.parse(at) > Date.parse(latest)) ? at : latest
  }, null)
}

export function localDate(date = new Date()): string {
  return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// Calendar arithmetic preserves local wall-clock time, including across DST.
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function reviewDueAt(progress: Progress, id: string): Date | null {
  const review = pilotSessions.find(session => session.id === id)?.reviewAfter
  if (!review) return null
  const completedAt = sessionCompletedAt(progress, review.sessionId)
  if (!completedAt) return null
  const due = addDays(new Date(completedAt), review.days)
  due.setHours(0, 0, 0, 0)
  return due
}

export function sessionAvailability(progress: Progress, id: string, now = new Date()): { available: boolean; reason: string; dueAt: Date | null } {
  const session = pilotSessions.find(session => session.id === id)
  if (!session) return { available: false, reason: 'Nieznana sesja.', dueAt: null }
  const dueAt = reviewDueAt(progress, id)
  if (!session.reviewAfter || sessionComplete(progress, id)) return { available: true, reason: '', dueAt }
  if (!dueAt) {
    const source = pilotSessions.find(source => source.id === session.reviewAfter?.sessionId)
    return { available: false, reason: `Najpierw ukończ sesję „${source?.title ?? session.reviewAfter.sessionId}”.`, dueAt: null }
  }
  if (now < dueAt) return { available: false, reason: `Powtórka dostępna od ${localDate(dueAt)}.`, dueAt }
  return { available: true, reason: '', dueAt }
}

export function nextSessionId(progress: Progress, now = new Date()): string | null {
  return pilotSessions.find(session => !sessionComplete(progress, session.id) && sessionAvailability(progress, session.id, now).available)?.id ?? null
}

export function diagnosisComplete(progress: Progress): boolean {
  return pilotSessions.filter(session => session.kind === 'diagnostic').every(session => sessionComplete(progress, session.id))
}

export function firstTryIndependent(task: TaskProgress): boolean {
  return Boolean(task.attempts[0]?.correct && !task.attempts[0].assisted && !task.externalHelp)
}

export function downloadBackup(progress: Progress) {
  const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `kocie-archiwum-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

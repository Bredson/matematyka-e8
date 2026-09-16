import { z } from 'zod'
import { adventure, puzzles } from '../content/adventure'
import { checkAnswer } from './answers'

export const STORAGE_KEY = 'kocie-archiwum.progress.v1'
export const BACKUP_LIMIT = 1_000_000
const dateSchema = z.string().datetime()
const taskSchema = z.object({
  draft: z.string().max(80),
  attempts: z.array(z.object({ answer: z.string().max(80), correct: z.boolean(), at: dateSchema }).strict()).max(500),
  hintsUsed: z.number().int().min(0).max(3),
  externalHelp: z.boolean().default(false),
  completion: z.enum(['solved', 'reviewed']).nullable(),
  completedAt: dateSchema.nullable(),
  parentPoints: z.number().int().min(0).max(2).nullable(),
}).strict()
export const progressSchema = z.object({
  version: z.literal(1),
  adventureId: z.literal(adventure.id),
  startedAt: dateSchema.nullable(),
  updatedAt: dateSchema,
  tasks: z.record(z.string(), taskSchema),
}).strict().superRefine((data, context) => {
  const ids = puzzles.map(puzzle => puzzle.id)
  if (Object.keys(data.tasks).length !== ids.length || ids.some(id => !data.tasks[id])) {
    context.addIssue({ code: 'custom', message: 'Nieprawidłowy zestaw zadań.' })
    return
  }
  let locked = false
  for (const puzzle of puzzles) {
    const task = data.tasks[puzzle.id]
    const issue = (message: string) => context.addIssue({ code: 'custom', message })
    if (task.attempts.some(a => (checkAnswer(a.answer, puzzle.expected) === 'correct') !== a.correct || checkAnswer(a.answer, puzzle.expected) === 'invalid')) issue('Niespójna odpowiedź.')
    if (Boolean(task.completion) !== Boolean(task.completedAt)) issue('Niespójne ukończenie zadania.')
    if (task.completion === 'solved' && !task.attempts.at(-1)?.correct) issue('Brak poprawnej odpowiedzi.')
    if (task.completion === 'reviewed' && task.hintsUsed !== 3) issue('Brak omówienia rozwiązania.')
    if (task.parentPoints !== null && !task.completion) issue('Ocena nieukończonego zadania.')
    if (locked && (task.attempts.length || task.hintsUsed || task.externalHelp || task.completion || task.draft)) issue('Zadanie jeszcze niedostępne.')
    if (!data.startedAt && (task.attempts.length || task.hintsUsed || task.externalHelp || task.completion || task.draft)) issue('Brak rozpoczęcia przygody.')
    if (!task.completion) locked = true
  }
})

export type Progress = z.infer<typeof progressSchema>
export type TaskProgress = Progress['tasks'][string]

export function freshProgress(): Progress {
  return {
    version: 1, adventureId: adventure.id, startedAt: null, updatedAt: new Date().toISOString(),
    tasks: Object.fromEntries(puzzles.map(p => [p.id, {
      draft: '', attempts: [], hintsUsed: 0, externalHelp: false, completion: null, completedAt: null, parentPoints: null,
    }])),
  }
}

export function parseProgress(text: string): Progress {
  if (text.length > BACKUP_LIMIT) throw new Error('Plik kopii jest zbyt duży (maksymalnie 1 MB).')
  try { return progressSchema.parse(JSON.parse(text)) }
  catch { throw new Error('To nie jest zgodna kopia Kociego Archiwum. Wybierz plik wyeksportowany z tej wersji aplikacji.') }
}

export function loadProgress(): { progress: Progress; issue: string | null } {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return { progress: saved ? parseProgress(saved) : freshProgress(), issue: null }
  } catch {
    return { progress: freshProgress(), issue: 'Nie udało się odczytać zapisu. Poprzednie dane nie zostały nadpisane. Możesz ćwiczyć bez zapisu i eksportować postęp albo wczytać poprawną kopię.' }
  }
}

export function resultLabel(task: TaskProgress): string {
  if (!task.completion) return task.attempts.length || task.hintsUsed ? 'W trakcie' : 'Przed tobą'
  if (task.completion === 'reviewed') return 'Po omówieniu'
  return task.hintsUsed || task.externalHelp ? 'Z pomocą' : 'Samodzielnie'
}

export function nextPuzzleIndex(progress: Progress): number {
  const index = puzzles.findIndex(p => !progress.tasks[p.id].completion)
  return index === -1 ? puzzles.length - 1 : index
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

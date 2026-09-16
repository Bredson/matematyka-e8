import { z } from 'zod'
import { adventure, puzzles } from '../content/adventure'
import { checkAnswer } from './answers'

// Keep the original v1 validation, including its externalHelp default and ordering.
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

export const legacyProgressSchema = z.object({
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

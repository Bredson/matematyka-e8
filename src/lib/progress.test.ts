import { describe, expect, it } from 'vitest'
import { puzzles } from '../content/adventure'
import { BACKUP_LIMIT, freshProgress, nextPuzzleIndex, parseProgress, resultLabel, type Progress } from './progress'

const now = new Date().toISOString()
function completedFirst(): Progress {
  const progress = freshProgress()
  progress.startedAt = now
  progress.tasks.mapa = {
    draft: '0,5', attempts: [{ answer: '0,5', correct: true, at: now }],
    hintsUsed: 0, externalHelp: false, completion: 'solved', completedAt: now, parentPoints: 1,
  }
  return progress
}

describe('backup integrity and learning evidence', () => {
  it('round-trips progress including drafts, support and parent scores', () => {
    const progress = completedFirst()
    progress.tasks.latarnie.draft = '1'
    progress.tasks.latarnie.hintsUsed = 1
    progress.tasks.latarnie.externalHelp = true
    expect(parseProgress(JSON.stringify(progress))).toEqual(progress)
    expect(nextPuzzleIndex(progress)).toBe(1)
  })
  it('distinguishes independent success, external help, hints and reviewed solutions', () => {
    const task = completedFirst().tasks.mapa
    expect(resultLabel(task)).toBe('Samodzielnie')
    expect(resultLabel({ ...task, hintsUsed: 1 })).toBe('Z pomocą')
    expect(resultLabel({ ...task, externalHelp: true })).toBe('Z pomocą')
    expect(resultLabel({ ...task, completion: 'reviewed', hintsUsed: 3 })).toBe('Po omówieniu')
  })
  it('allows progress through a reviewed solution without claiming a correct attempt', () => {
    const progress = freshProgress()
    progress.startedAt = now
    Object.assign(progress.tasks.mapa, { hintsUsed: 3, completion: 'reviewed', completedAt: now })
    expect(parseProgress(JSON.stringify(progress)).tasks.mapa.attempts).toEqual([])
    expect(nextPuzzleIndex(progress)).toBe(1)
  })
  it.each([
    (p: Progress) => { p.version = 2 as 1 },
    (p: Progress) => { delete p.tasks.mapa },
    (p: Progress) => { p.tasks.unexpected = p.tasks.mapa },
    (p: Progress) => { p.tasks.mapa.hintsUsed = 12 },
    (p: Progress) => { p.tasks.mapa.parentPoints = 3 },
    (p: Progress) => { p.tasks.mapa.attempts[0].answer = '1/0' },
    (p: Progress) => { p.tasks.mapa.attempts[0].answer = '4' },
    (p: Progress) => { p.tasks.mapa.attempts = [] },
    (p: Progress) => { p.tasks.mapa.completedAt = null },
    (p: Progress) => { p.tasks.mapa.completion = 'reviewed' },
    (p: Progress) => { p.tasks.bilet.draft = '2/3' },
    (p: Progress) => { p.tasks.latarnie.parentPoints = 1 },
    (p: Progress) => { p.startedAt = null },
  ])('rejects inconsistent imported state %#', mutate => {
    const progress = completedFirst()
    mutate(progress)
    expect(() => parseProgress(JSON.stringify(progress))).toThrow()
  })
  it('rejects invalid JSON and oversized files', () => {
    expect(() => parseProgress('{')).toThrow()
    expect(() => parseProgress(' '.repeat(BACKUP_LIMIT + 1))).toThrow()
  })
  it('keeps stable unique task IDs for persisted progress', () => {
    expect(new Set(puzzles.map(p => p.id)).size).toBe(puzzles.length)
    expect(parseProgress(JSON.stringify(freshProgress()))).toBeDefined()
  })
})

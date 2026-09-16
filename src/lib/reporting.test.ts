import { describe, expect, it } from 'vitest'
import { pilotSessions } from '../content/pilot'
import { freshProgress, type Progress } from './progress'
import { canShowSolutions, visibleResult } from './reporting'

function finishDiagnosis(progress: Progress, id: string) {
  for (const task of pilotSessions.find(s => s.id === id)!.tasks) {
    progress.tasks[task.id].completion = 'skipped'
  }
}

describe('diagnostic feedback is delayed in every view', () => {
  it('does not expose correctness in journal, parent view or solutions after only one part', () => {
    const progress = freshProgress()
    finishDiagnosis(progress, 'diagnoza-a')
    const session = pilotSessions[0]
    const task = progress.tasks[session.tasks[0].id]
    task.completion = 'submitted'
    task.attempts = [{ answer: '0', correct: false, at: new Date().toISOString(), assisted: false }]
    expect(visibleResult(progress, session, task)).toBe('Odpowiedź przyjęta')
    expect(canShowSolutions(progress, session)).toBe(false)
    finishDiagnosis(progress, 'diagnoza-b')
    expect(canShowSolutions(progress, session)).toBe(true)
    expect(visibleResult(progress, session, task)).toBe('Do wyjaśnienia')
  })
  it('keeps parent keys hidden for an unfinished practice session', () => {
    const progress = freshProgress()
    const session = pilotSessions.find(s => s.id === 'lustra')!
    expect(canShowSolutions(progress, session)).toBe(false)
    for (const task of session.tasks) progress.tasks[task.id].completion = 'reviewed'
    expect(canShowSolutions(progress, session)).toBe(true)
  })
})

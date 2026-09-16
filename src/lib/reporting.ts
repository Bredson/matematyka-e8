import type { PilotSession } from '../content/pilot-types'
import { diagnosisComplete, resultLabel, sessionComplete, type Progress, type TaskProgress } from './progress'

export function canShowSolutions(progress: Progress, session: PilotSession) {
  return session.kind === 'diagnostic' ? diagnosisComplete(progress) : sessionComplete(progress, session.id)
}

export function visibleResult(progress: Progress, session: PilotSession, task: TaskProgress) {
  if (session.kind === 'diagnostic' && !diagnosisComplete(progress)) {
    return task.completion === 'skipped' ? 'Pominięto' : task.completion ? 'Odpowiedź przyjęta' : 'Przed tobą'
  }
  return resultLabel(task)
}

export const kindLabels = { diagnostic: 'Diagnoza', adventure: 'Przygoda', review: 'Powtórka' }

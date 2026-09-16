import type { Puzzle } from './adventure'

export type SkillId =
  | 'fractions' | 'decimals' | 'integers' | 'powers' | 'roots'
  | 'percent' | 'expressions' | 'equations' | 'proportions'
  | 'geometry' | 'solids' | 'coordinates' | 'statistics'
  | 'probability' | 'units' | 'word-problems'

export type PilotPuzzle = Puzzle & { skillId: SkillId }

export type PilotSession = {
  id: string
  title: string
  kind: 'diagnostic' | 'adventure' | 'review'
  week: 1 | 2
  day: number
  minutes: number
  description: string
  tasks: PilotPuzzle[]
  reviewAfter?: { sessionId: string; days: number }
}

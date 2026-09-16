import { describe, expect, it } from 'vitest'
import { puzzles } from './adventure'
import { pilotSessions } from './pilot'
import { curriculumAreas, verifiedRequirements } from './curriculum'
import { taskRequirements } from './pilot-coverage'
import { checkAnswer } from '../lib/answers'

// Independently calculated values (money in grosze, lengths in whole units).
const answers: Record<string, string> = {
  'diagnoza-a-ulamki': '18/40', 'diagnoza-a-liczby': String(-6 + 4 * 3),
  'diagnoza-a-potegi': String((2 ** 3) ** 2 / 2 ** 4), 'diagnoza-a-pierwiastki': String(Math.sqrt(144) - Math.sqrt(25)),
  'diagnoza-a-procenty': String(160 * 85 / 100), 'diagnoza-a-rownanie': String((8 + 7) / (3 - 2)),
  'diagnoza-b-pole': String(6 * 4 + (10 - 6) * 4 / 2), 'diagnoza-b-bryla': String(5 * 4 * 3),
  'diagnoza-b-srednia': String((6 + 8 + 8 + 10) / 4), 'diagnoza-b-losowanie': '3/10',
  'diagnoza-b-proporcja': String(14 * 6 / 4), 'diagnoza-b-wyrazenie': String(5 * -2 - 8),
  mapa: '4/8', latarnie: String(24 / 4 * 3), sklepik: String((2500 - 3 * 450 - 2 * 325) / 100), bilet: '8/12',
  'lustra-zaslony': '11/24', 'lustra-winda': String(-4 + (9 - 3)),
  'lustra-wstazka': String((240 - 3 * 65) / 100), 'lustra-roznica': '32/60',
  'powrot-1-suma': '57/90', 'powrot-1-biblioteka': String(35 - (35 * 3 / 7 + 3)),
  'powrot-1-zakupy': String((2000 - 2 * 680 - 3 * 145) / 100),
  'ogrod-nasiona': String(30 * 2 / (2 + 3)), 'ogrod-woda': String(80 * 75 / 100 + 6),
  'ogrod-droga': String(750 + 180), 'ogrod-temperatura': String(-7 + (12 - 8)),
  'powrot-2-czesci': '19/60', 'powrot-2-znaki': String(-14 - -6 + 11), 'powrot-2-masa': String((1800 - 4 * 275) / 1000),
  'podsumowanie-zbiornik': String(16 + 10), 'podsumowanie-obnizki': String(150 * 72 / 100),
  'podsumowanie-przepis': String((300 * 18 / 12) / 1000), 'podsumowanie-pojemnosc': String(1200 - (350 + 425)),
}
const tasks = pilotSessions.flatMap(s => s.tasks)

describe('pilot content and partial curriculum coverage', () => {
  it.each(tasks)('independently checks the answer of $id', task => {
    expect(answers[task.id]).toBeDefined()
    expect(checkAnswer(answers[task.id], task.expected)).toBe('correct')
  })
  it('fits two weeks including reflection and parent time', () => {
    expect(pilotSessions).toHaveLength(8)
    expect(tasks).toHaveLength(34)
    for (const week of [1, 2]) expect(pilotSessions.filter(s => s.week === week).reduce((sum, s) => sum + s.minutes, 0)).toBe(120)
    for (const session of pilotSessions) {
      if (!session.reviewAfter) continue
      const source = pilotSessions.find(s => s.id === session.reviewAfter?.sessionId)!
      expect(session.day - source.day).toBeGreaterThanOrEqual(session.reviewAfter.days)
      expect(session.tasks.every(t => t.kind === 'transfer')).toBe(true)
    }
  })
  it('preserves the complete published prologue for old progress', () => {
    const existing = pilotSessions.find(s => s.id === 'prolog')!.tasks
    expect(existing.map(({ skillId: _skillId, ...task }) => task)).toEqual(puzzles)
  })
  it('covers each task explicitly, without equating all geometry with a trapezoid', () => {
    expect(new Set(tasks.map(t => t.id)).size).toBe(tasks.length)
    expect(new Set(tasks.map(t => t.prompt)).size).toBe(tasks.length)
    expect(Object.keys(taskRequirements).sort()).toEqual(tasks.map(t => t.id).sort())
    for (const task of tasks) {
      expect(taskRequirements[task.id].length).toBeGreaterThan(0)
      for (const reference of taskRequirements[task.id]) expect(verifiedRequirements.some(r => r.reference === reference)).toBe(true)
      expect(task.hints).toHaveLength(3)
      expect(task.rubric).toHaveLength(2)
      expect(task.solution.length).toBeGreaterThan(0)
    }
    expect(taskRequirements['diagnoza-b-pole']).not.toContain('VII–VIII.XIV.3')
    expect(curriculumAreas).toHaveLength(29)
    for (const requirement of verifiedRequirements) {
      expect(curriculumAreas.some(area => requirement.reference.startsWith(`${area.reference}.`))).toBe(true)
    }
  })
})

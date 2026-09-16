import { afterEach, describe, expect, it, vi } from 'vitest'
import { adventure, puzzles } from '../content/adventure'
import { pilotSessions } from '../content/pilot'
import {
  BACKUP_LIMIT, LEGACY_STORAGE_KEY, STORAGE_KEY, addDays, diagnosisComplete, downloadBackup,
  firstTryIndependent, freshProgress, loadProgress, localDate, nextPuzzleIndex, nextSessionId,
  parseProgress, resultLabel, reviewDueAt, sessionAvailability, sessionComplete, sessionCompletedAt,
  type Progress, type TaskProgress,
} from './progress'

const now = '2026-09-16T18:30:00.000Z'
const roundTrip = (progress: unknown) => parseProgress(JSON.stringify(progress))
const session = (id: string) => pilotSessions.find(session => session.id === id)!

function start(progress: Progress, id = 'prolog') {
  progress.startedAt = now
  progress.sessions[id].startedAt = now
}

function solve(progress: Progress, id = 'prolog', at = now) {
  start(progress, id)
  for (const puzzle of session(id).tasks) {
    Object.assign(progress.tasks[puzzle.id], {
      draft: puzzle.expected,
      attempts: [{ answer: puzzle.expected, correct: true, at, assisted: false }],
      completion: session(id).kind === 'diagnostic' ? 'submitted' : 'solved', completedAt: at,
    })
  }
  return progress
}

function completedFirst(): Progress {
  const progress = freshProgress()
  start(progress)
  Object.assign(progress.tasks.mapa, {
    draft: '0,5', attempts: [{ answer: '0,5', correct: true, at: now, assisted: false }],
    completion: 'solved', completedAt: now, parentPoints: 1,
  })
  return progress
}

function legacyFixture() {
  return {
    version: 1, adventureId: adventure.id, startedAt: now, updatedAt: now,
    tasks: Object.fromEntries(puzzles.map((puzzle, index) => [puzzle.id, {
      draft: index === 3 ? 'niedokończony zapis' : puzzle.expected,
      attempts: index === 3 ? [] : [
        { answer: '999', correct: false, at: now },
        ...(index === 1 ? [] : [{ answer: puzzle.expected, correct: true, at: now }]),
      ],
      hintsUsed: index === 1 ? 3 : index === 2 ? 1 : 0,
      externalHelp: index === 2,
      completion: index === 3 ? null : index === 1 ? 'reviewed' : 'solved',
      completedAt: index === 3 ? null : now,
      parentPoints: index === 3 ? null : index,
    }])),
  }
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.useRealTimers()
})

describe('v1 migration without loss', () => {
  it('preserves every old task field, attempt, score, hint, ID and timestamp through a v2 round-trip', () => {
    const legacy = legacyFixture()
    const progress = roundTrip(legacy)
    expect(progress).toMatchObject({ version: 2, pilotId: 'pilot-2026-v1', startedAt: now, updatedAt: now, pilotStart: null })
    expect(progress.sessions.prolog.startedAt).toBe(legacy.startedAt)
    for (const [id, old] of Object.entries(legacy.tasks)) {
      expect(progress.tasks[id]).toEqual({
        ...old, attempts: old.attempts.map(attempt => ({ ...attempt, assisted: old.hintsUsed > 0 || old.externalHelp })),
      })
    }
    const fresh = freshProgress()
    for (const other of pilotSessions.filter(session => session.id !== 'prolog')) {
      expect(progress.sessions[other.id]).toEqual(fresh.sessions[other.id])
      for (const task of other.tasks) expect(progress.tasks[task.id]).toEqual(fresh.tasks[task.id])
    }
    expect(roundTrip(progress)).toEqual(progress)
    expect(legacy).toEqual(legacyFixture())
  })

  it.each([
    [0, false, false], [1, false, true], [0, true, true], [3, true, true],
  ] as const)('conservatively maps hints=%i, externalHelp=%s to assisted=%s', (hintsUsed, externalHelp, assisted) => {
    const legacy = legacyFixture()
    Object.assign(legacy.tasks.mapa, { hintsUsed, externalHelp })
    expect(roundTrip(legacy).tasks.mapa.attempts.every(attempt => attempt.assisted === assisted)).toBe(true)
  })

  it('retains the v1 default for absent externalHelp', () => {
    const legacy = legacyFixture()
    Reflect.deleteProperty(legacy.tasks.mapa, 'externalHelp')
    expect(roundTrip(legacy).tasks.mapa.externalHelp).toBe(false)
  })

  it('migrates an untouched v1 save', () => {
    const legacy = legacyFixture()
    legacy.startedAt = null as unknown as string
    for (const id of Object.keys(legacy.tasks)) {
      const { attempts: _attempts, ...task } = freshProgress().tasks[id]
      legacy.tasks[id] = { ...task, attempts: [] }
    }
    const migrated = roundTrip(legacy)
    expect(migrated.startedAt).toBeNull()
    expect(migrated.sessions.prolog.startedAt).toBeNull()
  })

  it.each([
    (p: ReturnType<typeof legacyFixture>) => { p.adventureId = 'unknown' },
    (p: ReturnType<typeof legacyFixture>) => { Object.assign(p, { meta: {} }) },
    (p: ReturnType<typeof legacyFixture>) => { Object.assign(p.tasks.mapa, { meta: {} }) },
    (p: ReturnType<typeof legacyFixture>) => { Object.assign(p.tasks.mapa.attempts[0], { assisted: true }) },
    (p: ReturnType<typeof legacyFixture>) => { p.tasks.mapa.attempts[0].correct = true },
    (p: ReturnType<typeof legacyFixture>) => { p.tasks.mapa.attempts[0].answer = '1/0' },
    (p: ReturnType<typeof legacyFixture>) => { p.tasks.mapa.completion = 'submitted' },
    (p: ReturnType<typeof legacyFixture>) => { p.tasks.latarnie.hintsUsed = 2 },
    (p: ReturnType<typeof legacyFixture>) => { p.tasks.mapa.completion = null; p.tasks.mapa.completedAt = null; p.tasks.mapa.parentPoints = null },
    (p: ReturnType<typeof legacyFixture>) => { Reflect.deleteProperty(p, 'startedAt') },
    (p: ReturnType<typeof legacyFixture>) => { Reflect.deleteProperty(p.tasks, 'bilet') },
    (p: ReturnType<typeof legacyFixture>) => { p.tasks.unknown = p.tasks.bilet },
  ])('validates the original strict v1 state before migration %#', mutate => {
    const legacy = legacyFixture()
    mutate(legacy)
    expect(() => roundTrip(legacy)).toThrow()
  })
})

describe('v2 strict state and evidence', () => {
  it('creates all 8 sessions and 34 tasks with independent mutable defaults', () => {
    const progress = freshProgress()
    expect(Object.keys(progress.tasks)).toHaveLength(34)
    expect(Object.keys(progress.sessions)).toHaveLength(8)
    expect(roundTrip(progress)).toEqual(progress)
    progress.tasks.mapa.attempts.push({ answer: '1', correct: false, at: now, assisted: false })
    progress.sessions.prolog.reflection.note = 'test'
    expect(progress.tasks.latarnie.attempts).toEqual([])
    expect(progress.sessions.lustra.reflection.note).toBe('')
    expect(freshProgress().tasks.mapa.attempts).toEqual([])
  })

  it('round-trips multiple practice attempts, drafts, support and grades', () => {
    const progress = completedFirst()
    progress.tasks.mapa.attempts.unshift({ answer: '7', correct: false, at: now, assisted: false })
    Object.assign(progress.tasks.latarnie, { draft: '1/', hintsUsed: 2, externalHelp: true })
    expect(roundTrip(progress)).toEqual(progress)
    expect(nextPuzzleIndex(progress)).toBe(1)
  })

  it('accepts reviewed tasks without a correct attempt', () => {
    const progress = completedFirst()
    Object.assign(progress.tasks.mapa, { attempts: [], hintsUsed: 3, completion: 'reviewed' })
    expect(roundTrip(progress)).toEqual(progress)
  })

  it.each([
    (p: Progress) => { Object.assign(p, { version: 3 }) },
    (p: Progress) => { Object.assign(p, { pilotId: 'other' }) },
    (p: Progress) => { Object.assign(p, { meta: {} }) },
    (p: Progress) => { Object.assign(p.tasks.mapa, { meta: {} }) },
    (p: Progress) => { Object.assign(p.tasks.mapa.attempts[0], { meta: {} }) },
    (p: Progress) => { Object.assign(p.sessions.prolog, { meta: {} }) },
    (p: Progress) => { Object.assign(p.sessions.prolog.reflection, { meta: {} }) },
    (p: Progress) => { delete p.tasks.mapa },
    (p: Progress) => { p.tasks.unknown = p.tasks.mapa },
    (p: Progress) => { delete p.sessions.prolog },
    (p: Progress) => { p.sessions.unknown = p.sessions.prolog },
    (p: Progress) => { p.tasks.mapa.hintsUsed = 4 },
    (p: Progress) => { p.tasks.mapa.parentPoints = 3 },
    (p: Progress) => { p.tasks.latarnie.parentPoints = 0 },
    (p: Progress) => { p.tasks.mapa.draft = 'a'.repeat(81) },
    (p: Progress) => { p.tasks.mapa.attempts[0].answer = ' '.repeat(80) + '0.5' },
    (p: Progress) => { p.tasks.mapa.attempts[0].answer = '1/0' },
    (p: Progress) => { p.tasks.mapa.attempts[0].answer = '4' },
    (p: Progress) => { p.tasks.mapa.attempts[0].correct = false },
    (p: Progress) => { Reflect.deleteProperty(p.tasks.mapa.attempts[0], 'assisted') },
    (p: Progress) => { Reflect.deleteProperty(p.tasks.mapa, 'externalHelp') },
    (p: Progress) => { p.tasks.mapa.attempts = [] },
    (p: Progress) => { p.tasks.mapa.attempts.push({ answer: '1', correct: false, at: now, assisted: false }) },
    (p: Progress) => { p.tasks.mapa.completedAt = null },
    (p: Progress) => { p.tasks.mapa.completion = null },
    (p: Progress) => { p.tasks.mapa.completion = 'reviewed' },
    (p: Progress) => { p.tasks.mapa.completion = 'submitted' },
    (p: Progress) => { p.tasks.mapa.completion = 'skipped'; p.tasks.mapa.attempts = [] },
    (p: Progress) => { p.startedAt = null },
    (p: Progress) => { p.sessions.prolog.startedAt = null },
    (p: Progress) => { p.updatedAt = '2026-02-30T00:00:00Z' },
    (p: Progress) => { p.startedAt = 'yesterday' },
    (p: Progress) => { p.sessions.prolog.startedAt = '2026-09-16' },
    (p: Progress) => { p.tasks.mapa.attempts[0].at = '2026-09-16T25:00:00Z' },
    (p: Progress) => { p.tasks.mapa.completedAt = '2026-09-16T12:00:00' },
  ])('rejects corruption or unsupported fields %#', mutate => {
    const progress = completedFirst()
    mutate(progress)
    expect(() => roundTrip(progress)).toThrow()
  })

  it.each(['2026-02-29', '2024-02-30', '2026-04-31', '2026-13-01', '2026-00-01', '2026-01-00', '2026-1-01', '2026-09-16T00:00:00Z'])('rejects invalid pilotStart %s', date => {
    const progress = freshProgress()
    progress.pilotStart = date
    expect(() => roundTrip(progress)).toThrow()
  })

  it.each(['2024-02-29', '2026-09-16', '2026-12-31'])('accepts real calendar date %s', date => {
    const progress = freshProgress()
    progress.pilotStart = date
    expect(roundTrip(progress).pilotStart).toBe(date)
  })

  it('allows 500 attempts but rejects 501', () => {
    const progress = completedFirst()
    progress.tasks.mapa.attempts = Array.from({ length: 500 }, () => ({ ...progress.tasks.mapa.attempts[0] }))
    expect(roundTrip(progress)).toEqual(progress)
    progress.tasks.mapa.attempts.push(progress.tasks.mapa.attempts[0])
    expect(() => roundTrip(progress)).toThrow()
  })

  it('keeps historical assisted independent of later help declarations or hints', () => {
    const progress = completedFirst()
    progress.tasks.mapa.externalHelp = true
    expect(roundTrip(progress).tasks.mapa.attempts[0].assisted).toBe(false)
    expect(firstTryIndependent(progress.tasks.mapa)).toBe(false)
    progress.tasks.mapa.externalHelp = false
    progress.tasks.mapa.hintsUsed = 1
    expect(firstTryIndependent(roundTrip(progress).tasks.mapa)).toBe(true)
    progress.tasks.mapa.attempts[0].assisted = true
    progress.tasks.mapa.hintsUsed = 0
    expect(firstTryIndependent(roundTrip(progress).tasks.mapa)).toBe(false)
    expect(resultLabel(progress.tasks.mapa)).toBe('Z pomocą')
  })

  it.each(['draft', 'attempts', 'hintsUsed', 'completion'] as const)('requires the previous task complete for %s within the session', field => {
    const progress = completedFirst()
    Object.assign(progress.tasks.sklepik, {
      [field]: { draft: '1', attempts: [{ answer: '1', correct: false, at: now, assisted: false }], hintsUsed: 1, completion: 'reviewed' }[field],
      ...(field === 'completion' ? { hintsUsed: 3, completedAt: now } : {}),
    })
    expect(() => roundTrip(progress)).toThrow()
  })

  it('has no global order or review-date prerequisite during import', () => {
    const progress = solve(freshProgress(), 'podsumowanie')
    solve(progress, 'diagnoza-b')
    solve(progress, 'ogrod')
    expect(roundTrip(progress)).toEqual(progress)
    expect(sessionComplete(progress, 'prolog')).toBe(false)
    expect(nextPuzzleIndex(progress, 'diagnoza-a')).toBe(0)
  })

  it.each(['minutes', 'difficulty', 'enjoyment', 'note'] as const)('rejects premature reflection: %s', field => {
    const progress = completedFirst()
    Object.assign(progress.sessions.prolog.reflection, { [field]: { minutes: 20, difficulty: 'easy', enjoyment: 'yes', note: 'Notatka' }[field] })
    expect(() => roundTrip(progress)).toThrow()
  })

  it.each([0, 181, 1.5])('rejects reflection minutes %s', minutes => {
    const progress = solve(freshProgress())
    progress.sessions.prolog.reflection.minutes = minutes
    expect(() => roundTrip(progress)).toThrow()
  })

  it.each([null, 1, 180])('preserves completed reflections at valid limits: %s', minutes => {
    const progress = solve(freshProgress())
    progress.sessions.prolog.reflection = { minutes, difficulty: 'right', enjoyment: 'some', note: 'ą'.repeat(1000) }
    expect(roundTrip(progress)).toEqual(progress)
    progress.sessions.prolog.reflection.note += 'a'
    expect(() => roundTrip(progress)).toThrow()
  })
})

describe('diagnostic results and labels', () => {
  it('round-trips skipped tasks, incorrect submissions and scores in both parts', () => {
    const progress = solve(solve(freshProgress(), 'diagnoza-a'), 'diagnoza-b')
    const [first, second] = session('diagnoza-a').tasks
    Object.assign(progress.tasks[first.id], { draft: 'nie wiem', completion: 'skipped', attempts: [], parentPoints: 0 })
    Object.assign(progress.tasks[second.id], { draft: '999', attempts: [{ answer: '999', correct: false, at: now, assisted: false }], parentPoints: 1 })
    expect(roundTrip(progress)).toEqual(progress)
    expect(diagnosisComplete(progress)).toBe(true)
    expect(resultLabel(progress.tasks[first.id])).toBe('Pominięto')
    expect(resultLabel(progress.tasks[second.id])).toBe('Do wyjaśnienia')
    expect(diagnosisComplete(solve(freshProgress(), 'diagnoza-a'))).toBe(false)
  })

  it.each([
    (t: TaskProgress) => { t.hintsUsed = 1 },
    (t: TaskProgress) => { t.completion = 'solved' },
    (t: TaskProgress) => { t.completion = 'reviewed'; t.hintsUsed = 3 },
    (t: TaskProgress) => { t.completion = 'skipped' },
    (t: TaskProgress) => { t.attempts = [] },
    (t: TaskProgress) => { t.attempts.push(t.attempts[0]) },
    (t: TaskProgress) => { t.completion = null; t.completedAt = null },
  ])('rejects invalid diagnostic evidence %#', mutate => {
    const progress = solve(freshProgress(), 'diagnoza-a')
    mutate(progress.tasks[session('diagnoza-a').tasks[0].id])
    expect(() => roundTrip(progress)).toThrow()
  })

  it('labels practice, submission, historical help and first-try evidence', () => {
    const task = completedFirst().tasks.mapa
    expect(resultLabel(task)).toBe('Samodzielnie')
    expect(firstTryIndependent(task)).toBe(true)
    expect(resultLabel({ ...task, hintsUsed: 1 })).toBe('Z pomocą')
    expect(resultLabel({ ...task, externalHelp: true })).toBe('Z pomocą')
    expect(resultLabel({ ...task, completion: 'reviewed', hintsUsed: 3 })).toBe('Po omówieniu')
    expect(resultLabel({ ...task, completion: 'submitted' })).toBe('Odpowiedź poprawna')
    expect(resultLabel({ ...task, completion: 'submitted', externalHelp: true })).toBe('Z pomocą')
    expect(resultLabel(freshProgress().tasks.mapa)).toBe('Przed tobą')
    expect(resultLabel({ ...task, completion: null })).toBe('W trakcie')
    expect(firstTryIndependent(freshProgress().tasks.mapa)).toBe(false)
    expect(firstTryIndependent({ ...task, attempts: [{ ...task.attempts[0], correct: false }, task.attempts[0]] })).toBe(false)
  })
})

describe('local calendar scheduling', () => {
  it.each([
    [2026, 0, 30, '2026-02-02'], [2026, 11, 30, '2027-01-02'],
    [2024, 1, 27, '2024-03-01'], [2026, 2, 27, '2026-03-30'], [2026, 9, 23, '2026-10-26'],
  ])('opens three local calendar days after completion: %i-%i-%i', (year, month, day, expected) => {
    vi.stubEnv('TZ', 'Europe/Warsaw')
    const finished = new Date(year, month, day, 23, 55)
    const progress = solve(freshProgress(), 'prolog', finished.toISOString())
    const due = reviewDueAt(progress, 'powrot-1')!
    expect(localDate(due)).toBe(expected)
    expect([due.getHours(), due.getMinutes(), due.getSeconds(), due.getMilliseconds()]).toEqual([0, 0, 0, 0])
    const before = sessionAvailability(progress, 'powrot-1', new Date(due.getTime() - 1))
    expect(before.available).toBe(false)
    expect(before.reason).toContain(expected)
    expect(before.dueAt).toEqual(due)
    expect(sessionAvailability(progress, 'powrot-1', due).available).toBe(true)
    expect(sessionAvailability(progress, 'powrot-1', addDays(due, 1)).available).toBe(true)
  })

  it('uses the latest actual instant rather than task order or ISO lexical order', () => {
    const progress = solve(freshProgress())
    progress.tasks.mapa.completedAt = '2026-09-17T00:30:00+02:00'
    progress.tasks.latarnie.completedAt = '2026-09-16T23:30:00Z'
    expect(sessionCompletedAt(roundTrip(progress), 'prolog')).toBe('2026-09-16T23:30:00Z')
    expect(sessionCompletedAt(completedFirst(), 'prolog')).toBeNull()
  })

  it('uses local date even when UTC is on the previous day; addDays preserves time and input', () => {
    vi.stubEnv('TZ', 'Europe/Warsaw')
    const date = new Date('2026-03-28T23:30:00Z')
    const original = date.getTime()
    expect(localDate(date)).toBe('2026-03-29')
    const next = addDays(date, 1)
    expect(localDate(next)).toBe('2026-03-30')
    expect(next.getHours()).toBe(date.getHours())
    expect(next.getMinutes()).toBe(30)
    expect(next.getTime() - original).toBe(23 * 60 * 60 * 1000)
    expect(date.getTime()).toBe(original)
    expect(addDays(next, -1)).toEqual(date)
    vi.useFakeTimers().setSystemTime(date)
    expect(localDate()).toBe('2026-03-29')
  })

  it('blocks unfinished sources, but completed reviews stay available', () => {
    const progress = freshProgress()
    const blocked = sessionAvailability(progress, 'powrot-1')
    expect(blocked.available).toBe(false)
    expect(blocked.reason).toContain(session('prolog').title)
    expect(blocked.dueAt).toBeNull()
    expect(sessionAvailability(progress, 'ogrod').available).toBe(true)
    solve(progress, 'powrot-1')
    expect(sessionAvailability(progress, 'powrot-1').available).toBe(true)
    solve(progress)
    expect(sessionAvailability(progress, 'powrot-1', new Date('2000-01-01')).available).toBe(true)
  })

  it('selects the first incomplete available session in plan order, skipping blocked reviews', () => {
    const progress = freshProgress()
    const date = new Date(now)
    expect(nextSessionId(progress, date)).toBe('diagnoza-a')
    for (const id of ['diagnoza-a', 'diagnoza-b', 'prolog', 'lustra']) solve(progress, id)
    expect(nextSessionId(progress, date)).toBe('ogrod')
    solve(progress, 'ogrod')
    expect(nextSessionId(progress, date)).toBeNull()
    const due = reviewDueAt(progress, 'powrot-1')!
    expect(nextSessionId(progress, due)).toBe('powrot-1')
    vi.useFakeTimers().setSystemTime(due)
    expect(nextSessionId(progress)).toBe('powrot-1')
    expect(sessionAvailability(progress, 'powrot-1').available).toBe(true)
    for (const id of ['powrot-1', 'powrot-2', 'podsumowanie']) solve(progress, id)
    expect(nextSessionId(progress, due)).toBeNull()
    expect(nextPuzzleIndex(progress)).toBe(3)
  })

  it('returns safe results for unknown sessions and non-review due dates', () => {
    const progress = freshProgress()
    expect(sessionComplete(progress, 'unknown')).toBe(false)
    expect(sessionCompletedAt(progress, 'unknown')).toBeNull()
    expect(reviewDueAt(progress, 'unknown')).toBeNull()
    expect(reviewDueAt(progress, 'prolog')).toBeNull()
    expect(sessionAvailability(progress, 'unknown').available).toBe(false)
    expect(nextPuzzleIndex(progress, 'unknown')).toBe(-1)
  })
})

describe('backup and storage', () => {
  function storage(values: Record<string, string> = {}) {
    const mock = {
      getItem: vi.fn((key: string) => values[key] ?? null), setItem: vi.fn(), removeItem: vi.fn(), clear: vi.fn(),
    }
    vi.stubGlobal('localStorage', mock)
    return mock
  }

  it('prefers v2 and never writes or removes either stored version', () => {
    const progress = completedFirst()
    const mock = storage({ [STORAGE_KEY]: JSON.stringify(progress), [LEGACY_STORAGE_KEY]: JSON.stringify(legacyFixture()) })
    expect(loadProgress()).toEqual({ progress, issue: null })
    expect(mock.getItem.mock.calls).toEqual([[STORAGE_KEY]])
    expect(mock.setItem).not.toHaveBeenCalled()
    expect(mock.removeItem).not.toHaveBeenCalled()
    expect(mock.clear).not.toHaveBeenCalled()
  })

  it('reads v1 only when v2 is absent, without rewriting the original', () => {
    const legacy = JSON.stringify(legacyFixture())
    const values = { [LEGACY_STORAGE_KEY]: legacy }
    const mock = storage(values)
    expect(loadProgress()).toEqual({ progress: parseProgress(legacy), issue: null })
    expect(mock.getItem.mock.calls).toEqual([[STORAGE_KEY], [LEGACY_STORAGE_KEY]])
    expect(values[LEGACY_STORAGE_KEY]).toBe(legacy)
    expect(mock.setItem).not.toHaveBeenCalled()
    expect(mock.removeItem).not.toHaveBeenCalled()
  })

  it.each(['', '{', '{"version":99}', 'null'])('does not fall back or overwrite corrupt v2: %s', saved => {
    const mock = storage({ [STORAGE_KEY]: saved, [LEGACY_STORAGE_KEY]: JSON.stringify(legacyFixture()) })
    const result = loadProgress()
    expect(result.issue).toBeTruthy()
    expect(result.progress.startedAt).toBeNull()
    expect(mock.getItem.mock.calls).toEqual([[STORAGE_KEY]])
    expect(mock.setItem).not.toHaveBeenCalled()
    expect(mock.removeItem).not.toHaveBeenCalled()
  })

  it('handles missing, inaccessible and corrupt legacy storage', () => {
    const mock = storage()
    expect(loadProgress().issue).toBeNull()
    mock.getItem.mockImplementation(() => { throw new Error('Denied') })
    expect(loadProgress().issue).toBeTruthy()
    storage({ [LEGACY_STORAGE_KEY]: '{' })
    expect(loadProgress().issue).toBeTruthy()
  })

  it('accepts up to 5 MB, checks UTF-8 bytes and rejects invalid JSON', () => {
    expect(BACKUP_LIMIT).toBe(5_000_000)
    const json = JSON.stringify(freshProgress())
    expect(parseProgress(json + ' '.repeat(BACKUP_LIMIT - json.length))).toEqual(JSON.parse(json))
    expect(() => parseProgress(' '.repeat(BACKUP_LIMIT + 1))).toThrow('5 MB')
    expect(() => parseProgress('ą'.repeat(BACKUP_LIMIT / 2 + 1))).toThrow('5 MB')
    for (const invalid of ['{', 'null', '[]', '{"version":"2"}', '{"version":0}']) expect(() => parseProgress(invalid)).toThrow()
  })

  it('exports a complete round-trippable v2 JSON blob and releases the object URL', async () => {
    vi.useFakeTimers()
    const progress = completedFirst()
    const create = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const link = { href: '', download: '', click: vi.fn() }
    vi.stubGlobal('document', { createElement: vi.fn(() => link) })
    downloadBackup(progress)
    const blob = create.mock.calls[0][0] as Blob
    expect(blob.type).toBe('application/json')
    expect(parseProgress(await blob.text())).toEqual(progress)
    expect(link.href).toBe('blob:test')
    expect(link.download).toMatch(/^kocie-archiwum-\d{4}-\d{2}-\d{2}\.json$/)
    expect(link.click).toHaveBeenCalledOnce()
    vi.runAllTimers()
    expect(revoke).toHaveBeenCalledWith('blob:test')
  })
})

// Audyt treści: 2026-09-16, wszystkie 34 zadania pilotSessions,
// w tym 4 zadania prologu importowane z adventure.ts. Uzasadnienia: docs/CURRICULUM.md.
// Każda referencja wskazuje częściowe ćwiczenie potwierdzonego wymagania,
// nie opanowanie całego punktu ani dowód sposobu rozwiązania przez ucznia.
// Dobór po prompt/formula, rozwiązaniu i rubryce, nie przez szeroki skillId.
// Pomijamy uboczne rachunki i warianty metod, których wykonania zadanie nie wymaga.
export const taskRequirements: Record<string, string[]> = {
  // Diagnoza A
  'diagnoza-a-ulamki': ['IV–VI.IV.3', 'IV–VI.IV.4', 'IV–VI.V.1'],
  'diagnoza-a-liczby': ['IV–VI.III.5'],
  // Potęga potęgi to I.4, nie I.3. Możliwe obliczenie wprost, bez praw potęg.
  'diagnoza-a-potegi': ['VII–VIII.I.4', 'VII–VIII.I.2'],
  'diagnoza-a-pierwiastki': ['VII–VIII.II.1'],
  'diagnoza-a-procenty': ['VII–VIII.V.2', 'VII–VIII.V.5', 'IV–VI.XIV.5'],
  'diagnoza-a-rownanie': ['VII–VIII.VI.2'],

  // Diagnoza B: opis wymiarów wystarcza do częściowego ćwiczenia pola trapezu.
  'diagnoza-b-pole': ['IV–VI.XI.3'],
  'diagnoza-b-bryla': ['IV–VI.XI.6'],
  'diagnoza-b-srednia': ['VII–VIII.XIII.3'],
  'diagnoza-b-losowanie': ['VII–VIII.XII.2'],
  'diagnoza-b-proporcja': ['VII–VIII.VII.2', 'IV–VI.XIV.5'],
  // Podstawianie i rachunki ze znakami; redukcja algebraiczna jest opcjonalna.
  'diagnoza-b-wyrazenie': ['VII–VIII.III.2', 'IV–VI.III.5'],

  // Prolog: nazwa mapa nie oznacza współrzędnych; skrócenie 4/8 jest opcjonalne.
  mapa: ['IV–VI.V.1', 'IV–VI.XIV.5'],
  latarnie: ['IV–VI.V.4', 'IV–VI.XIV.5'],
  sklepik: ['IV–VI.V.2', 'IV–VI.XIV.5'],
  bilet: ['IV–VI.IV.3', 'IV–VI.IV.4', 'IV–VI.V.1'],

  // Lustra: motyw fabularny nie ćwiczy symetrii.
  'lustra-zaslony': ['IV–VI.IV.3', 'IV–VI.IV.4', 'IV–VI.V.1', 'IV–VI.XIV.5'],
  'lustra-winda': ['IV–VI.III.5', 'IV–VI.XIV.5'],
  'lustra-wstazka': ['IV–VI.V.2', 'IV–VI.XIV.5'],
  'lustra-roznica': ['IV–VI.IV.3', 'IV–VI.IV.4', 'IV–VI.V.1'],

  // Powrót 1
  'powrot-1-suma': ['IV–VI.IV.3', 'IV–VI.IV.4', 'IV–VI.V.1'],
  'powrot-1-biblioteka': ['IV–VI.V.4', 'IV–VI.XIV.5'],
  'powrot-1-zakupy': ['IV–VI.V.2', 'IV–VI.XIV.5'],

  // Ogród: podział całości 2:3 różni się od przeskalowania znanej ceny/ilości.
  'ogrod-nasiona': ['VII–VIII.VII.3', 'IV–VI.XIV.5'],
  'ogrod-woda': ['VII–VIII.V.2', 'VII–VIII.V.5', 'IV–VI.XIV.5'],
  'ogrod-droga': ['IV–VI.XII.6', 'IV–VI.XIV.5'],
  'ogrod-temperatura': ['IV–VI.III.5', 'IV–VI.XIV.5'],

  // Powrót 2: masa pozostaje w kg, więc nie przypisujemy zamiany g/kg.
  'powrot-2-czesci': ['IV–VI.IV.3', 'IV–VI.IV.4', 'IV–VI.V.1'],
  'powrot-2-znaki': ['IV–VI.III.5'],
  'powrot-2-masa': ['IV–VI.V.2', 'IV–VI.XIV.5'],

  // Podsumowanie: zbiornik można rozwiązać bez dodawania samych ułamków.
  'podsumowanie-zbiornik': ['IV–VI.V.4', 'IV–VI.XIV.5'],
  'podsumowanie-obnizki': ['VII–VIII.V.2', 'VII–VIII.V.5', 'IV–VI.XIV.5'],
  'podsumowanie-przepis': ['VII–VIII.VII.2', 'IV–VI.XII.7', 'IV–VI.XIV.5'],
  'podsumowanie-pojemnosc': ['IV–VI.XI.7', 'IV–VI.XIV.5'],
}

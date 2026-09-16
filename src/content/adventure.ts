export type Puzzle = {
  id: string
  title: string
  place: string
  skill: string
  kind: 'story' | 'transfer'
  story: string
  prompt: string
  formula?: string
  unit?: string
  expected: string
  hints: [string, string, string]
  solution: string[]
  rubric: string[]
  discovery: string
}

export const adventure = {
  id: 'archiwum-prolog-v1',
  title: 'Tajemnica zaginionej strony',
  subtitle: 'Prolog · Kocie Archiwum',
  duration: '25–35 min',
  companion: 'Luna',
}

export const puzzles: Puzzle[] = [
  {
    id: 'mapa', title: 'Mapa w kawałkach', place: 'Brama archiwum',
    skill: 'Dodawanie ułamków', kind: 'story',
    story: 'Luna czeka na dachu biblioteki. Pod łapą trzyma fragment mapy. „Resztę znalazłam w kieszeni płaszcza. Nie pytaj, czyjego. Zobaczmy, ile już mamy”.',
    prompt: 'Pierwszy fragment stanowi 3/8 całej mapy, a drugi 1/8. Fragmenty nie nakładają się. Jaką część całej mapy ma Luna? Zapisz działanie w zeszycie.',
    formula: '\\frac{3}{8} + \\frac{1}{8} = \\;?', expected: '1/2',
    hints: [
      'Oba fragmenty opisano w ósmych częściach tej samej mapy. Ile takich części masz razem?',
      'Dodaj liczniki, a mianownik zostaw bez zmiany: (3 + 1)/8. Czy wynik można skrócić?',
      '3/8 + 1/8 = 4/8 = 1/2. Luna ma połowę mapy. Przepisz działanie i wyjaśnij sobie, dlaczego mianownik się nie zmienił.',
    ],
    solution: ['3/8 + 1/8 = 4/8.', 'Dzielimy licznik i mianownik przez 4: 4/8 = 1/2.'],
    rubric: ['Poprawne dodanie liczników przy zachowaniu mianownika (1 pkt).', 'Odpowiedź równoważna 1/2 (1 pkt; skrócenie nie jest wymagane).'],
    discovery: 'Fragmenty łączą się w srebrny znak. Brama rozpoznaje mapę i wpuszcza was do środka.',
  },
  {
    id: 'latarnie', title: 'Światło dla wędrowców', place: 'Galeria księżycowa',
    skill: 'Ułamek liczby', kind: 'story',
    story: 'W galerii unoszą się szklane latarnie. Kot archiwista zostawił notatkę: „Zapal trzy czwarte. Pozostałe niech śnią”. Luna bardzo popiera część o spaniu.',
    prompt: 'W galerii są 24 latarnie. Trzeba zapalić 3/4 wszystkich latarni. Ile latarni należy zapalić? Zapisz obliczenia w zeszycie.',
    formula: '\\frac{3}{4} \\cdot 24 = \\;?', expected: '18', unit: 'latarni',
    hints: [
      'Najpierw ustal, ile latarni stanowi jedna czwarta wszystkich.',
      'Podziel 24 przez 4, a wynik pomnóż przez 3.',
      '24 : 4 = 6, a 6 · 3 = 18. Należy zapalić 18 latarni.',
    ],
    solution: ['1/4 wszystkich latarni: 24 : 4 = 6.', '3/4 wszystkich latarni: 6 · 3 = 18.'],
    rubric: ['Poprawna metoda obliczenia 3/4 z 24 (1 pkt).', 'Wynik: 18 latarni (1 pkt).'],
    discovery: 'Osiemnaście świateł odsłania ślady łap. Prowadzą do sklepiku, który otwiera się tylko po zmroku.',
  },
  {
    id: 'sklepik', title: 'Sprawunki o północy', place: 'Sklepik pod schodami',
    skill: 'Działania na liczbach dziesiętnych', kind: 'story',
    story: 'Do naprawy latającego regału potrzeba zapasów. Sprzedawca Mruk liczy monety, a Luna pilnuje, żeby do koszyka przypadkiem nie wpadła czwarta puszka.',
    prompt: 'Masz 25 zł. Kupujesz 3 puszki po 4,50 zł i 2 szpulki nici po 3,25 zł. Ile pieniędzy zostanie? Zapisz koszt zakupów i obliczenie reszty.',
    expected: '5', unit: 'zł',
    hints: [
      'Policz osobno koszt puszek i nici. Dopiero potem oblicz resztę.',
      'Koszt zakupów to 3 · 4,50 + 2 · 3,25. Odejmij tę sumę od 25.',
      'Puszki: 13,50 zł. Nici: 6,50 zł. Razem: 20 zł. Zostaje 25 − 20 = 5 zł.',
    ],
    solution: ['3 · 4,50 zł = 13,50 zł; 2 · 3,25 zł = 6,50 zł.', '13,50 zł + 6,50 zł = 20 zł.', '25 zł − 20 zł = 5 zł.'],
    rubric: ['Poprawna metoda obliczenia łącznego kosztu obu rodzajów zakupów (1 pkt).', 'Poprawna reszta: 5 zł, wynikająca z zapisanych obliczeń (1 pkt).'],
    discovery: 'Regał znów unosi się nad podłogą. Za nim znajdujesz zaginioną stronę: „Szukaj tam, gdzie księżyc ma dwa odbicia”. Ciąg dalszy jeszcze przed nami.',
  },
  {
    id: 'bilet', title: 'Sprawdź się bez fabuły', place: 'Bilet wyjścia',
    skill: 'Dodawanie ułamków', kind: 'transfer',
    story: 'Historia na dziś dobiegła końca. Zostało krótkie zadanie, żeby zobaczyć, jak radzisz sobie z ułamkami bez wskazówek Luny. Spróbuj najpierw samodzielnie.',
    prompt: 'Oblicz 5/12 + 1/4. Zapisz w zeszycie sprowadzenie do wspólnego mianownika i wynik. Możesz podać dowolny równoważny ułamek.',
    formula: '\\frac{5}{12} + \\frac{1}{4} = \\;?', expected: '2/3',
    hints: [
      'Zamień jedną czwartą na ułamek o mianowniku 12.',
      '1/4 = 3/12. Teraz dodaj 5/12 i 3/12.',
      '5/12 + 3/12 = 8/12 = 2/3. Warto za kilka dni rozwiązać podobne zadanie z innymi liczbami.',
    ],
    solution: ['1/4 = 3/12.', '5/12 + 3/12 = 8/12 = 2/3.'],
    rubric: ['Poprawne sprowadzenie do wspólnego mianownika i dodawanie (1 pkt).', 'Wynik równoważny 2/3 (1 pkt).'],
    discovery: 'Pierwsza wyprawa zapisana. Zajrzyj do dziennika — pokazuje osobno odpowiedzi samodzielne i te uzyskane z pomocą.',
  },
]

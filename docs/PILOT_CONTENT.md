# Kocie Archiwum — treści dwutygodniowego pilota

Źródło: `src/content/pilot.ts`, eksport `pilotSessions: PilotSession[]`.
Odbiorczyni: 14-latka. **8 sesji, 34 zadania, w tym 30 nowych i 4 istniejące z prologu.**
Każde zadanie wymaga zapisu metody w zeszycie i jednej końcowej odpowiedzi liczbowej.

**Stan: pilot v0.2.0 opublikowany i sprawdzony pod publicznym adresem.**
Aplikacja: https://matematyka-e8-kappa.vercel.app/.

## Plan i czas

Dzień 0 to data `pilotStart`, ustawiana w UI jako „Początek pilota”; tygodnie obejmują dni 0–6 i 7–13.
Gdy data jest pusta, rozpoczęcie pierwszej sesji ustawia bieżącą lokalną datę.
Terminy w tabeli są orientacyjnymi przesunięciami `day` od `pilotStart`, nie terminami oddania.
Bez daty początku UI pokazuje dni numerowane od 1, choć metadane `day` liczą od 0.

| Nr | ID sesji | Rodzaj | Tydzień | Dzień | Minuty | Zadania | Cel |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `diagnoza-a` | diagnostic | 1 | 0 | 25 | 6 transfer | Ułamki, całkowite, potęgi, pierwiastki, procenty, równania |
| 2 | `diagnoza-b` | diagnostic | 1 | 2 | 25 | 6 transfer | Geometria, bryły, statystyka, prawdopodobieństwo, proporcje, wyrażenia |
| 3 | `prolog` | adventure | 1 | 4 | 30 | 3 story + 1 transfer | Ułamki i liczby dziesiętne; istniejąca wyprawa |
| 4 | `lustra` | adventure | 1 | 6 | 40 | 3 story + 1 transfer | Ułamki, liczby ujemne, dziesiętne; około 10 min z rodzicem |
| 5 | `powrot-1` | review | 2 | 8 | 25 | 3 transfer | Nowe dane: suma ułamków, ułamek liczby, zakupy |
| 6 | `ogrod` | adventure | 2 | 9 | 35 | 3 story + 1 transfer | Stosunek, procenty, jednostki, liczby ujemne |
| 7 | `powrot-2` | review | 2 | 11 | 25 | 3 transfer | Nowe dane: różnice ułamków, znaki, masa |
| 8 | `podsumowanie` | review | 2 | 13 | 35 | 4 transfer | Nowe dane: ułamki, procenty, proporcje, jednostki; około 10 min z rodzicem |

Tydzień 1: **25 + 25 + 30 + 40 = 120 min**. Tydzień 2: **25 + 35 + 25 + 35 = 120 min**.
W sesji 4 budżet to około 30 min pracy i 10 min rozmowy, w sesji 8 — 25 + 10 min.
Rozmowa z rodzicem jest wliczona, nie doliczana do 120 min. Czasy są orientacyjnymi limitami pracy;
nieukończone zadanie warto oznaczyć jako nieukończone, zamiast wymuszać pośpiech.

### Terminy powtórek: minimalny odstęp, niezależny od planu

Semantyka została rozstrzygnięta i wdrożona: **`reviewAfter.days = 3` oznacza minimum
trzech dni kalendarzowych od rzeczywistego ukończenia sesji źródłowej**, a nie dokładną
datę sesji w planie. Zachowano następujące dni i wartości `reviewAfter`:

| Powtórka | `reviewAfter.sessionId` | `reviewAfter.days` | Odstęp między planowanymi dniami |
| --- | --- | --- | --- |
| `powrot-1` | `prolog` | 3 | 8 − 4 = **4** |
| `powrot-2` | `lustra` | 3 | 11 − 6 = **5** |
| `podsumowanie` | `ogrod` | 3 | 13 − 9 = **4** |

Plan spełnia minimum, jeśli źródła ukończono zgodnie z planem. Dostępność jest jednak liczona
z najpóźniejszego `completedAt` zadań ukończonej przygody, od początku lokalnego dnia
ukończenia + 3 dni kalendarzowe. Nie jest to dokładnie 72 godziny. Późniejsze ukończenie
przygody może przesunąć odblokowanie poza planowaną datę powtórki; zmiana `pilotStart`
nie skraca minimalnej przerwy. Zwykłych sesji nie blokuje przyszła data planu.

`src/lib/progress.ts` wylicza dostępność, a UI blokuje przed nią zarówno normalne
rozwiązywanie powtórki, jak i podgląd pytań u rodzica oraz kartę do druku.
Już ukończona powtórka pozostaje dostępna do przeglądu. Są to stałe sesje na nowych danych,
nie automatycznie generowany ani adaptacyjny harmonogram.

## Zakres i diagnoza

Diagnoza to **próbkowanie 12 obszarów**, po jednym zadaniu na każdy z identyfikatorów:
`fractions`, `integers`, `powers`, `roots`, `percent`, `equations`, `geometry`, `solids`,
`statistics`, `probability`, `proportions`, `expressions`.
Jest przekrojowa, ale pojedynczy wynik nie potwierdza opanowania całej dziedziny.
Nie stanowi pełnej prognozy wyniku E8 ani standaryzowanego testu. Zgadywanie, zmęczenie,
tempo czy pojedyncza pomyłka mogą zmienić wynik. Brak odpowiedzi nie dowodzi braku umiejętności.

W diagnozie: bez fabuły, jedna zatwierdzona odpowiedź na zadanie, bez podpowiedzi.
Pominięcie jest dopuszczalne i kończy zadanie. Do ukończenia obu części UI ukrywa rozwiązania,
rubryki, `discovery`, informację o poprawności i sugestie we wszystkich widokach aplikacji,
także w dzienniku, widoku rodzica i wydrukach. Potwierdzenie przyjęcia odpowiedzi lub
walidacja formatu liczby nie ujawniają poprawności matematycznej.
Pełne trzy podpowiedzi, rozwiązanie i rubryka są w danych, ponieważ wymaga tego kontrakt treści;
nie oznacza to ich dostępności w trakcie diagnozy. Można je wykorzystać do omówienia po obu częściach.
Ograniczenie liczby prób i widoczność klucza są wdrożone w UI; sama obecność klucza w danych
nie oznacza jego dostępności w trakcie diagnozy.

Po diagnozie pilot ćwiczy wybrane tematy: ułamki, działania dziesiętne, liczby ujemne,
procenty, proporcje i jednostki. Nie obejmuje całego E8 i nie adaptuje samodzielnie zestawu
do wyniku diagnozy. Podsumowanie nie jest równoległą wersją diagnozy; różnicy wyników
nie należy przedstawiać jako zmierzonego przyrostu całej wiedzy egzaminacyjnej.
Wyniki sugerują tematy do doćwiczenia; przy obszarach bez dalszych ćwiczeń raport wskazuje
brak materiałów w pilocie i potrzebę kolejnego zestawu, zamiast obiecywać naprawę każdej luki.

### Dokładna matryca wymagań

Przypisanie treści do numerów podstawy istnieje: `taskRequirements` w
`src/content/pilot-coverage.ts` mapuje wszystkie **34 zadania** na konkretne referencje.
Źródła, uzasadnienia i ograniczenia per zadanie są w [CURRICULUM.md](CURRICULUM.md).
Zakładka „Zakres” pokazuje **29 działów i 36 zweryfikowanych podpunktów**, z których
**23 są ćwiczone częściowo**, a 13 nie ma zadań w pilocie. Pozostałych **125 z 161 punktów
podstawy (161 − 36)** nie odwzorowano szczegółowo. Jest to mapa materiałów z jawnymi lukami,
nie pełne pokrycie programu ani ocena opanowania go przez uczennicę. Główny `skillId`
jest szeroką kategorią i nie zastępuje dokładnych referencji `taskRequirements`.

### Rozkład głównych `skillId`

Każde zadanie ma jeden główny identyfikator. Zadania wielokrokowe mogą używać dodatkowych
umiejętności, np. proporcji i zamiany jednostek; tabela nie liczy ich podwójnie.

| `skillId` | Wszystkie zadania | W tym nowe |
| --- | --- | --- |
| fractions | 10 | 7 |
| decimals | 4 | 3 |
| integers | 4 | 4 |
| percent | 3 | 3 |
| proportions | 3 | 3 |
| units | 2 | 2 |
| powers | 1 | 1 |
| roots | 1 | 1 |
| equations | 1 | 1 |
| geometry | 1 | 1 |
| solids | 1 | 1 |
| statistics | 1 | 1 |
| probability | 1 | 1 |
| expressions | 1 | 1 |
| **Razem** | **34** | **30** |

Łącznie 14 głównych umiejętności; brak osobnych zadań z `coordinates` i `word-problems`.
Zadania tekstowe są obecne, ale ich `skillId` wskazuje konkretną umiejętność rachunkową.
Rozkład rodzajów zadań: **9 story + 25 transfer**, w tym 12 transfer w diagnozie.

## Fabuła i samodzielność

Prolog pozostaje importowany z `adventure.ts` przez `map`, bez zmiany jego pól i kolejności:
`mapa`, `latarnie`, `sklepik`, `bilet`. Dodano tylko kolejno `skillId`:
`fractions`, `fractions`, `decimals`, `fractions`.
Wszystkie nowe zadania mają unikalne ID zaczynające się od ID własnej sesji.

Luna i Mruk podążają za wskazówką o dwóch odbiciach księżyca. Odsłaniają lustra,
jadą windą na balkon i wysyłają latawiec. Otrzymane nasiono otwiera ogród w chmurach.
Po obsianiu rabaty i podlaniu roślin odnajdują spis ksiąg i wracają do archiwum.
Każda przygoda ma trzy zadania fabularne i jedno transferowe. Nowe zadania transferowe
oraz wszystkie powtórki nie wymagają znajomości historii i nie zawierają postaci fabularnych.
Istniejący `bilet` zachowuje krótkie odniesienie do Luny w otoczce tekstowej — zgodnie
z wymogiem nienaruszania prologu. Samo polecenie matematyczne jest bez fabuły.

Powtórki zawierają nowe polecenia i dane, nie kopie poprzednich pytań. Powtarzane są
umiejętności; np. ułamek liczby wraca w zadaniu o wypożyczonych książkach, a działania
dziesiętne w zakupach i ważeniu ryżu. Niektóre wyniki mogą się powtarzać, co nie oznacza
powtórzenia pytania. Są zadania krótkie i wielokrokowe, w tym dwie kolejne obniżki.
Wszystkie potrzebne dane są podane tekstowo; żadne zadanie nie wymaga diagramu.

## Zeszyt, odpowiedzi i dwa punkty robocze

- W każdym zadaniu metoda trafia do zeszytu. Do pola odpowiedzi wpisuje się tylko liczbę
  lub ułamek, bez jednostki, znaku `%`, `x =`, działań czy symbolu π. Jednostkę wskazuje polecenie.
- `expected` jest zgodne z parserem wymiernym z `src/lib/answers.ts`: liczba całkowita,
  skończony zapis dziesiętny lub ułamek zwykły. Akceptowane są zapisy równoważne, np.
  `0,45`, `0.45`, `45/100` i `9/20`; skracanie ułamków nie jest warunkiem punktu.
- Każda rubryka ma **dwa kryteria po 1 punkcie**: metodę oraz wynik, z doprecyzowaniem
  w zadaniu. To lokalne punkty robocze, **nie oficjalne punktowanie CKE**.
- Metodę sprawdza uczennica z kluczem lub rodzic na podstawie zeszytu. Każda poprawna,
  równoważna metoda jest dopuszczalna, nawet jeśli różni się od przykładowego rozwiązania.
  W kryterium metody liczy się poprawna struktura postępowania; drobny błąd rachunkowy
  nie przekreśla jej automatycznie. Gdy kryterium wymaga konkretnych poprawnych wartości
  (np. obu pierwiastków), te wartości trzeba zweryfikować.
- Sam poprawny wynik nie dowodzi poprawnego rozumowania: bez zapisu brak podstaw do
  punktu za metodę. W nowych zadaniach punkt za wynik jest niezależny od punktu za metodę.
  Prolog zachowuje własne brzmienie rubryk, w tym wymóg wynikania reszty z obliczeń w `sklepik`.
- Parser porównuje jedynie odpowiedzi liczbowe. **Nie ocenia automatycznie rozumowania**
  ani nie przyznaje punktu za metodę. Rubryka jest instrukcją ręcznego przeglądu.
- Poza diagnozą trzy podpowiedzi prowadzą od kierunku pracy do pełnego wyniku. Odpowiedzi
  po pomocy nie świadczą o samodzielnym opanowaniu; przy omówieniu trzeba uwzględnić użycie pomocy.
- W rozmowie po sesjach 4 i 8: wybierzcie dwa zapisy, poproście o wyjaśnienie kroków,
  sprawdźcie jednostki i wskażcie jeden temat do następnego ćwiczenia. Nie przeliczajcie
  sumy punktów roboczych na przewidywany procent egzaminacyjny.
- Rodzic wpisuje ręczną ocenę 0–2 pkt w „Dla rodzica”. Klucz i oceny pojawiają się po
  ukończeniu wybranej sesji, a dla diagnozy — dopiero po obu częściach. Po ukończeniu sesji
  można zapisać opcjonalną notatkę: czas pracy, trudność, chęć powrotu i tekst.
  Notatkę edytuje się w podsumowaniu lub dzienniku; jest zapisywana lokalnie i w kopii JSON.

## Niezależnie przeliczony klucz — wszystkie 30 nowych zadań

Klucz obliczono osobno od danych zadań w terminalu przez `node -e`, bez odczytu ani zapisu
plików w skrypcie arytmetycznym. Ułamki sprawdzono przez całkowite liczniki i mianowniki
oraz skracanie przez NWD; pieniądze i masy dodatkowo przez grosze i gramy.
Poniższe uzasadnienia wyjaśniają oba punkty rubryki: **M** — metoda, **W** — wynik.

### Diagnoza A

| ID | `expected` | Niezależne obliczenie i uzasadnienie rubryki |
| --- | --- | --- |
| `diagnoza-a-ulamki` | `9/20` | (7·4 − 1·10)/40 = 18/40 = 9/20. M: wspólny mianownik zachowuje wartości ułamków, odejmujemy ich liczniki. W: dowolny zapis równoważny 9/20. |
| `diagnoza-a-liczby` | `6` | Iloczyn 4·3 = 12, następnie −6 + 12 = 6. M: mnożenie musi poprzedzać dodawanie. W: 6. |
| `diagnoza-a-potegi` | `4` | Prawa potęg: 2^(3·2−4) = 2² = 4; kontrola bez praw: 64/16 = 4. M: prawa potęg lub poprawna struktura obliczenia wprost. W: 4, nie samo wyrażenie potęgowe. |
| `diagnoza-a-pierwiastki` | `7` | 12² = 144 i 5² = 25, więc nieujemne pierwiastki dają 12 − 5 = 7. M: obie właściwe wartości pierwiastków, bez znaku ±. W: 7. |
| `diagnoza-a-procenty` | `136` | Zostaje 85% ceny: 160·85/100 = 136; kontrola: 136 + 24 = 160. M: procent liczony od 160 i obniżenie ceny. W: 136 zł, nie 24 zł obniżki. |
| `diagnoza-a-rownanie` | `15` | (3−2)x = 8+7, stąd x = 15. Kontrola: 3·15−7 = 38 = 2·15+8. M: przekształcenia zachowujące równość lub inne uzasadnione wyznaczenie x. W: 15. |

### Diagnoza B

| ID | `expected` | Niezależne obliczenie i uzasadnienie rubryki |
| --- | --- | --- |
| `diagnoza-b-pole` | `32` | Średnia długość podstaw to (6+10)/2 = 8 cm; 8·4 = 32 cm². Kontrola: 6·4 + (10−6)·4/2 = 32. M: pole zależy od podstaw i prostopadłej wysokości, nie ramion. W: 32 cm². |
| `diagnoza-b-bryla` | `60` | Warstwa o wysokości 1 cm ma objętość 5·4·1 = 20 cm³; trzy takie warstwy dają 60 cm³. M: iloczyn trzech wymiarów. W: 60 cm³, nie pole powierzchni. |
| `diagnoza-b-srednia` | `8` | Suma to 32, liczba obserwacji 4, więc 32/4 = 8. Kontrola: odchylenia od 8 wynoszą −2, 0, 0, 2 i sumują się do zera. M: uwzględnienie obu ósemek i dzielenie przez 4. W: 8. |
| `diagnoza-b-losowanie` | `3/10` | 3 sprzyjające kulki / (3+5+2) jednakowo prawdopodobnych kulek = 3/10. M: przestrzeń wyników to kulki, nie trzy kolory. W: liczba równoważna 3/10, bez znaku procentu. |
| `diagnoza-b-proporcja` | `21` | Sześć sztuk to 6/4 liczby czterech sztuk; 14·6/4 = 21. M: stała cena jednostkowa uzasadnia proporcję. W: 21 zł. |
| `diagnoza-b-wyrazenie` | `-18` | Redukcja: 2(3a−4)−a = 5a−8; dla a = −2: −10−8 = −18. M: uwzględnienie wartości a w obu miejscach lub poprawna redukcja i podstawienie. W: −18. |

### Lustra

| ID | `expected` | Niezależne obliczenie i uzasadnienie rubryki |
| --- | --- | --- |
| `lustra-zaslony` | `11/24` | Całość to 24/24; usunięto 4/24 i 9/24, zatem zostało (24−4−9)/24 = 11/24. Kontrola: 11/24+1/6+3/8 = 1. M: oba ułamki odnoszą się do początkowej całości i nie nakładają się. W: 11/24, nie zużyte 13/24. |
| `lustra-winda` | `2` | Łączne przesunięcie to +9−3 = +6; −4+6 = 2. M: start poniżej zera oraz oba kierunki ruchu. W: poziom 2; numeracja obejmuje 0. |
| `lustra-wstazka` | `0.45` | W centymetrach: 240−3·65 = 45 cm, czyli 0,45 m. M: odejmujemy długość trzech kawałków od całości. W: 0,45 m, nie 45 m. |
| `lustra-roznica` | `8/15` | (5·10−3·6)/60 = 32/60 = 8/15. M: odejmowanie po zrównaniu mianowników. W: równoważny ułamek; 16/30 również poprawny. |

### Powrót 1

| ID | `expected` | Niezależne obliczenie i uzasadnienie rubryki |
| --- | --- | --- |
| `powrot-1-suma` | `19/30` | (7·6+1·15)/90 = 57/90 = 19/30. M: zachowanie wartości obu składników przy wspólnym mianowniku. W: 19/30 lub równoważny zapis. |
| `powrot-1-biblioteka` | `17` | Początkowo pozostawiono na półce 3/7·35 = 15 książek. Po zwrocie na półce jest 18, więc poza nią 35−18 = 17. M: właściwe rozróżnienie wypożyczonych i zwróconych; równoważnie 4/7·35−3. W: 17 nadal wypożyczonych. |
| `powrot-1-zakupy` | `2.05` | W groszach: 2000−2·680−3·145 = 205 gr = 2,05 zł. M: oba koszty zależne od liczby sztuk, następnie reszta. W: 2,05 zł; 17,95 zł to koszt, nie odpowiedź. |

### Ogród

| ID | `expected` | Niezależne obliczenie i uzasadnienie rubryki |
| --- | --- | --- |
| `ogrod-nasiona` | `12` | Udział niebieskich to 2/(2+3) = 2/5; 30·2/5 = 12. Kontrola: białych 18, 12+18 = 30, 12:18 = 2:3. M: pięć części całości, nie trzy. W: 12 nasion niebieskich. |
| `ogrod-woda` | `66` | Po podlaniu zostaje 75%·80 = 60 l; 60+6 = 66 l. M: procent od początkowych 80 l i dolanie dopiero później. W: 66 l. |
| `ogrod-droga` | `930` | W kilometrach: 0,75+0,180 = 0,930 km, czyli 930 m. M: dodawanie w tej samej jednostce i przeliczenie do jednostki odpowiedzi. W: 930 m. |
| `ogrod-temperatura` | `-3` | Łączna zmiana +12−8 = +4°C; −7+4 = −3°C. M: oba znaki zmian i temperatura początkowa. W: −3°C. |

### Powrót 2

| ID | `expected` | Niezależne obliczenie i uzasadnienie rubryki |
| --- | --- | --- |
| `powrot-2-czesci` | `19/60` | Odejmowane części razem: 1/4+1/3 = 7/12 = 35/60; 9/10 = 54/60; różnica 19/60. M: odejmujemy sumę obu części, nie ich różnicę. W: 19/60 lub równoważny zapis. |
| `powrot-2-znaki` | `3` | −14−(−6)+11 = −14+6+11 = −14+17 = 3. M: odjęcie liczby ujemnej daje dodanie przeciwnej. W: 3. |
| `powrot-2-masa` | `0.7` | W gramach: 1800−4·275 = 700 g = 0,7 kg. M: odejmujemy wszystkie cztery porcje, bez strat. W: 0,7 kg; 0,700 jest równoważne. |

### Podsumowanie

| ID | `expected` | Niezależne obliczenie i uzasadnienie rubryki |
| --- | --- | --- |
| `podsumowanie-zbiornik` | `26` | (2/5+1/4)·40 = 13/20·40 = 26 l. Kontrola: 26/40 = 0,65 = 0,4+0,25; ilość nie przekracza pojemności. M: oba ułamki od całych 40 l, a nie dolanie 1/4 początkowej wody. W: 26 l. |
| `podsumowanie-obnizki` | `108` | Pozostaje 0,8·0,9 = 0,72 ceny wyjściowej; 150·0,72 = 108 zł. Łączna obniżka wynosi 28%, nie 30%. M: druga obniżka od nowej podstawy. W: 108 zł. |
| `podsumowanie-przepis` | `0.45` | Skala 18/12 = 3/2; 300·3/2 = 450 g = 0,45 kg. M: proporcjonalne zwiększenie ilości mąki. W: 0,45 kg; samo 450 bez przeliczenia nie jest prawidłową odpowiedzią w wymaganej jednostce. |
| `podsumowanie-pojemnosc` | `425` | W litrach: 1,2−0,350−0,425 = 0,425 l = 425 ml. Kontrola: 425+350+425 = 1200 ml. M: spójne jednostki i odjęcie obu porcji. W: 425 ml. |

## Istniejący prolog — kontrola integracji

Treści i rubryki są odziedziczone, nie przepisane. Kontrolny klucz:
`mapa`: 3/8+1/8 = 1/2; `latarnie`: 3/4·24 = 18;
`sklepik`: 25−3·4,50−2·3,25 = 5; `bilet`: 5/12+1/4 = 2/3.
Zachowanie tych ID jest istotne dla istniejących odwołań do zadań.

## Ograniczenia interpretacji i integracji

Sesje, plan, diagnoza, blokady wskazówek i wyników, minimalny odstęp powtórek, dziennik,
oceny rodzica, notatki, wydruki i zakładka „Zakres” są wdrożone na Vercel. `src/App.tsx`
integruje `PilotDashboard`, `PuzzleCard`, widoki z `PilotReports` i `CurriculumView`.
Pełny klucz w źródłach nie jest zabezpieczeniem przed jego podejrzeniem poza UI.
Nie obiecujemy automatycznego sprawdzania metod ani wyniku E8. Plan ma stały zakres
i orientacyjny czas; tak krótki pilot nie rozstrzyga trwałości efektów w dłuższym okresie.

Rejestr ma `version: 2` i klucz `kocie-archiwum.progress.v2`. Przy braku klucza v2 ładowany
i migrowany jest `kocie-archiwum.progress.v1`, bez usuwania starego klucza. Nieprawidłowy v2
nie powoduje fallbacku do v1. Import obsługuje poprawne kopie v1/v2 do 5 MB (5 000 000 bajtów),
a eksport z nowej aplikacji tworzy v2. Stare ID, odpowiedzi, oceny i daty pozostają zachowane;
`assisted` migruje konserwatywnie dla wszystkich prób zadania z odnotowaną pomocą,
ponieważ v1 nie znało momentu jej użycia.

**Dowody techniczne:** 179 testów jednostkowych zaliczonych, końcowy build produkcyjny
poprawny. Test przeglądarkowy na buildzie przeszedł wszystkie 34 zadania, ukrywanie
wyników diagnozy, terminy powtórek i blokadę ich wydruku, notatki, punkty rodzica,
migrację v1, kopie v2 oraz widok mobilny (macOS, Chromium 153.0.8010.12).
Ten sam test przeszedł na publicznym wdrożeniu v0.2.0 z commita `f52c06d`.
Wdrożenie UI i testy techniczne nie zastępują odbioru z córką.

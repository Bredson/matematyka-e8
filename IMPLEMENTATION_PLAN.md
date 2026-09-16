# Plan realizacji — Matematyka do E8 (2027)

## 1. Status i przeznaczenie

- Ten dokument określa aktualne ustalenia; `3-teaching-methods.md` pozostaje archiwum propozycji.
- Zatwierdzone są kierunek nauki, harmonogram, model pracy i wybór technologii opisane poniżej.
- **Zintegrowano lokalnie pilot przygotowywany jako v0.2.0:** 8 sesji, 34 zadania, diagnoza 2 × 6 pytań po 25 minut, 3 przygody i 3 powtórki, zapis v2, kopie, ręczna ocena rodzica, notatki i druk.
- Weryfikacja: **179 zaliczonych testów**, poprawny build produkcyjny i test całego pilota w Chromium. Szczegóły w sekcji 11.
- Zakładka „Zakres” i matryca istnieją: 29 działów, 36 zweryfikowanych podpunktów i mapowanie wszystkich 34 zadań na 23 częściowo ćwiczone punkty. Pozostałe 125 z 161 punktów podstawy nie mają szczegółowego odwzorowania.
- Test z córką, odbiór na docelowych przeglądarkach, pełna zawartość i Detektyw błędów pozostają do wykonania.
- **Pełny zakres E8 nie jest jeszcze pokryty ani zweryfikowany.**
- Hosting: Vercel, repozytorium `Bredson/matematyka-e8`, gałąź produkcyjna `main`. Publiczna wcześniejsza wersja: https://matematyka-e8-kappa.vercel.app/. **v0.2.0 przygotowujemy lokalnie; jej publikacja nie jest potwierdzona.**
- Poniżej oddzielono aktualny pilot od docelowej rozbudowy; instrukcja obsługi i lista gotowych możliwości są w `README.md`.

## 2. Uczennica i cel

- Uczennica ma 14 lat, dobre oceny i niską motywację do dodatkowej nauki.
- Nauka bez rywalizacji, rankingów, kar za błędy i presji codziennych serii.
- Cel: wynik **>90%**, czyli minimum **28/30 pkt** przy arkuszu za 30 punktów.
- Realność celu oceniamy po diagnozie i kolejnych samodzielnych próbach; wynik nie jest gwarantowany.
- Budżet: 2–3 godziny tygodniowo, łącznie z powtórkami, sprawdzaniem i poprawą. Stały plan pilota zajmuje **120 minut tygodniowo**; do godziny zapasu pozostaje na spokojne dokończenie.
- Fantastyczna fabuła z kotami ma ułatwiać rozpoczęcie pracy i dawać wybór kolejnych przygód.
- Fabuła jest krótka i adekwatna do wieku; matematyka oraz samodzielne rozumowanie pozostają celem.

## 3. Harmonogram nauki

| Okres | Forma i zamierzony rezultat |
| --- | --- |
| Październik 2026 – styczeń 2027 | Escape Room: przejście przez cały zweryfikowany zakres E8, powtórki i transfer do zadań bez fabuły. |
| Luty – marzec 2027 | Detektyw błędów: analiza pomyłek, naprawa luk, uzasadnienia i samodzielne zadania mieszane. |

- Mapa misji nie ma osobnego etapu nauki. W pilocie nawigacją są karty ośmiu sesji i lista zadań wybranej sesji.
- Rozkład tematów całego kursu wymaga rozszerzenia matrycy i wniosków z diagnozy; daty nie dowodzą pokrycia zakresu.
- Pilot proponuje pierwszą nieukończoną dostępną sesję, z uwzględnieniem blokady powtórek. **Nie adaptuje automatycznie planu do wyników**; dobór dalszych ćwiczeń jest kolejnym etapem.
- Tydzień 1 pilota: 25 + 25 + 30 + 40 = 120 minut; tydzień 2: 25 + 35 + 25 + 35 = 120 minut. Sesje 4 i 8 zawierają po około 10 minut z rodzicem.
- Pełny arkusz i jego analiza zastępują zwykłe sesje; według źródeł opisanych w `docs/CURRICULUM.md` standardowy czas matematyki E8 2027 to 125 minut.
- Jeśli zakres nie mieści się w budżecie, ograniczamy rozbudowę fabuły i ponownie uzgadniamy priorytety.

## 4. Hybrydowy przebieg pracy

1. Aplikacja przedstawia cel misji, krótką historię i treść zadania.
2. Uczennica zapisuje rachunki, rysunki i uzasadnienia w zeszycie; druk jest opcjonalny.
3. Odpowiedź końcową wpisuje w aplikacji, a zapis w zeszycie oznacza identyfikatorem zadania.
4. Poza diagnozą może skorzystać ze stopniowanych wskazówek i wyjaśnionego rozwiązania. W diagnozie zatwierdza jedną odpowiedź lub pomija zadanie, bez wskazówek; poprawność i klucz są ukryte do ukończenia obu części.
5. Po przygodzie wykonuje nowe zadanie transferowe bez fabuły i bez pomocy.
6. W sesjach 4 i 8 rodzic ocenia wybrane zapisy z zeszytu według klucza i kryteriów punktowych; przegląd jest częścią budżetu sesji.
7. Ręczna ocena 0–2 pkt i opcjonalna notatka sesji (czas, trudność, chęć powrotu, tekst) trafiają do lokalnego rejestru. Wyniki sugerują tematy do dalszej pracy, ale nie dodają automatycznie ćwiczeń.

- Aplikacja automatycznie sprawdza tylko odpowiedzi, dla których zdefiniowano jednoznaczne reguły.
- Trafna odpowiedź końcowa nie potwierdza poprawnego uzasadnienia ani pełnej punktacji zadania otwartego.
- Zadania bez ręcznej oceny mają w widoku rodzica oznaczenie „Jeszcze niesprawdzone”, oddzielne od wyniku odpowiedzi. Dwa punkty robocze nie są oficjalną skalą CKE.
- Rodzic wspiera pytaniami i rozmową o postępie; udzieloną pomoc także odnotowujemy.
- Papierowy zapis rozwiązania pozostaje w zeszycie; nie zakładamy skanowania ani przesyłania zdjęć.

## 5. Od prototypu v0.1.0 do lokalnego pilota v0.2.0

Prototyp v0.1.0 obejmował jedną przygodę: 3 zadania i transfer, zapis, kopie, ocenę rodzica oraz druk. Jest zachowany jako `prolog` z ID `mapa`, `latarnie`, `sklepik`, `bilet`. Lokalny pilot dodaje 30 nowych zadań, zachowując treści prologu oraz zgodność jego odpowiedzi, ocen i dat.

### Stały plan pilota

`pilotStart` jest datą dnia 0. W UI ustawia ją pole „Początek pilota”; gdy jest puste, rozpoczęcie pierwszej sesji ustawia bieżącą lokalną datę. Bez ustawionej daty UI pokazuje numery dni od 1, podczas gdy `day` w danych i tabeli jest przesunięciem od 0.

| Sesja | Rodzaj | `day` od `pilotStart` | Minuty | Zadania |
| --- | --- | --- | --- | --- |
| 1. `diagnoza-a` | Diagnoza | 0 | 25 | 6 |
| 2. `diagnoza-b` | Diagnoza | 2 | 25 | 6 |
| 3. `prolog` | Przygoda | 4 | 30 | 4 |
| 4. `lustra` | Przygoda | 6 | 40, w tym 10 z rodzicem | 4 |
| 5. `powrot-1` | Powtórka | 8 | 25 | 3 |
| 6. `ogrod` | Przygoda | 9 | 35 | 4 |
| 7. `powrot-2` | Powtórka | 11 | 25 | 3 |
| 8. `podsumowanie` | Powtórka | 13 | 35, w tym 10 z rodzicem | 4 |

Daty i czasy są orientacyjne. Zwykłych sesji nie blokuje przyszła data planu. Każda przygoda ma 3 zadania fabularne i transfer; 3 powtórki zawierają łącznie 10 nowych zadań. Treści, klucze i robocze kryteria są w [docs/PILOT_CONTENT.md](docs/PILOT_CONTENT.md).

### Diagnoza i interpretacja wyników

- Dwie części po 6 pytań i około 25 minut próbkują 12 szerokich obszarów. Jedna zatwierdzona odpowiedź lub pominięcie kończy zadanie; wskazówki są niedostępne.
- Do ukończenia obu części aplikacja ukrywa poprawność, rozwiązania, rubryki, `discovery` i sugestie we wszystkich swoich widokach oraz wydrukach. Potwierdza tylko przyjęcie odpowiedzi lub pominięcie; walidacja formatu liczby nie ocenia jej poprawności matematycznej.
- Po obu częściach wyniki sugerują, co doćwiczyć. Dla obszarów bez dalszych ćwiczeń w pilocie raport jawnie wskazuje brak materiałów i potrzebę kolejnego zestawu. Kategorie takie jak geometria są szersze od sprawdzanego fragmentu.
- Wynik nie jest prognozą E8 ani dowodem opanowania całego działu. Podsumowanie nie jest równoległą diagnozą; różnica wyników nie mierzy przyrostu całej wiedzy.
- Plan pozostaje stały. Pomoc pozwala kontynuować przygody, lecz nie jest dowodem samodzielnego opanowania.

## 6. Matryca wymagań i jakość treści

- **Wykonano częściową matrycę i audyt 34 zadań:** źródła, numeracja, zakres weryfikacji oraz ograniczenia są w [docs/CURRICULUM.md](docs/CURRICULUM.md). Dokumentacja źródłowa potwierdza wskazanie podstawy 2024 dla E8 2027 i odniesienia do informatora CKE.
- `src/content/curriculum.ts` zawiera mapę **29 działów i 36 zweryfikowanych podpunktów**. Zakładka „Zakres” pokazuje treści, źródła, powiązania i luki.
- `taskRequirements` w `src/content/pilot-coverage.ts` mapuje **34/34 zadania** na konkretne referencje, niezależnie od głównego `skillId`; **23 podpunkty są ćwiczone częściowo**, a 13 z katalogu nie ma zadań.
- Pozostałych **125 z 161 punktów podstawy (161 − 36)** nie odwzorowano szczegółowo. Liczba 161 obejmuje również punkty ze szczególną możliwością realizacji po E8, opisaną w dokumencie źródłowym; nie jest liczbą bezwarunkowych celów egzaminacyjnych.
- Pełna matryca, wszystkie warianty umiejętności i zależności między nimi wymagają dalszej pracy. Sam szeroki `skillId` nie jest dokładnym mapowaniem ani dowodem ćwiczenia całego działu.
- Osobno pokazujemy częściowe pokrycie wymagania przez materiały i wyniki ćwiczeń uczennicy; aplikacja nie potwierdza automatycznie opanowania wymagania.
- Lista działów ani liczba przygód nie są dowodem pełnego pokrycia podstawy.
- Pilot ma klucze, dopuszczalne odpowiedzi i robocze kryteria punktów częściowych. Niezależne przeliczenie 30 nowych zadań oraz kontrolny klucz prologu opisano w `docs/PILOT_CONTENT.md`.
- Przy rozbudowie trzeba niezależnie rozwiązać zadania i sprawdzić dane, jednostki, rysunki, jednoznaczność oraz ponowić audyt referencji per zadanie.
- Liczba kolejnych przygód wynika z matrycy i pilota; nie przyjmujemy z góry liczby gwarantującej cały zakres.

## 7. Postęp, samodzielność i powtórki

- Rejestr v2 obejmuje ID zadania, odpowiedzi, daty, `assisted` każdej próby, wskazówki, pomoc zewnętrzną, ukończenie i punkty rodzica. Referencje wymagań pochodzą z osobnego `taskRequirements`.
- UI oddziela ukończenie, wynik pierwszej próby bez pomocy, pracę z pomocą, omówienie, odpowiedź w diagnozie lub pominięcie oraz ręczną ocenę zapisu.
- Wskazówka lub pomoc użyta przed zatwierdzeniem próby oznacza ją jako `assisted`; pomoc spoza aplikacji, w tym poznanie rozwiązania, wymaga deklaracji. Podgląd rozwiązania po samodzielnej odpowiedzi nie zmienia wstecz jej pierwszego wyniku.
- Ponowne wpisanie poznanej odpowiedzi nie jest nowym dowodem opanowania umiejętności.
- Potwierdzenie opanowania wymaga samodzielnego transferu oraz nowego zadania po przerwie.
- Dla zadania otwartego potwierdzenie obejmuje również ocenę rozumowania według klucza.
- **Wdrożone minimum powtórki:** `reviewAfter.days = 3` oznacza minimalny odstęp kalendarzowy od rzeczywistego ukończenia źródła: `prolog` → `powrot-1`, `lustra` → `powrot-2`, `ogrod` → `podsumowanie`. Ukończenie źródła to najpóźniejsze `completedAt` jego zadań, gdy wszystkie są zakończone.
- Powtórka odblokowuje się od początku lokalnego dnia ukończenia + 3 dni kalendarzowe, nie po dokładnie 72 godzinach. Przedtem blokowane są zwykłe rozwiązywanie, podgląd pytań u rodzica i karta do druku. Już ukończona powtórka pozostaje dostępna do przeglądu.
- Daty planu `pilotStart + day` są niezależne: odstępy 4, 5 i 4 dni w planie spełniają minimum 3 dni. Zmiana początku planu nie skraca przerwy; późniejsze ukończenie źródła może przesunąć dostępność poza planowaną datę.
- Powtórki mieszają typy zadań i używają nowych danych. Błędy nie generują automatycznie kolejnego zestawu. Powroty po tygodniach i długoterminowa adaptacja pozostają do zaplanowania po pilocie.
- Ukończenie historii, liczba prób i wynik z pomocą są widoczne oddzielnie od samodzielnego postępu.
- Dziennik i widok rodzica pokazują wyniki oraz oceny, raport diagnozy wskazuje obszary do dalszej pracy, a plan pokazuje dostępność powtórek. Są to sygnały do przeglądu, nie automatyczne potwierdzenie opanowania.

## 8. Technologia i przechowywanie wyników

- Aplikacja: React + TypeScript + Vite; hosting statyczny: Vercel, konfiguracja w `vercel.json`.
- Bez kont, backendu i synchronizacji; aplikacja działa w przeglądarce na Macu i Windowsie.
- Zapis wyników: lokalny magazyn przeglądarki `localStorage`, przypisany do adresu aplikacji i profilu; `version: 2`, klucz `kocie-archiwum.progress.v2`.
- Jeśli klucza v2 nie ma, ładowany jest `kocie-archiwum.progress.v1`. Migracja nie usuwa starego klucza. Nieprawidłowy v2 nie powoduje fallbacku do v1: aplikacja zgłasza błąd i zatrzymuje zapis, nie nadpisując danych.
- Migracja zachowuje ID prologu, odpowiedzi, oceny i daty; dodaje puste sesje pilota. V1 nie zna momentu użycia pomocy, więc `assisted` jest konserwatywnie ustawiane dla wszystkich prób zadania, jeśli użyto wskazówek lub pomocy zewnętrznej.
- Wyniki nie trafiają do repozytorium ani na serwer; obecnie nie ma wyników pilota ani testu z córką.
- Inna przeglądarka, profil, komputer lub adres aplikacji mają odrębny magazyn danych.
- Usunięcie danych witryny, tryb prywatny lub utrata profilu może usunąć postęp.
- Lokalny zapis nie jest kopią zapasową; bez wyeksportowanego pliku nie zapewniamy odzyskania danych.
- Eksport JSON zapisuje rejestr v2: znaczniki czasu, próby, oceny, pomoc, `pilotStart` i notatki sesji. Dostępność powtórek jest wyliczana z dat ukończenia i metadanych treści; nie jest osobną listą terminów w kopii.
- Rodzic zapisuje kopię poza danymi przeglądarki co tydzień oraz przed importem, zmianą urządzenia lub adresu.
- Plik przechowuje w wybranym folderze komputera; dla ochrony przed awarią urządzenia także na osobnym nośniku.
- Przeniesienie Mac ↔ Windows: ręczny eksport pliku, przekazanie go i import w przeglądarce docelowej.
- Import obsługuje kopie v1 i v2, sprawdza strukturę, wersję i spójność, pokazuje podsumowanie oraz wymaga potwierdzenia zastąpienia danych. Maksymalny rozmiar to **5 MB (5 000 000 bajtów)**. Po imporcie v1 kolejny eksport jest w v2; eksportu wstecznego do v1 nie ma.
- Uszkodzony lub nieobsługiwany plik nie może nadpisać obecnego zapisu; nie planujemy automatycznego scalania.
- Błąd lub niedostępność zapisu musi być widoczna; aplikacja nie może wtedy deklarować „zapisano”.

## 9. Kolejność realizacji i bramki

| Krok | Status teraz | Warunek przejścia dalej |
| --- | --- | --- |
| 1. Matryca oficjalnych wymagań | Częściowa matryca gotowa: 29 działów, 36 punktów, mapowanie 34 zadań | Dla pełnego kursu: dalsze odwzorowanie 125 punktów i uzupełnianie jawnych luk. |
| 2. Działająca przygoda | Prolog v0.1.0 zachowany w pilocie; wcześniejsza wersja publiczna | Kontrola na Windowsie i odbiór z córką nadal wymagane. |
| 3. Przygotowanie dwutygodniowego pilota | Lokalna v0.2.0 przeszła testy jednostkowe, build i E2E | Publikacja oraz odbiór na Windowsie z córką. |
| 4. Test z córką podczas pilota | Planowany | Zebrane wyniki diagnozy, transferu i powtórek oraz uwagi o motywacji i obsłudze. |
| 5. Rozszerzenie na cały zakres | Planowane | Uzupełniona matryca pokrycia, zweryfikowane zadania i działające powtórki. |
| 6. Detektyw błędów | Planowany na luty–marzec 2027 | Gotowe sprawy, klucze i nowe zadania sprawdzające naprawę wykrytych luk. |

- Częściowa matryca stanowi podstawę merytoryczną pilota, ale nie zamyka bramki pełnego kursu.
- Pilot rozpoczyna gotowa diagnoza: dwa zestawy po 6 pytań i około 25 minut, wliczone w czas nauki.
- Krótka diagnoza wskazuje wstępne luki; nie potwierdza opanowania całej podstawy.
- Po dwóch tygodniach rodzic porównuje samodzielność, trwałość wyników, czas pracy i chęć powrotu do aplikacji.
- Wnioski z pilota i decyzję o poprawkach należy dopisać tutaj; szczegółowe wyniki pozostają lokalnie i w kopii JSON.
- Detektyw: własna próba → analiza błędnego rozwiązania → wyjaśnienie → nowe zadanie → powtórka po przerwie.

## 10. Warunki odbioru i dowody

- Przeglądarki: sprawdzić aktualne Safari i Chrome na macOS oraz Edge i Chrome na Windowsie; zapisać wersje.
- W każdej z nich przejść przygodę, wprowadzanie odpowiedzi, wskazówki, transfer i ocenę rodzica.
- Zapis: po odświeżeniu i ponownym otwarciu przeglądarki pozostają próby, pomoc, oceny i terminy powtórek.
- Kopie: eksport → pusty profil → import odtwarza te dane; sprawdzić także przeniesienie Mac ↔ Windows.
- Odporność: odrzucić wadliwy JSON bez utraty postępu i pokazać błąd przy niedostępnym magazynie.
- Matematyka: każde udostępniane zadanie i klucz mają odnotowaną kontrolę poprawności i punktacji.
- Nauka: powtórka rzeczywiście wraca po przerwie; pomoc nie zwiększa wskaźnika samodzielnego opanowania.
- Dostępność: sprawdzić minimum 3 dni kalendarzowych od ukończenia źródła, niezależność od `pilotStart` oraz blokadę podglądu i druku pytań przed odblokowaniem powtórki.
- Diagnoza: jedna zatwierdzona próba lub pominięcie, bez wskazówek; brak poprawności i kluczy do ukończenia obu części, także w dzienniku, widoku rodzica i druku.
- Migracja: zachowanie starych ID, odpowiedzi, ocen i dat; v1 tylko przy braku v2, bez usuwania starego klucza; odrzucenie uszkodzonego v2 bez fallbacku i kopii ponad 5 MB.
- Otwarte: oczekiwanie na ocenę i punkty częściowe są odróżnione od automatycznie poprawnej odpowiedzi.
- Pełny zakres: wszystkie wymagania matrycy mają zweryfikowane materiały, transfer i powtórki; luki są jawne.
- Odbiór techniczny nie oznacza osiągnięcia >90%; potrzebne są wyniki samodzielnych, nowych prób egzaminacyjnych.
- Dowody odbioru dopisujemy w tym planie: data, wersja aplikacji, środowisko, próba, rezultat i otwarte problemy.

## 11. Stan dowodów i ryzyka

### Aktualny zakres v0.2.0 — lokalna integracja

- **`npm test`: 179 testów zaliczonych** — odpowiedzi, niezależny klucz zadań, mapowanie, migracja, integralność kopii, terminy i ukrywanie wyników.
- **Build:** końcowe `npm run build` zakończone powodzeniem (TypeScript + Vite 8.3.0).
- **E2E:** `tests/browser_smoke.py` przeszedł na buildzie produkcyjnym pod lokalnym `vite preview`, macOS, Chromium 153.0.8010.12. Sprawdzono wszystkie 34 zadania, limit i pomijanie diagnozy, brak wczesnych wyników/kluczy, dostępność powtórek również w druku, notatki, punkty rodzica, migrację rzeczywistego zapisu v1 i nienaruszenie starego klucza, import/eksport v2, błędne kopie, brak miejsca w storage, konflikt kart, odrzucenie pięciocyfrowego roku i ekran 390 px. Zrzuty: `test-results/` (poza Git).
- **Treści i zakres:** `docs/PILOT_CONTENT.md` zawiera niezależnie przeliczony klucz 30 nowych zadań i kontrolę prologu. `docs/CURRICULUM.md` dokumentuje źródła, 29 działów, 36 punktów oraz audyt i dokładne mapowanie 34 zadań na 23 częściowo ćwiczone punkty.
- **Publikacja:** wcześniejsza wersja jest pod https://matematyka-e8-kappa.vercel.app/. Publikacja lokalnego v0.2.0 nie jest potwierdzona; instrukcje są w `README.md`.
- **Metadane wydania:** `package.json` i `package-lock.json` deklarują `0.2.0`.
- Brak potwierdzonego odbioru nowego pilota na Windowsie oraz wyników pracy z córką. Do zebrania: odbiór i obserwacje pilota, a następnie decyzje o rozbudowie.

### Historia v0.1.0 — dowody wyłącznie dla prologu

- `npm test` — 45 testów zakończonych powodzeniem; `npm run build` — poprawny TypeScript i build produkcyjny.
- Ówczesny test `tests/browser_smoke.py` na macOS w Chromium 153.0.8010.12: pełna przygoda, samodzielność i pomoc, odświeżenie ze szkicem, punkty rodzica, wydruki, eksport i import w pustym profilu, odrzucenie błędnego JSON, uszkodzony/niedostępny zapis, konflikt kart i ekran 390 px — zaliczone.
- Ówczesne zrzuty kontrolne zapisano lokalnie w `test-results/` (poza Git); wpis historyczny nie potwierdza aktualnego kompletu artefaktów v0.2.0. Odbiór w Windows Edge/Chrome i Safari oraz test z córką nie były wtedy wykonane.
- Kontrola rachunków prototypu: 3/8 + 1/8 = 1/2; 3/4 z 24 = 18; 25 − (3 × 4,50 + 2 × 3,25) = 5; 5/12 + 1/4 = 2/3. Kryteria ćwiczeń są robocze, nie oficjalne CKE.

### Ryzyka i dalsze decyzje

- Główne ryzyka: niepełny zakres, przeciążenie czasu nauki lub tworzenia treści, nietrafiona fabuła i utrata lokalnych danych.
- Ograniczamy je przez jawną częściową matrycę, stały budżet pilota, notatki po sesjach, kontrolę matematyczną i sprawdzane kopie JSON.
- Wdrożenie interfejsu i zaliczone testy jednostkowe nie zastępują odbioru ani dowodów skuteczności nauki. Pełny kurs i wynik >90% pozostają celem, nie osiągniętym rezultatem.

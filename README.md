# Kocie Archiwum

Matematyczne przygody z kotami dla uczennicy przygotowującej się do egzaminu ósmoklasisty w 2027 roku.

**Stan: dwutygodniowy pilot v0.2.0 opublikowany na Vercel; nie jest pełnym repetytorium E8.**

Otwórz aplikację: **[matematyka-e8-kappa.vercel.app](https://matematyka-e8-kappa.vercel.app/)**. Wdrożenie pilota z commita `f52c06d` zakończyło się powodzeniem; pełny test przeglądarkowy przeszedł również pod tym publicznym adresem.

## Co już działa

- Plan 8 sesji i 34 zadań: diagnoza w dwóch częściach po 6 pytań i 25 minut, 3 przygody oraz 3 powtórki na nowych danych.
- Prolog „Tajemnica zaginionej strony” zachowuje cztery zadania o ID `mapa`, `latarnie`, `sklepik`, `bilet`; pilot dodaje 30 nowych zadań.
- Budżet 120 minut tygodniowo, w tym około 10 minut przeglądu z rodzicem w sesjach 4 i 8.
- Data początku pilota i orientacyjny kalendarz. Powtórki odblokowują się po minimum 3 dniach kalendarzowych od rzeczywistego ukończenia odpowiedniej przygody.
- Diagnoza: jedna zatwierdzona odpowiedź lub pominięcie, bez wskazówek; poprawność i klucze we wszystkich widokach aplikacji oraz wydrukach ukryte aż do ukończenia obu części.
- Sprawdzanie równoważnych odpowiedzi, w tym `1/2`, `4/8`, `0,5` i `0.5`.
- Poza diagnozą: stopniowane wskazówki, pełne rozwiązanie i przejście dalej po omówieniu.
- Oddzielne oznaczanie pomocy aplikacji i pomocy spoza aplikacji.
- Lokalny zapis prób, szkiców odpowiedzi, pomocy i punktów przyznanych przez rodzica.
- Dziennik, wyniki diagnozy i widok rodzica z ręczną oceną zeszytu oraz opcjonalną notatką sesji: czas, trudność, chęć powrotu i tekst.
- Druk karty pracy bez odpowiedzi albo raportu z dostępnym kluczem. Pytania powtórki, także w podglądzie rodzica i druku, są niedostępne przed jej odblokowaniem.
- Zakładka „Zakres”: 29 działów, 36 zweryfikowanych podpunktów i dokładne mapowanie 34 zadań na 23 częściowo ćwiczone podpunkty; luki są jawne.
- Zapis v2, migracja starego prologu oraz import kopii JSON v1/v2 z walidacją, limitem 5 MB i potwierdzeniem zastąpienia danych. Nowe kopie są eksportowane w v2.

Plan i harmonogram są w [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md), treści i klucz w [docs/PILOT_CONTENT.md](docs/PILOT_CONTENT.md), a źródła i matryca wymagań w [docs/CURRICULUM.md](docs/CURRICULUM.md). Pozostałych **125 z 161 punktów podstawy (161 − 36)** nie odwzorowano szczegółowo. Mapa działów i częściowe powiązania nie oznaczają pełnego pokrycia programu. Dawne warianty metod zachowano w [3-teaching-methods.md](3-teaching-methods.md).

## Uruchomienie na Macu lub Windowsie

Wymagany Node.js 22.12+ (zalecana wersja LTS 24) z npm. Polecenia uruchom w terminalu otwartym w katalogu projektu:

```sh
npm ci
npm run dev
```

Otwórz adres podany przez Vite, standardowo `http://127.0.0.1:5173`. Serwer zatrzymasz skrótem `Ctrl+C` w terminalu. Adres lokalny jest dostępny tylko na komputerze, na którym działa serwer.

Po publikacji córka nie potrzebuje Node.js ani plików projektu. Otwiera publiczny link w Edge lub Chrome.

## Sprawdzanie projektu

```sh
npm test
npm run build
npm run preview
```

`npm test` sprawdza m.in. porównywanie odpowiedzi, treści i powiązania pilota, zapis i migrację, dostępność powtórek oraz ukrywanie wyników diagnozy. `npm run build` sprawdza TypeScript i tworzy gotową aplikację w `dist/`. `npm run preview` udostępnia tę wersję lokalnie, standardowo na porcie 4173.

**Weryfikacja lokalnej wersji v0.2.0:** `npm test` — **179 testów zaliczonych**; `npm run build` — poprawny build produkcyjny. Test przeglądarkowy na tym buildzie przeszedł wszystkie 34 zadania, obie części diagnozy, terminy powtórek, notatki, oceny i wydruki. Potwierdził też migrację zapisu v1, odtworzenie kopii v2 w pustym profilu, obsługę błędów zapisu i widok mobilny. Środowisko: macOS, Chromium 153.0.8010.12. Odbiór na Windowsie i test z córką pozostają do wykonania.

Test przeglądarkowy jest w `tests/browser_smoke.py`. W osobnym środowisku Pythona zainstaluj:

```sh
python -m pip install playwright
python -m playwright install chromium
```

Przy działającym `npm run dev` uruchom:

```sh
python tests/browser_smoke.py http://127.0.0.1:5173
```

Na macOS polecenie interpretera może nazywać się `python3`, a na Windowsie `py`. Test korzysta z odrębnych profili przeglądarki, więc nie zmienia prawdziwego postępu uczennicy. Zrzuty zapisuje w ignorowanym przez Git katalogu `test-results/`.

## Publikacja pod linkiem — Vercel

Repozytorium: [Bredson/matematyka-e8](https://github.com/Bredson/matematyka-e8). Konfiguracja w `vercel.json` ustawia Vite, instalację `npm ci`, kompilację `npm run build` i katalog wynikowy `dist`. Nie potrzeba zmiennych środowiskowych aplikacji ani bazy danych.

### Pierwsza publikacja z GitHub

1. Zaloguj się do Vercel i wybierz **Add New → Project**.
2. Połącz właściwe konto GitHub i zaimportuj `Bredson/matematyka-e8`.
3. Ustaw katalog główny projektu na katalog repozytorium, framework **Vite** i Node.js **24.x**.
4. Sprawdź polecenia z `vercel.json` i wybierz **Deploy**.
5. W ustawieniach Git sprawdź, czy gałęzią produkcyjną jest `main`.

Po połączeniu repozytorium kolejne wysłane commity na `main` uruchamiają publikację automatycznie.

### Publikacja z terminala

Z katalogu projektu:

```sh
npx vercel login
npx vercel whoami
npx vercel link
npx vercel --prod
```

Logowanie wymaga autoryzacji w przeglądarce. Przy `vercel link` wybierz właściwe konto/zespół i istniejący projekt albo utwórz nowy. Jeśli projekt utworzono z terminala, połącz go z repozytorium poleceniem `npx vercel git connect` lub w ustawieniach Git w panelu Vercel. Lokalna konfiguracja `.vercel/` nie trafia do repozytorium.

Vercel poda adres wdrożenia. W **Project → Domains** znajdziesz stały adres produkcyjny. **To stały adres dodaj do zakładek córki**, a nie unikalny adres pojedynczego wdrożenia. Sprawdź go w prywatnym oknie przeglądarki, żeby potwierdzić dostęp bez konta Vercel. Zmiana adresu oznacza inny lokalny magazyn postępu.

### Kolejne aktualizacje

Przed wysłaniem zmian uruchom `npm test` i `npm run build`. W projekcie połączonym z GitHub push na `main` uruchomi wdrożenie. Przy publikacji ręcznej użyj `npx vercel --prod` w tym samym powiązanym katalogu.

Przed aktualizacją warto pobrać kopię postępu. Wersja v0.2.0 migruje zapis prologu v1 do v2 zgodnie z opisem poniżej.

Publikowana jest wyłącznie zawartość `dist/`, bez wyników uczennicy. Fonty i ilustracja są częścią aplikacji; nie wymagają zewnętrznego serwisu fontów. Aplikacja nie ma jeszcze trybu offline — do jej wczytania potrzebny jest internet.

## Instrukcja dla córki i rodzica

Poniższa instrukcja dotyczy pilota v0.2.0.

1. Otwórz https://matematyka-e8-kappa.vercel.app/ w tej samej przeglądarce i profilu; najlepiej poza trybem prywatnym. Do pracy nad kodem możesz używać lokalnego adresu Vite.
2. W zakładce „Pilot” ustaw „Początek pilota”. To data `pilotStart`, czyli dzień 0; bez jej ustawienia rozpoczęcie pierwszej sesji przyjmie bieżącą lokalną datę. Możesz ją później zmienić.
3. Wybierz „Rozpocznij pilot”. Zacznij od diagnozy A i B: po 6 pytań, około 25 minut na część. Zatwierdź jedną odpowiedź albo wybierz „Nie wiem — pomiń zadanie”. Wskazówek nie ma; poprawność, sugestie i klucze pojawią się po obu częściach, także w dzienniku, widoku rodzica i wydrukach.
4. Obliczenia i uzasadnienia zapisuj w zeszycie pod ID zadania. W aplikacji wpisuj sam wynik; ułamki przez `/`, bez jednostki. W przygodach i powtórkach możesz korzystać ze wskazówek. Użytą pomoc spoza aplikacji, np. klucz lub wsparcie rodzica, zaznacz odpowiednim polem.
5. Możesz przerwać i wrócić do szkicu odpowiedzi. „Kontynuuj pilot” proponuje pierwszą nieukończoną dostępną sesję; plan nie wymusza dat zwykłych sesji. Po ukończeniu sesji możesz zapisać czas, trudność, chęć powrotu i opcjonalny tekst w podsumowaniu lub dzienniku.
6. W sesjach 4 i 8 przeznaczcie około 10 minut z budżetu sesji na przegląd jednego–dwóch zapisów w zeszycie. Rodzic wpisuje ocenę 0–2 pkt w „Dla rodzica”. Klucz i oceny są dostępne po ukończeniu wybranej sesji, a dla diagnozy — po obu częściach. Są to punkty robocze, nie skala CKE.
7. W „Kopia postępu” wybierz „Pobierz kopię”. Sprawdź folder Pobrane i zachowaj plik poza danymi przeglądarki.

**Plan a dostępność:** terminy to `pilotStart + day`, gdzie `day` wynosi **0, 2, 4, 6; 8, 9, 11, 13**. Bez daty początku UI numeruje dni od 1. Terminy są orientacyjne. `reviewAfter.days = 3` oznacza minimum od daty rzeczywistego ukończenia źródła: `prolog` → `powrot-1`, `lustra` → `powrot-2`, `ogrod` → `podsumowanie`. Powtórka otwiera się od początku lokalnego dnia ukończenia + 3 dni kalendarzowe, nie po dokładnie 72 godzinach ani w dacie wynikającej wyłącznie z planu. Przedtem zablokowane są rozwiązywanie oraz podgląd i druk pytań. Zmiana `pilotStart` nie skraca tej przerwy.

**Jak czytać wyniki:** plan pozostaje stały i nie dobiera automatycznie nowych zadań. Diagnoza próbkuje 12 szerokich obszarów; wyniki sugerują, co doćwiczyć, a przy obszarach bez dalszych ćwiczeń wskazują potrzebę kolejnego zestawu. Nie są prognozą procentu na E8. „Samodzielnie” i poprawna pierwsza próba bez pomocy nie potwierdzają opanowania całego tematu ani poprawnego rozumowania — to wymaga zeszytu i ręcznej oceny. Widok rodzica jest bez hasła; blokady kluczy dotyczą interfejsu, a nie dostępu do źródeł aplikacji.

### Przeniesienie postępu Mac ↔ Windows

1. Na dotychczasowym komputerze wybierz „Kopia postępu” → „Pobierz kopię”.
2. Przenieś plik `.json` na drugi komputer, np. pendrivem.
3. Otwórz tę samą wersję aplikacji na drugim komputerze i wybierz „Wczytaj kopię”. Kopię v2 przenoś do pilota v0.2.0 lub nowszej zgodnej wersji.
4. Sprawdź liczbę ukończonych etapów i datę. W razie potrzeby pobierz kopię aktualnego zapisu.
5. Wybierz „Zastąp postęp kopią” i sprawdź dziennik.

Postęp nie synchronizuje się automatycznie. Usunięcie danych witryny może go usunąć; plik kopii służy do odtworzenia. W przypadku komunikatu o błędzie zapisu pobierz kopię przed zamknięciem strony. Korzystanie z dwóch kart naraz może zatrzymać zapis jednej z nich — komunikat podpowie, jak postąpić.

### Zapis v2 i zgodność ze starym prologiem

- Rejestr ma `version: 2` i klucz `kocie-archiwum.progress.v2`. Tylko gdy klucza v2 nie ma, aplikacja odczytuje `kocie-archiwum.progress.v1` i migruje dane, nie usuwając starego klucza.
- Uszkodzony zapis v2 nie uruchamia fallbacku do v1. Aplikacja zgłasza błąd i zatrzymuje zapis, chroniąc poprzednie dane przed nadpisaniem.
- Import przyjmuje poprawne kopie v1 oraz v2, maksymalnie 5 MB (5 000 000 bajtów). Eksport z nowej aplikacji zapisuje v2, także po migracji; nie ma eksportu wstecznego do v1.
- Zachowane są stare ID, odpowiedzi, oceny i daty. Pozostałe sesje dostają pusty stan. Ponieważ v1 nie zapisywało momentu użycia pomocy, migracja konserwatywnie oznacza `assisted` we wszystkich próbach danego zadania, jeżeli miało wskazówki lub pomoc zewnętrzną.

## Struktura

```text
src/content/adventure.ts          zachowane cztery zadania prologu
src/content/pilot.ts              8 sesji, 34 zadania, terminy i powtórki
src/content/pilot-types.ts        kontrakt sesji i zadań pilota
src/content/curriculum.ts         29 działów i 36 zweryfikowanych podpunktów
src/content/pilot-coverage.ts     taskRequirements: dokładne mapowanie 34 zadań
src/lib/answers.ts                dokładne porównywanie liczb wymiernych
src/lib/progress.ts               zapis v2, migracja, kopie i dostępność sesji
src/lib/legacy-progress.ts        walidacja starego formatu v1
src/lib/reporting.ts              widoczność wyników i kluczy
src/components/PilotDashboard.tsx plan sesji i data początku
src/components/PilotReports.tsx   dziennik, diagnoza, oceny, notatki i druk
src/components/PuzzleCard.tsx     zadania, limit diagnozy i wskazówki
src/components/CurriculumView.tsx zakładka „Zakres” i jawne luki
src/components/ArchiveScene.tsx   autorska ilustracja SVG
src/components/MathText.tsx       zapis wzorów przez KaTeX
src/App.tsx                      nawigacja i integracja pilota
src/styles.css                   podstawowy wygląd i układ responsywny
src/pilot.css                    układ widoków pilota
src/print.css                    oddzielny wydruk uczennicy i rodzica
docs/PILOT_CONTENT.md             plan treści i sprawdzony klucz
docs/CURRICULUM.md                źródła, audyt wymagań i matryca zadań
tests/browser_smoke.py            test ścieżek w Chromium
```

Identyfikatory ukończonych zadań należy zachowywać. Istotna zmiana treści zadania powinna otrzymać nowy identyfikator i świadomie zaplanowaną migrację, żeby dawnego wyniku nie przypisać do nowego pytania.

## Następny etap

Odbiór na docelowych przeglądarkach i pilot z córką. Dalej: dopasowanie trudności na podstawie obserwacji, rozbudowa szczegółowej matrycy i treści, długoterminowe powtórki oraz Detektyw błędów. Obecny pilot ma trzy zaplanowane powtórki z blokadą minimalnego odstępu; pełny zakres E8 i automatycznie adaptowany plan pozostają do zbudowania.

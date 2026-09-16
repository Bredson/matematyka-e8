# Kocie Archiwum

Matematyczne przygody z kotami dla uczennicy przygotowującej się do egzaminu ósmoklasisty w 2027 roku.

**Stan: pierwszy grywalny prototyp, nie pełne repetytorium ani dwutygodniowy pilot.**

## Co już działa

- Przygoda „Tajemnica zaginionej strony”: trzy zagadki i bilet wyjścia bez fabuły.
- Sprawdzanie równoważnych odpowiedzi, w tym `1/2`, `4/8`, `0,5` i `0.5`.
- Stopniowane wskazówki, pełne rozwiązanie i przejście dalej po omówieniu.
- Oddzielne oznaczanie pomocy aplikacji i pomocy spoza aplikacji.
- Lokalny zapis prób, szkiców odpowiedzi, pomocy i punktów przyznanych przez rodzica.
- Dziennik i widok rodzica z rozwiązaniami oraz roboczymi kryteriami oceny.
- Druk karty pracy bez odpowiedzi albo raportu z kluczem.
- Eksport i import kopii JSON z walidacją oraz potwierdzeniem zastąpienia danych.

Plan i harmonogram są w [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md). Dawne warianty metod zachowano w [3-teaching-methods.md](3-teaching-methods.md).

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

`npm test` sprawdza porównywanie odpowiedzi, spójność kopii i rozróżnianie pracy z pomocą. `npm run build` sprawdza TypeScript i tworzy gotową aplikację w `dist/`. `npm run preview` udostępnia tę wersję lokalnie, standardowo na porcie 4173.

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

Przed aktualizacją warto pobrać kopię postępu. Zmiana formatu zapisu w przyszłych wersjach wymaga migracji; nie należy po prostu usuwać dotychczasowych danych.

Publikowana jest wyłącznie zawartość `dist/`, bez wyników uczennicy. Fonty i ilustracja są częścią aplikacji; nie wymagają zewnętrznego serwisu fontów. Aplikacja nie ma jeszcze trybu offline — do jej wczytania potrzebny jest internet.

## Instrukcja dla córki i rodzica

1. Otwórz stały link w tej samej przeglądarce i profilu; najlepiej poza trybem prywatnym.
2. Wybierz „Otwórz archiwum”. Zapisuj obliczenia w zeszycie pod tytułem zadania.
3. Wpisz sam wynik. Ułamki zapisuj przez `/`, a jednostkę pomiń, jeśli pokazano ją obok pola.
4. W razie potrzeby korzystaj ze wskazówek. Pomoc z zeszytu, klucza lub od rodzica zaznacz polem „Korzystałam z pomocy poza aplikacją”.
5. Przerwij w dowolnym momencie. „Kontynuuj przygodę” wraca do pierwszego nieukończonego zadania, razem z wpisanym szkicem odpowiedzi.
6. Raz w tygodniu rodzic porównuje jedno–dwa rozwiązania z zeszytu z kluczem i zaznacza punkty w „Dla rodzica”.
7. W „Kopia postępu” wybierz „Pobierz kopię”. Sprawdź folder Pobrane i zachowaj plik poza danymi przeglądarki.

Widok rodzica jest dostępny bez hasła i zawiera odpowiedzi. „Samodzielnie” oznacza brak **zadeklarowanej** pomocy i użytych podpowiedzi w danym zadaniu, nie zweryfikowane opanowanie całego tematu.

### Przeniesienie postępu Mac ↔ Windows

1. Na dotychczasowym komputerze wybierz „Kopia postępu” → „Pobierz kopię”.
2. Przenieś plik `.json` na drugi komputer, np. pendrivem.
3. Otwórz aplikację na drugim komputerze i wybierz „Wczytaj kopię”.
4. Sprawdź liczbę ukończonych etapów i datę. W razie potrzeby pobierz kopię aktualnego zapisu.
5. Wybierz „Zastąp postęp kopią” i sprawdź dziennik.

Postęp nie synchronizuje się automatycznie. Usunięcie danych witryny może go usunąć; plik kopii służy do odtworzenia. W przypadku komunikatu o błędzie zapisu pobierz kopię przed zamknięciem strony. Korzystanie z dwóch kart naraz może zatrzymać zapis jednej z nich — komunikat podpowie, jak postąpić.

## Struktura

```text
src/content/adventure.ts          treść, odpowiedzi, wskazówki i kryteria zadań
src/lib/answers.ts                dokładne porównywanie liczb wymiernych
src/lib/progress.ts               format zapisu, walidacja i kopie
src/components/ArchiveScene.tsx   autorska ilustracja SVG
src/components/MathText.tsx       zapis wzorów przez KaTeX
src/App.tsx                      ekrany i przebieg przygody
src/styles.css                   wygląd i układ responsywny
src/print.css                    oddzielny wydruk uczennicy i rodzica
tests/browser_smoke.py            test całej ścieżki w Chromium
```

Identyfikatory ukończonych zadań należy zachowywać. Istotna zmiana treści zadania powinna otrzymać nowy identyfikator i świadomie zaplanowaną migrację, żeby dawnego wyniku nie przypisać do nowego pytania.

## Następny etap

Weryfikacja oficjalnej matrycy wymagań, diagnoza i dwutygodniowy pilot. Następnie test z córką, dopasowanie trudności i rozbudowa przygód. Automatyczne powtórki, pełny zakres E8 i Detektyw błędów pozostają do zbudowania.

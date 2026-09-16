# Plan realizacji — Matematyka do E8 (2027)

## 1. Status i przeznaczenie

- Ten dokument określa aktualne ustalenia; `3-teaching-methods.md` pozostaje archiwum propozycji.
- Zatwierdzone są kierunek nauki, harmonogram, model pracy i wybór technologii opisane poniżej.
- **Zaimplementowano pierwszy prototyp:** jedna przygoda, 3 zadania + sprawdzenie transferu, zapis, kopie, ocena rodzica i druk.
- Przeszedł lokalne testy techniczne opisane w sekcji 11; test z córką i odbiór na Windowsie pozostają do wykonania. Nie stanowi całego dwutygodniowego pilota.
- Matryca wymagań, pilot, test z córką, pełna zawartość oraz Detektyw błędów są planowane.
- **Pełny zakres E8 nie jest jeszcze pokryty ani zweryfikowany.**
- Docelowy hosting: Vercel, repozytorium `Bredson/matematyka-e8`, gałąź produkcyjna `main`. To zastępuje wcześniejszy wybór Cloudflare Pages.
- Poza wymienionym prototypem poniższe funkcje i kryteria opisują wymagania do realizacji; lista gotowych możliwości jest w `README.md`.

## 2. Uczennica i cel

- Uczennica ma 14 lat, dobre oceny i niską motywację do dodatkowej nauki.
- Nauka bez rywalizacji, rankingów, kar za błędy i presji codziennych serii.
- Cel: wynik **>90%**, czyli minimum **28/30 pkt** przy arkuszu za 30 punktów.
- Realność celu oceniamy po diagnozie i kolejnych samodzielnych próbach; wynik nie jest gwarantowany.
- Budżet: 2–3 godziny tygodniowo, łącznie z powtórkami, sprawdzaniem i poprawą.
- Fantastyczna fabuła z kotami ma ułatwiać rozpoczęcie pracy i dawać wybór kolejnych przygód.
- Fabuła jest krótka i adekwatna do wieku; matematyka oraz samodzielne rozumowanie pozostają celem.

## 3. Harmonogram nauki

| Okres | Forma i zamierzony rezultat |
| --- | --- |
| Październik 2026 – styczeń 2027 | Escape Room: przejście przez cały zweryfikowany zakres E8, powtórki i transfer do zadań bez fabuły. |
| Luty – marzec 2027 | Detektyw błędów: analiza pomyłek, naprawa luk, uzasadnienia i samodzielne zadania mieszane. |

- Mapa misji nie ma osobnego etapu nauki. W prototypie nawigacją jest lista etapów przygody.
- Szczegółowy rozkład tematów powstanie po matrycy wymagań i diagnozie; daty nie dowodzą pokrycia zakresu.
- Wybór drogi na mapie uwzględnia zależności między umiejętnościami oraz zaległe powtórki.
- Przykładowy tydzień: 3 × 30 minut + 45 minut = 135 minut, w tym przegląd z rodzicem.
- Pełny arkusz i jego analiza zastępują zwykłe sesje; czas arkusza trzeba potwierdzić dla egzaminu 2027.
- Jeśli zakres nie mieści się w budżecie, ograniczamy rozbudowę fabuły i ponownie uzgadniamy priorytety.

## 4. Hybrydowy przebieg pracy

1. Aplikacja przedstawia cel misji, krótką historię i treść zadania.
2. Uczennica zapisuje rachunki, rysunki i uzasadnienia w zeszycie; druk jest opcjonalny.
3. Odpowiedź końcową wpisuje w aplikacji, a zapis w zeszycie oznacza identyfikatorem zadania.
4. Po próbie może skorzystać ze stopniowanych wskazówek i wyjaśnionego rozwiązania.
5. Po przygodzie wykonuje nowe zadanie transferowe bez fabuły i bez pomocy.
6. Raz w tygodniu rodzic ocenia wybrane zadania otwarte z zeszytu według klucza i kryteriów punktowych.
7. Wynik oceny, krótka uwaga i potrzeba powtórki trafiają do lokalnego rejestru aplikacji.

- Aplikacja automatycznie sprawdza tylko odpowiedzi, dla których zdefiniowano jednoznaczne reguły.
- Trafna odpowiedź końcowa nie potwierdza poprawnego uzasadnienia ani pełnej punktacji zadania otwartego.
- Otwarte zadania bez oceny rozumowania mają status „oczekuje na ocenę”, nie „opanowane”.
- Rodzic wspiera pytaniami i rozmową o postępie; udzieloną pomoc także odnotowujemy.
- Papierowy zapis rozwiązania pozostaje w zeszycie; nie zakładamy skanowania ani przesyłania zdjęć.

## 5. Pierwszy pionowy prototyp

- Zakres bieżącej pracy: jedna krótka kocia przygoda, 3 zadania i jedno nowe zadanie transferowe.
- Przygoda ma sprawdzić cały przebieg: wejście → zadania → informacja zwrotna → transfer → zapis wyniku.
- Każde zadanie potrzebuje polecenia, odpowiedzi, rozwiązania, wskazówek i zasad oceny.
- Co najmniej jedno zadanie wymaga zapisu rozumowania w zeszycie i oceny rodzica.
- Pomoc otwiera dalszą drogę fabularną, ale nie nadaje statusu samodzielnego opanowania.
- Zakończenie prototypu wymaga działającego zapisu oraz sprawdzonego eksportu i odtworzenia danych.
- Odbiór tej przygody jest warunkiem przejścia do pilota, a nie dowodem skuteczności całej metody.

## 6. Matryca wymagań i jakość treści

- **Do wykonania i weryfikacji:** matryca oparta na oficjalnej podstawie programowej właściwej dla E8 2027.
- Trzeba sprawdzić aktualność podstawy, informatora CKE oraz zasad oceniania dla tego egzaminu.
- Deklaracje weryfikacji w archiwum nie zastępują tego sprawdzenia; nie przejmujemy z niego numeracji działów.
- Każdy wiersz matrycy ma zawierać dokładne wymaganie i oznaczenie przepisane ze sprawdzonego dokumentu.
- W wierszu zapisujemy również źródło i jego wersję/datę, umiejętność, zależności oraz identyfikatory zadań.
- Dalsze pola: diagnoza, przygoda, transfer, opóźniona powtórka, stan treści i wynik kontroli merytorycznej.
- Osobno pokazujemy pokrycie wymagania przez materiały i opanowanie go przez uczennicę.
- Lista działów ani liczba przygód nie są dowodem pełnego pokrycia podstawy.
- Do każdego zadania powstaje sprawdzony klucz, dopuszczalne odpowiedzi i kryteria punktów częściowych.
- Przed użyciem trzeba rozwiązać zadania niezależnie od klucza i sprawdzić dane, jednostki, rysunki oraz jednoznaczność.
- Liczba kolejnych przygód wynika z matrycy i pilota; nie przyjmujemy z góry liczby gwarantującej cały zakres.

## 7. Postęp, samodzielność i powtórki

- Rejestr próby obejmuje zadanie, wymaganie, datę, odpowiedź, punkty, wykorzystaną pomoc i stan oceny.
- Rozróżniamy: „niepróbowane”, „w trakcie”, „z pomocą”, „oczekuje na ocenę”, „samodzielnie”, „do powtórki”.
- Wskazówka, podgląd rozwiązania lub pomoc rodzica wykluczają zaliczenie tej próby jako samodzielnej.
- Ponowne wpisanie poznanej odpowiedzi nie jest nowym dowodem opanowania umiejętności.
- Potwierdzenie opanowania wymaga samodzielnego transferu oraz nowego zadania po przerwie.
- Dla zadania otwartego potwierdzenie obejmuje również ocenę rozumowania według klucza.
- Powroty planujemy po kilku dniach, po tygodniu i po kilku tygodniach; terminy dopasujemy po pilocie.
- Powtórki mieszają typy zadań; błędy uruchamiają wyjaśnienie i kolejną próbę na nowym przykładzie.
- Ukończenie historii, liczba prób i wynik z pomocą są widoczne oddzielnie od samodzielnego postępu.
- Widok wyników ma pokazywać luki, oczekujące oceny i powtórki uczennicy oraz rodzicowi.

## 8. Technologia i przechowywanie wyników

- Aplikacja: React + TypeScript + Vite; hosting statyczny: Vercel, konfiguracja w `vercel.json`.
- Bez kont, backendu i synchronizacji; aplikacja działa w przeglądarce na Macu i Windowsie.
- Zapis wyników prototypu: lokalny magazyn przeglądarki `localStorage`, przypisany do adresu aplikacji i profilu.
- Wyniki nie trafiają do repozytorium ani na serwer; obecnie nie ma wyników pilota ani testu z córką.
- Inna przeglądarka, profil, komputer lub adres aplikacji mają odrębny magazyn danych.
- Usunięcie danych witryny, tryb prywatny lub utrata profilu może usunąć postęp.
- Lokalny zapis nie jest kopią zapasową; bez wyeksportowanego pliku nie zapewniamy odzyskania danych.
- Eksport JSON ma zawierać wersję formatu, datę kopii, próby, oceny rodzica, pomoc i harmonogram powtórek.
- Rodzic zapisuje kopię poza danymi przeglądarki co tydzień oraz przed importem, zmianą urządzenia lub adresu.
- Plik przechowuje w wybranym folderze komputera; dla ochrony przed awarią urządzenia także na osobnym nośniku.
- Przeniesienie Mac ↔ Windows: ręczny eksport pliku, przekazanie go i import w przeglądarce docelowej.
- Import ma sprawdzać strukturę i wersję, pokazywać podsumowanie oraz wymagać potwierdzenia zastąpienia danych.
- Uszkodzony lub nieobsługiwany plik nie może nadpisać obecnego zapisu; nie planujemy automatycznego scalania.
- Błąd lub niedostępność zapisu musi być widoczna; aplikacja nie może wtedy deklarować „zapisano”.

## 9. Kolejność realizacji i bramki

| Krok | Status teraz | Warunek przejścia dalej |
| --- | --- | --- |
| 1. Matryca oficjalnych wymagań | Do wykonania i weryfikacji | Sprawdzone źródła, wymagania i jawne luki; przypisanie zadań prototypu. |
| 2. Działająca przygoda | Prototyp przeszedł lokalne testy techniczne | Pozostają publiczny link, kontrola na Windowsie i odbiór z córką. |
| 3. Przygotowanie dwutygodniowego pilota | Planowane | Gotowa diagnoza, plan sesji, dalsze zadania, powtórki i klucze w budżecie czasu. |
| 4. Test z córką podczas pilota | Planowany | Zebrane wyniki diagnozy, transferu i powtórek oraz uwagi o motywacji i obsłudze. |
| 5. Rozszerzenie na cały zakres | Planowane | Uzupełniona matryca pokrycia, zweryfikowane zadania i działające powtórki. |
| 6. Detektyw błędów | Planowany na luty–marzec 2027 | Gotowe sprawy, klucze i nowe zadania sprawdzające naprawę wykrytych luk. |

- Matryca jest pierwszą bramką merytoryczną, choć budowa technicznego prototypu już trwa.
- Pilot rozpocznie diagnoza: dwa krótkie zestawy po około 25 minut, wliczone w czas nauki.
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
- Otwarte: oczekiwanie na ocenę i punkty częściowe są odróżnione od automatycznie poprawnej odpowiedzi.
- Pełny zakres: wszystkie wymagania matrycy mają zweryfikowane materiały, transfer i powtórki; luki są jawne.
- Odbiór techniczny nie oznacza osiągnięcia >90%; potrzebne są wyniki samodzielnych, nowych prób egzaminacyjnych.
- Dowody odbioru dopisujemy w tym planie: data, wersja aplikacji, środowisko, próba, rezultat i otwarte problemy.

## 11. Stan dowodów i ryzyka

- Wersja 0.1.0: `npm test` — 45 testów zakończonych powodzeniem; `npm run build` — poprawny TypeScript i build produkcyjny.
- Test `tests/browser_smoke.py` na macOS w Chromium 153.0.8010.12: pełna przygoda, samodzielność i pomoc, odświeżenie ze szkicem, punkty rodzica, wydruki, eksport i import w pustym profilu, odrzucenie błędnego JSON, uszkodzony/niedostępny zapis, konflikt kart i ekran 390 px — zaliczone.
- Zrzuty kontrolne są lokalnie w `test-results/` (poza Git). Nie wykonywano jeszcze odbioru w Windows Edge/Chrome ani Safari. Brak wyników pilota i testu z córką.
- Kontrola rachunków prototypu: 3/8 + 1/8 = 1/2; 3/4 z 24 = 18; 25 − (3 × 4,50 + 2 × 3,25) = 5; 5/12 + 1/4 = 2/3. Kryteria ćwiczeń są robocze, nie oficjalne CKE.
- Publikacja na Vercel wymaga autoryzacji konta; instrukcja uruchomienia i połączenia GitHub znajduje się w `README.md`. Publiczny adres potwierdzamy po udanym wdrożeniu.
- Najbliższe dowody do zebrania: weryfikacja matrycy, odbiór na Windowsie i test z córką. Automatyczny harmonogram powtórek i matryca nie są częścią prototypu.
- Główne ryzyka: niepełny zakres, przeciążenie czasu nauki lub tworzenia treści, nietrafiona fabuła i utrata lokalnych danych.
- Ograniczamy je przez matrycę, mały prototyp, pilot z córką, kontrolę matematyczną i sprawdzane kopie JSON.
- Do czasu zebrania dowodów plan pozostaje specyfikacją i harmonogramem prac, nie raportem ukończonego produktu.

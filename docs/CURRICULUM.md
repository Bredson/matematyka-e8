# Matematyka E8 2027 — weryfikacja zakresu i mapa pilota

**Data badania i audytu zadań: 16 września 2026 r.** Zakres: wymagania matematyczne dla zwykłej podstawy szkoły podstawowej, zasady standardowego E8 oraz rzeczywiste powiązanie wszystkich 34 zadań pilota z wybranymi wymaganiami. Nie jest to certyfikat kompletności kursu ani badanie opanowania materiału przez ucznia.

**Wynik:** CKE wskazuje dla egzaminu 2027 podstawę programową z 2024 r. Odczytano wszystkie **29 działów** matematyki dla klas IV–VI oraz VII–VIII. W `src/content/curriculum.ts` zapisano **36 unikalnych wymagań szczegółowych**, powiązanych z wszystkimi **16 kategoriami `SkillId`**. W `src/content/pilot-coverage.ts` każde z **34 zadań** ma przynajmniej jedną właściwą referencję; łącznie jest to **23 różne punkty ćwiczone częściowo**, a nie 23 punkty opanowane w całości. Szczególnie `geometry` i `fractions` są szerokimi kategoriami; ich obecność nie oznacza pokrycia całego działu.

## 1. Co obowiązuje i skąd to wiadomo

### Potwierdzenie dotyczące właśnie egzaminu 2027

[Informacja CKE o sposobie organizacji i przeprowadzania E8 w roku szkolnym 2026/2027](https://cke.gov.pl/images/_EGZAMIN_OSMOKLASISTY/2026_2027/komunikaty/20260820_E8_2027_Informacja_COMPL_fin.pdf), **data publikacji na stronie tytułowej: 20 sierpnia 2026 r.**, s. 13, pkt 2.1, stwierdza wprost:

> Egzamin ósmoklasisty w 2027 r. jest przeprowadzany na podstawie wymagań określonych w podstawie programowej kształcenia ogólnego (z 2024 r.) dla szkoły podstawowej [...].

W pkt 1.1.3 na s. 5 dokument wskazuje rozporządzenie z 28 czerwca 2024 r., Dz.U. poz. 996, a w pkt 1.1.5 — informatory od roku szkolnego 2024/2025. To bezpośrednie potwierdzenie dla rocznika 2027; nie wywodzimy obowiązywania jedynie z nazwy pliku „2025”. Dokument jest podlinkowany na [oficjalnej stronie komunikatów CKE](https://cke.gov.pl/egzamin-osmoklasisty/harmonogram-komunikaty-i-informacje/).

### Tekst wymagań

Podstawą numeracji jest **załącznik nr 1 do rozporządzenia Ministra Edukacji z 28 czerwca 2024 r.**, nadający nowe brzmienie załącznikowi nr 2 do rozporządzenia z 14 lutego 2017 r. [Rekord Dziennika Ustaw 2024 poz. 996](https://dziennikustaw.gov.pl/DU/2024/996) potwierdza **ogłoszenie 5 lipca 2024 r.** i udostępnia [urzędowy PDF](https://dziennikustaw.gov.pl/DU/2024/996/D2024000099601.pdf). Treść odczytano z [oficjalnej kopii tego aktu na CKE](https://cke.gov.pl/images/_EGZAMIN_OSMOKLASISTY/2024/komunikaty/D20240996.pdf): § 5, s. 1, wskazuje wejście w życie **1 września 2024 r.**

W tej kopii matematyka zaczyna się na s. 182; wymagania szczegółowe są na s. 183–194. Są to numery stron drukowane w Dzienniku Ustaw, zgodne z numerami stron tej kopii PDF. `sourceUrl` w danych odsyła do przeczytanej kopii CKE z fragmentem `#page=...`, nie do pośrednika ekstrakcji. Sprawdzono rekord publikacyjny Dziennika Ustaw; nie wykonywano porównania binarnego obu kopii PDF.

[Strona CKE „Podstawa programowa”](https://cke.gov.pl/egzamin-osmoklasisty/podstawa-programowa/) również wskazuje, że **od 2025 r.** egzamin opiera się na wymaganiach ogólnych i szczegółowych podstawy, i odsyła do tego aktu. Nie należy zastępować go starszą listą czasowo ograniczonych „wymagań egzaminacyjnych”. Nie prowadzono niezależnego przeglądu wszystkich późniejszych nowelizacji prawa oświatowego; wybór aktu dla E8 2027 potwierdza przywołana informacja CKE.

### Rola informatora

[Informator CKE z matematyki od roku szkolnego 2024/2025](https://cke.gov.pl/images/_EGZAMIN_OSMOKLASISTY/Informatory/2025/standard/Informator_E8_matematyka_2025_P1.pdf), wydanie oznaczone **„Warszawa 2025”**, na s. 5 odsyła do Dz.U. 2024 poz. 996. [Aktualna strona informatorów CKE](https://cke.gov.pl/egzamin-osmoklasisty/informatory/) odsyła do tego samego pliku. Nie ustalono dziennej daty wydania tej wersji — daty techniczne HTTP/„Published Time” pośrednika nie są tu traktowane jako data publikacji merytorycznej.

Na s. 5 informator zastrzega, że przykłady **nie wyczerpują typów zadań ani wszystkich wymagań** i nie mogą być jedyną ani główną wskazówką planowania nauczania. Brak zadania z danego tematu w informatorze nie dowodzi wyłączenia tematu z E8.

## 2. Koła, okręgi i symetrie — istotne rozróżnienia

Źródło numeracji i treści poniżej: [Dz.U. 2024 poz. 996, kopia CKE, s. 186–187 i 193–194](https://cke.gov.pl/images/_EGZAMIN_OSMOKLASISTY/2024/komunikaty/D20240996.pdf#page=186).

| Oznaczenie | Potwierdzona treść | Wniosek dla przygotowania |
| --- | --- | --- |
| `IV–VI.IX.5` | Własności czworokątów; rozpoznawanie figur osiowosymetrycznych i wskazywanie osi symetrii. | Nie usuwać podstawowej symetrii z przygotowania. Informator, zad. 20, s. 28, przywołuje ten punkt. |
| `IV–VI.IX.6` | Wskazywanie na rysunku cięciwy, średnicy i promienia koła i okręgu. | To wymaganie wcześniejszych klas; informator, zad. 22, s. 30, odwołuje się do niego wprost. |
| `IV–VI.IX.7` | Rysowanie cięciwy, a przy danym środku także promienia i średnicy. | Pozostaje w podstawie; nie zapisano osobnego wpisu w `verifiedRequirements`. |
| `VII–VIII.XIV.1–4` | Długość okręgu i pole koła przy danym promieniu/średnicy oraz zadania odwrotne: promień/średnica z długości okręgu lub pola koła. | Wszystkie cztery punkty istnieją w podstawie wskazanej dla 2027. Nie znaleziono ich wyłączenia w zbadanych źródłach. Uwzględnić w planowaniu zakresu E8. |
| `VII–VIII.XV.1–4` | Symetralna i dwusieczna, ich własności, rozpoznawanie i uzupełnianie figur osiowosymetrycznych, figury środkowosymetryczne. | Dział ma szczególną możliwość realizacji po egzaminie; pozostaje w mapie podstawy, ale nie jest oznaczony jako bezwarunkowy cel przedegzaminacyjny. |

Kluczowy zapis w **„Warunkach i sposobie realizacji”, s. 194** brzmi:

> Dział XV podstawy programowej w zakresie przedmiotu matematyka dla klas VII i VIII może zostać zrealizowany po egzaminie ósmoklasisty.

Zapis dotyczy **tylko XV**, nie XIV. Nie można z niego wyprowadzać wyłączenia długości okręgu i pola koła ani usunięcia osi symetrii z `IV–VI.IX.5`. Dosłownie potwierdzono możliwość późniejszej realizacji XV; w zbadanych dokumentach nie znaleziono osobnego zdania CKE „wszystkie punkty XV są wyłączone z E8 2027”. Mapa zachowuje tę różnicę między treścią przepisu a jego interpretacją przy planowaniu nauki. Przykłady dotyczące wcześniejszych klas można sprawdzić w [informatorze, s. 28–30](https://cke.gov.pl/images/_EGZAMIN_OSMOKLASISTY/Informatory/2025/standard/Informator_E8_matematyka_2025_P1.pdf#page=28).

## 3. Pełna mapa działów, częściowa mapa podpunktów

Notacja lokalna to **`etap.dział.punkt`**, np. `IV–VI.V.1` i `VII–VIII.I.1`. Etap jest konieczny, ponieważ numeracja działów zaczyna się od I dla każdej grupy klas. W `curriculumAreas.reference` zapisano etap i dział, a w `verifiedRequirements.reference` także numer punktu. Tytuły nie powtarzają numerów rzymskich. Wymagania ogólne mają osobną numerację i nie są wliczone do 29 działów.

W tabelach „wybrane powiązania” oznaczają związek tematyczny z kategoriami aplikacji. **Brak osobnego wpisu oznacza lukę katalogu `verifiedRequirements`**, nie automatycznie brak jakiegokolwiek użycia zagadnienia w zadaniach. Wykonano dodatkowo audyt treści wszystkich zadań pilota, ich podpowiedzi, rozwiązań i rubryk. Jego matryca oraz konkretne braki są w sekcji 6; to ona opisuje rzeczywiste powiązania per zadanie. Audyt nie obejmuje działania interfejsu ani automatycznej oceny metod zapisanych przez ucznia w zeszycie.

### Klasy IV–VI — 14 działów

Wszystkie tytuły i zakresy numerów odczytano z [podstawy, s. 183–189](https://cke.gov.pl/images/_EGZAMIN_OSMOKLASISTY/2024/komunikaty/D20240996.pdf#page=183). Kolumna punktów służy wskazaniu rozmiaru działu, nie stanowi jego pełnej transkrypcji.

| Dział | Tytuł | Punkty | Wybrane powiązania i jawne luki |
| --- | --- | --- | --- |
| `IV–VI.I` | Liczby naturalne w dziesiątkowym układzie pozycyjnym | 1–5 | Brak bezpośredniej kategorii (`skillIds: []`); zapis pozycyjny, zaokrąglanie i system rzymski do 3000 wymagają osobnego ujęcia. |
| `IV–VI.II` | Działania na liczbach naturalnych | 1–15 | `powers`, `fractions` tylko częściowo: kwadraty/sześciany i związki NWD/NWW z ułamkami. Nie odwzorowano osobno podzielności, liczb pierwszych, rachunków i reszty z dzielenia. |
| `IV–VI.III` | Liczby całkowite | 1–5 | `integers`, `coordinates`; wpisano rachunki z pkt 5. Wartość bezwzględna, oś i porównywanie bez osobnych wpisów. |
| `IV–VI.IV` | Ułamki zwykłe i dziesiętne | 1–14 | `fractions`, `decimals`; wybrano pkt 3, 4, 12. Pozostają m.in. liczby mieszane, rozwinięcia, oś i odtwarzanie całości. |
| `IV–VI.V` | Działania na ułamkach zwykłych i dziesiętnych | 1–7 | `fractions`, `decimals`, `powers`, `integers`; wybrano pkt 1, 2, 4. Brak pełnej mapy działań mieszanych i ich ograniczeń trudności. |
| `IV–VI.VI` | Elementy algebry | 1–3 | `expressions`, `equations`; bez osobnych wpisów tych punktów. Równania z późniejszych klas nie zastępują metod i wzorów tego etapu. |
| `IV–VI.VII` | Proste i odcinki | 1–5 | `geometry`, `units`; brak osobnych wpisów: rozpoznawanie, rysowanie, pomiar, odległość od prostej. |
| `IV–VI.VIII` | Kąty | 1–6 | `geometry`; brak osobnych wpisów rodzajów, pomiaru i własności kątów. |
| `IV–VI.IX` | Wielokąty, koła i okręgi | 1–8 | `geometry`; wybrano pkt 5 i 6. Trójkąty, ich konstrukcja i pozostałe własności nie mają pełnego odwzorowania. |
| `IV–VI.X` | Bryły | 1–5 | `solids`; bez osobnych wpisów tego działu. Rozpoznawanie, siatki i zależności między krawędziami to inne cele niż samo liczenie objętości. |
| `IV–VI.XI` | Obliczenia w geometrii | 1–7 | `geometry`, `solids`, `units`; wybrano pkt 3, 6 i 7. Pilot ćwiczy pole trapezu, objętość prostopadłościanu i l/ml; brak zadań na pola powierzchni, pozostałe pola i obwody. |
| `IV–VI.XII` | Obliczenia praktyczne | 1–9 | `percent`, `units`, `proportions`, `word-problems`, `integers`; wybrano pkt 6 i 7 (km/m oraz g/kg). Zegar, kalendarz, skala, odczyt temperatury i ruch bez osobnych wpisów. Zadanie o zmianach temperatury przypisano do rachunków całkowitych. |
| `IV–VI.XIII` | Elementy statystyki opisowej | 1–2 | `statistics`; oba punkty bez osobnych wpisów. Sama średnia z VII–VIII nie pokrywa zbierania ani interpretacji danych. |
| `IV–VI.XIV` | Zadania tekstowe | 1–7 | `word-problems`; wybrano pkt 5. Etapy pracy, sprawdzanie sensowności i układanie zadań pozostają poza szczegółową mapą. |

### Klasy VII–VIII — 15 działów

Wszystkie tytuły i zakresy numerów odczytano z [podstawy, s. 189–194](https://cke.gov.pl/images/_EGZAMIN_OSMOKLASISTY/2024/komunikaty/D20240996.pdf#page=189).

| Dział | Tytuł | Punkty | Wybrane powiązania i jawne luki |
| --- | --- | --- | --- |
| `VII–VIII.I` | Potęgi o podstawach wymiernych | 1–5 | `powers`; wybrano pkt 1, 2 i 4. Pilot ćwiczy pkt 2 i 4 także przez obliczenie wprost. Różne podstawy i notacja wykładnicza bez osobnych wpisów. |
| `VII–VIII.II` | Pierwiastki | 1–5 | `roots`; wybrano pkt 1 i 4. Szacowanie, porównywanie oraz pkt 5 bez osobnych wpisów. |
| `VII–VIII.III` | Tworzenie wyrażeń algebraicznych z jedną i wieloma zmiennymi | 1–4 | `expressions`, `word-problems`; wybrano pkt 2. Modelowanie zależności i zapis rozwiązań wymagają dalszego ujęcia. |
| `VII–VIII.IV` | Przekształcanie wyrażeń algebraicznych. Sumy algebraiczne i działania na nich | 1–4 | `expressions`; wybrano pkt 2. Mnożenie sum przez jednomian i dwumianów bez osobnych wpisów. |
| `VII–VIII.V` | Obliczenia procentowe | 1–5 | `percent`; wybrano pkt 2 i 5. Pozostałe warianty, w tym odtwarzanie całości, bez osobnych wpisów. |
| `VII–VIII.VI` | Równania z jedną niewiadomą | 1–5 | `equations`, `expressions`, `word-problems`; wybrano pkt 2 i 4. Sprawdzanie rozwiązań, sprowadzanie do liniowych i przekształcanie wzorów bez osobnych wpisów. |
| `VII–VIII.VII` | Proporcjonalność prosta | 1–3 | `proportions`; wybrano pkt 2 i 3. Pilot ćwiczy skalowanie cen/przepisu i podział nasion 2:3; nie wymaga samodzielnego podawania przykładów proporcjonalności. |
| `VII–VIII.VIII` | Własności figur geometrycznych na płaszczyźnie | 1–8 | `geometry`; wybrano pkt 7 (Pitagoras). Duże luki: przystawanie, nierówność trójkąta, kąty i dowody. |
| `VII–VIII.IX` | Wielokąty | 1–2 | `geometry`; brak osobnych wpisów wielokątów foremnych oraz zadań na pola i odcinki. |
| `VII–VIII.X` | Oś liczbowa. Układ współrzędnych na płaszczyźnie | 1–6 | `coordinates`, `geometry`; wybrano pkt 2. Zbiory na osi, zaznaczanie punktów, środek, długość odcinka i punkty na prostej bez osobnych wpisów. |
| `VII–VIII.XI` | Geometria przestrzenna | 1–3 | `solids`; brak osobnych wpisów. Graniastosłupy i ostrosłupy, także nieprawidłowe, nie są pokryte samym prostopadłościanem. |
| `VII–VIII.XII` | Wprowadzenie do kombinatoryki i rachunku prawdopodobieństwa | 1–2 | `probability`; wybrano pkt 2. Zliczanie obiektów z pkt 1 bez osobnego wpisu. |
| `VII–VIII.XIII` | Odczytywanie danych i elementy statystyki opisowej | 1–3 | `statistics`; wybrano pkt 3. Odczytywanie i tworzenie diagramów/wykresów bez osobnych wpisów. |
| `VII–VIII.XIV` | Długość okręgu i pole koła | 1–4 | `geometry`; wpisano wszystkie cztery wymagania. Audyt wykazał brak zadań z tego działu w pilocie. |
| `VII–VIII.XV` | Symetrie | 1–4 | `geometry` wyłącznie jako związek tematyczny; bez wpisów wymagań. Szczególna możliwość realizacji po E8, opisana w sekcji 2. |

Zliczenie numerowanych punktów głównego poziomu daje **98 dla IV–VI i 63 dla VII–VIII, łącznie 161**. Nie liczymy oddzielnie literowanych przykładów, zdań składowych ani wymagań ogólnych. Jest to liczba punktów **podstawy**, obejmująca również 4 punkty XV z możliwością realizacji po E8, a nie deklarowana liczba bezwarunkowych celów egzaminacyjnych. Z tych 161 punktów **36 ma osobne wpisy w katalogu, 125 ich nie ma**. Spośród 36 wpisów **23 mają powiązanie z zadaniem, 13 nie ma**. Nie jest to wskaźnik procentowego pokrycia kursu: powiązania opisują tylko konkretne, częściowe zastosowania.

## 4. Dokładne oznaczenia dla 16 umiejętności pilota

Wszystkie cytaty w `verifiedRequirements` odczytano z [tekstu podstawy, s. 184–193](https://cke.gov.pl/images/_EGZAMIN_OSMOKLASISTY/2024/komunikaty/D20240996.pdf#page=184). Zachowano istotne warunki, m.in. mianowniki jedno-/dwucyfrowe, limit cyfr w rachunkach dziesiętnych, dodatnie wykładniki i wyłączenie odwrotnego twierdzenia Pitagorasa. Normalizacja obejmuje odstępy, podziały wierszy i końcową interpunkcję; nie zmienia zakresu wymagań. Pole `excerpt` nie jest autorskim opisem zadania.

| `SkillId` | Dokładne referencje wpisane do danych |
| --- | --- |
| `fractions` | `IV–VI.IV.3`, `IV–VI.IV.4`, `IV–VI.IV.12`, `IV–VI.V.1`, `IV–VI.V.4` |
| `decimals` | `IV–VI.V.2` |
| `integers` | `IV–VI.III.5` |
| `powers` | `VII–VIII.I.1`, `VII–VIII.I.2`, `VII–VIII.I.4` |
| `roots` | `VII–VIII.II.1`, `VII–VIII.II.4` |
| `percent` | `VII–VIII.V.2`, `VII–VIII.V.5` |
| `expressions` | `VII–VIII.III.2`, `VII–VIII.IV.2` |
| `equations` | `VII–VIII.VI.2` |
| `proportions` | `VII–VIII.VII.2`, `VII–VIII.VII.3` |
| `geometry` | `IV–VI.IX.5`, `IV–VI.IX.6`, `IV–VI.XI.3`, `VII–VIII.VIII.7`, `VII–VIII.XIV.1`, `VII–VIII.XIV.2`, `VII–VIII.XIV.3`, `VII–VIII.XIV.4` |
| `solids` | `IV–VI.XI.6` |
| `coordinates` | `VII–VIII.X.2` |
| `statistics` | `VII–VIII.XIII.3` |
| `probability` | `VII–VIII.XII.2` |
| `units` | `IV–VI.XII.6`, `IV–VI.XII.7`, `IV–VI.XI.7` |
| `word-problems` | `IV–VI.XIV.5`, `VII–VIII.VI.4` |

To przypisanie kategorii do potwierdzonych wymagań; **osobna matryca per zadanie znajduje się w sekcji 6 i `pilot-coverage.ts`**. Jeden wpis katalogu ma jeden `skillId`, mimo że wymaganie może łączyć kilka umiejętności (np. `IV–VI.IV.12` obejmuje również ułamki dziesiętne, a `VII–VIII.VI.4` także równania i procenty). Nie należy powielać go w statystykach jako kilku różnych wymagań. Referencja zadania może należeć do innej kategorii niż jego główny `skillId`, np. przepis wymaga również zamiany jednostek masy.

Dodatkowe sprawdzenie numeracji w [informatorze CKE](https://cke.gov.pl/images/_EGZAMIN_OSMOKLASISTY/Informatory/2025/standard/Informator_E8_matematyka_2025_P1.pdf): zad. 3, s. 11 → `IV–VI.IV.12`; zad. 13, s. 21 → `VII–VIII.I.1`; zad. 12, s. 20 → `VII–VIII.IV.2`; zad. 8, s. 16 → `VII–VIII.XII.2`; zad. 27, s. 40 → `IV–VI.XI.3`. Nie wszystkie 36 wpisów mają takie drugie potwierdzenie w przykładach — źródłem ich treści pozostaje akt prawny.

### Cztery punkty uzupełnione po odczytaniu zadań

Ponownie sprawdzono zachowany odczyt oficjalnej kopii podstawy: [s. 188 — jednostki](https://cke.gov.pl/images/_EGZAMIN_OSMOKLASISTY/2024/komunikaty/D20240996.pdf#page=188), [s. 189 — potęgi](https://cke.gov.pl/images/_EGZAMIN_OSMOKLASISTY/2024/komunikaty/D20240996.pdf#page=189) oraz [s. 191 — proporcjonalność](https://cke.gov.pl/images/_EGZAMIN_OSMOKLASISTY/2024/komunikaty/D20240996.pdf#page=191).

| Dodana referencja | Treść źródłowa (typografia znormalizowana) | Zadanie wymagające uzupełnienia |
| --- | --- | --- |
| `VII–VIII.I.4` | „podnosi potęgę do potęgi” | `diagnoza-a-potegi` |
| `VII–VIII.VII.3` | „stosuje podział proporcjonalny” | `ogrod-nasiona` |
| `IV–VI.XII.7` | „zamienia i prawidłowo stosuje jednostki masy: gram, dekagram, kilogram, tona” | `podsumowanie-przepis` |
| `IV–VI.XI.7` | „stosuje jednostki objętości i pojemności: cm³, dm³, m³, mililitr, litr” | `podsumowanie-pojemnosc` |

**Korekta numeracji:** potęga potęgi to `VII–VIII.I.4`, a nie `.I.3`. Punkt `.I.3` brzmi „mnoży potęgi o różnych podstawach i jednakowych wykładnikach” i nie opisuje działania `(2³)²`. Litry i mililitry należą do **XI.7**, nie XII.7 (masa). Zamiana l/ml jest zastosowaniem jednostek z XI.7; cytat nie zawiera osobnego dosłownego polecenia „zamienia litry na mililitry”. Nie dopisano takiego zdania do treści źródłowej.

## 5. Ograniczenia treści i formy egzaminu

### Granice zapisane w podstawie

Poniższe ograniczenia odczytano z [Dz.U. 2024 poz. 996, s. 185–193](https://cke.gov.pl/images/_EGZAMIN_OSMOKLASISTY/2024/komunikaty/D20240996.pdf#page=185):

- **Ułamki:** `IV–VI.V.1` wskazuje mianowniki jedno- lub dwucyfrowe i liczby mieszane. `IV–VI.V.2` ogranicza pisemne rachunki do ułamków mających razem co najwyżej 6 cyfr różnych od zera. `IV–VI.V.7` określa trudność wyrażenia przez przykład; nie przepisano go do danych, ponieważ ekstrakcja PDF zniekształca zapis ułamków.
- **Jednostki pola:** `IV–VI.XI.4` wymienia jednostki z dopiskiem „bez zamiany jednostek w trakcie obliczeń”, a `IV–VI.XI.3` mówi także o danych wymagających zamiany jednostek. Zachowujemy oba zapisy; nie zamieniamy ich w ogólny zakaz jakichkolwiek zamian jednostek na E8.
- **Potęgi:** `VII–VIII.I.1–2` dotyczą wykładników całkowitych dodatnich, natomiast w notacji wykładniczej z `VII–VIII.I.5` wykładnik jest całkowity. Nie rozszerzamy tego na dowolne działania na potęgach o wykładnikach rzeczywistych.
- **Równania:** w `VII–VIII.VI.1` można sprawdzać, czy liczba rozwiązuje równanie stopnia 1, 2 lub 3. To nie jest wymaganie ogólnego rozwiązywania równań kwadratowych i sześciennych. Punkty 2–4 dotyczą liniowych lub sprowadzalnych do liniowych.
- **Pitagoras:** `VII–VIII.VIII.7` wyraźnie mówi „bez twierdzenia odwrotnego”.
- **Dowody, wielokąty i bryły:** `VII–VIII.VIII.8`, `VII–VIII.IX.2`, `VII–VIII.XI.2–3` mają ograniczenie trudności przez wskazane przykłady. Nie zamieniono tych przykładów w kompletną listę dozwolonych typów zadań. `IV–VI.X.1` wymaga rozpoznawania walca, stożka i kuli; nie uzasadnia to dopisania wzorów na ich pola i objętości jako wymagań E8.
- **Kombinatoryka:** `VII–VIII.XII.1` dotyczy przypadków niewymagających reguł mnożenia i dodawania. W odczytanej podstawie VII–VIII jest 15 działów, nie ma dodatkowego działu XVI ze starszych zestawień.

### Rachunki, reprezentacje i argumentacja

[Podstawa, s. 182–183](https://cke.gov.pl/images/_EGZAMIN_OSMOKLASISTY/2024/komunikaty/D20240996.pdf#page=182), oraz [informator, s. 5–6](https://cke.gov.pl/images/_EGZAMIN_OSMOKLASISTY/Informatory/2025/standard/Informator_E8_matematyka_2025_P1.pdf#page=5) wymagają nie tylko rachunków, lecz także tworzenia i interpretowania informacji/reprezentacji oraz rozumowania i argumentacji. Zadanie otwarte powinno ujawniać tok rozumowania, rachunki, przekształcenia lub wnioski; część zadań wymaga uzasadnienia. Same końcowe odpowiedzi liczbowe i trafienia w testach wyboru nie dowodzą opanowania tych wymagań. Wymagania ogólne nie mają w tej wersji osobnej mapy danych ani audytu pokrycia.

### Przybory i sposób pracy w 2027 r.

[Komunikat dyrektora CKE o materiałach i przyborach w 2027 r.](https://cke.gov.pl/images/_EGZAMIN_OSMOKLASISTY/2026_2027/komunikaty/20260820_E8_EM_Komunikat_o_przyborach_2027_fin.pdf), **20 sierpnia 2026 r.**, część „Egzamin ósmoklasisty”, s. 2–3, wskazuje czarny długopis/pióro i linijkę; rysunki wykonuje się długopisem, nie ołówkiem. Nie wolno używać długopisów zmazywalnych. Nie przewiduje standardowo cyrkla, kątomierza ani tablic wzorów. W tym samym dokumencie jest osobna tabela dla matury — nie należy przenosić jej przyborów na E8.

[Informacja organizacyjna CKE 2027, pkt 4.4.2 i 10.1.1.6, s. 29 i 67](https://cke.gov.pl/images/_EGZAMIN_OSMOKLASISTY/2026_2027/komunikaty/20260820_E8_2027_Informacja_COMPL_fin.pdf#page=29) potwierdza brak kalkulatora w standardowych warunkach. Komunikat o przyborach, s. 3, dopuszcza kalkulator prosty jako dostosowanie dla ucznia z opinią PPP o dyskalkulii, przy spełnieniu opisanych tam warunków: wyraźne wskazanie dostosowania w opinii i udokumentowane korzystanie z niego w toku nauki. Nie jest to automatyczne uprawnienie każdego ucznia z trudnościami matematycznymi. Nie zbadano wszystkich indywidualnych dostosowań ani odrębnych informatorów dla arkuszy dostosowanych.

Szkolne zapisy o kalkulatorze, kątomierzu czy konstrukcjach nie oznaczają dopuszczenia tych narzędzi na standardowym egzaminie ani usunięcia całych odpowiadających im działów z nauczania.

Pomocniczo: informacja CKE, pkt 2.8, s. 13, podaje **125 minut** dla matematyki; informator, s. 6, opisuje **20–21 zadań i 30 punktów**. Czas ma osobne zasady dostosowań. Informacja 2027, pkt 2.10–11, wymaga przeniesienia odpowiedzi zamkniętych w czasie egzaminu i zapisywania rozwiązań otwartych w karcie rozwiązań, jeżeli jest częścią arkusza. Te parametry nie służą do ustalania zakresu treści.

## 6. Rzeczywisty audyt 34 zadań i matryca wymagań

Przeczytano całe `src/content/pilot.ts` oraz cztery zadania `puzzles` z `src/content/adventure.ts`, które `pilot.ts` włącza do prologu. Razem: diagnoza A — 6, diagnoza B — 6, prolog — 4, lustra — 4, powrót 1 — 3, ogród — 4, powrót 2 — 3, podsumowanie — 4. Zachowano rzeczywiste identyfikatory prologu (`mapa`, `latarnie`, `sklepik`, `bilet`), bez wymyślania prefiksu.

Przy doborze referencji zestawiono **polecenie i ewentualny podany wzór, podpowiedzi, rozwiązanie oraz rubrykę** z treścią źródłową wymagania. Każdy wpis oznacza **częściowe ćwiczenie** konkretnej czynności. Nie oznacza, że każda poprawna metoda wykorzystuje tę samą technikę, że uczeń wykonał ją samodzielnie ani że opanował wszystkie warianty punktu. Lista jest celowo ograniczona do głównych czynności, bez dodawania każdego ubocznego rachunku.

`IV–VI.XIV.5` przypisano tylko do zastosowań arytmetyki w rzeczywistym lub modelowanym kontekście praktycznym (zakupy, ilości, droga, temperatura itp.), również gdy zadanie ma `kind: 'transfer'`. Samo tekstowe polecenie „oblicz”, fabularny tytuł lub prośba o zapis w zeszycie nie wystarczają. W prologu `mapa` i `latarnie` mają podane wzory: ćwiczą zastosowanie w kontekście, ale nie dowodzą samodzielnego zbudowania modelu. Nie przypisano `VII–VIII.VI.4` do żadnego zadania: żadne nie wymaga utworzenia równania z opisu sytuacji.

### Matryca odpowiadająca `taskRequirements`

| ID zadania | Referencje | Rzeczywiście ćwiczony fragment / ograniczenie |
| --- | --- | --- |
| `diagnoza-a-ulamki` | `IV–VI.IV.3`, `IV–VI.IV.4`, `IV–VI.V.1` | Rozszerzenie do wspólnego mianownika i różnica 7/10 − 1/4; nie wszystkie działania na ułamkach. |
| `diagnoza-a-liczby` | `IV–VI.III.5` | Rachunek −6 + 4 · 3 z poprawną kolejnością; bez osi i wartości bezwzględnej. |
| `diagnoza-a-potegi` | `VII–VIII.I.4`, `VII–VIII.I.2` | Potęga potęgi i iloraz potęg; rozwiązanie dopuszcza obliczenie 64 : 16 bez zastosowania praw wykładników. |
| `diagnoza-a-pierwiastki` | `VII–VIII.II.1` | Dwa pierwiastki kwadratowe z pełnych kwadratów; bez sześciennych i wyłączania czynnika. |
| `diagnoza-a-procenty` | `VII–VIII.V.2`, `VII–VIII.V.5`, `IV–VI.XIV.5` | Procent ceny i jedna obniżka 160 zł o 15%; nie kolejne zmiany. |
| `diagnoza-a-rownanie` | `VII–VIII.VI.2` | Rozwiązanie podanego równania liniowego z niewiadomą po obu stronach; bez budowania równania z tekstu. |
| `diagnoza-b-pole` | `IV–VI.XI.3` | Pole jednego trapezu na podstawie słownego opisu podstaw i wysokości; brak rysunku, zamiany jednostek i pozostałych figur. |
| `diagnoza-b-bryla` | `IV–VI.XI.6` | Objętość prostopadłościanu 5 × 4 × 3; nie pole powierzchni ani ogólne graniastosłupy. |
| `diagnoza-b-srednia` | `VII–VIII.XIII.3` | Średnia czterech podanych liczb; bez interpretacji wykresu czy zbierania danych. |
| `diagnoza-b-losowanie` | `VII–VIII.XII.2` | Analiza opisanego pojedynczego losowania kulek i P = 3/10; nie przeprowadzanie fizycznego doświadczenia. |
| `diagnoza-b-proporcja` | `VII–VIII.VII.2`, `IV–VI.XIV.5` | Skalowanie ceny 4 → 6 zeszytów, np. przez cenę jednostkową. |
| `diagnoza-b-wyrazenie` | `VII–VIII.III.2`, `IV–VI.III.5` | Podstawienie a = −2 i rachunki ze znakami; redukcja do 5a − 8 jest tylko opcjonalną metodą. |
| `mapa` | `IV–VI.V.1`, `IV–VI.XIV.5` | Dodanie części tej samej całości, przy równych mianownikach i podanym działaniu. Skrócenie 4/8 jest opcjonalne; bez współrzędnych. |
| `latarnie` | `IV–VI.V.4`, `IV–VI.XIV.5` | 3/4 z 24 obiektów; model działania jest podany. |
| `sklepik` | `IV–VI.V.2`, `IV–VI.XIV.5` | Koszty dwóch rodzajów zakupów i reszta z 25 zł; działania dziesiętne. |
| `bilet` | `IV–VI.IV.3`, `IV–VI.IV.4`, `IV–VI.V.1` | Rozszerzenie 1/4 do 3/12 i dodanie do 5/12; kontekst praktyczny nie jest częścią polecenia. |
| `lustra-zaslony` | `IV–VI.IV.3`, `IV–VI.IV.4`, `IV–VI.V.1`, `IV–VI.XIV.5` | Wspólny mianownik i odjęcie dwóch zużytych części tkaniny od całości. |
| `lustra-winda` | `IV–VI.III.5`, `IV–VI.XIV.5` | Przełożenie ruchu windy na −4 + 9 − 3; bez rysowania osi. |
| `lustra-wstazka` | `IV–VI.V.2`, `IV–VI.XIV.5` | 2,4 − 3 · 0,65; wszystkie długości są już w metrach, brak zamiany jednostek. |
| `lustra-roznica` | `IV–VI.IV.3`, `IV–VI.IV.4`, `IV–VI.V.1` | Rozszerzenie i odejmowanie 5/6 − 3/10. Skracanie wyniku występuje w rozwiązaniu, lecz nie jest wymagane w rubryce. |
| `powrot-1-suma` | `IV–VI.IV.3`, `IV–VI.IV.4`, `IV–VI.V.1` | Rozszerzenie i dodawanie 7/15 + 1/6. |
| `powrot-1-biblioteka` | `IV–VI.V.4`, `IV–VI.XIV.5` | 4/7 z 35 i odjęcie trzech zwróconych książek. |
| `powrot-1-zakupy` | `IV–VI.V.2`, `IV–VI.XIV.5` | Koszt notesów i ołówków, suma i reszta z 20 zł. |
| `ogrod-nasiona` | `VII–VIII.VII.3`, `IV–VI.XIV.5` | Podział całej liczby 30 w stosunku 2:3; nie zastąpiono go ogólnym skalowaniem z VII.2. |
| `ogrod-woda` | `VII–VIII.V.2`, `VII–VIII.V.5`, `IV–VI.XIV.5` | Odjęcie 25% początkowych 80 l i dodanie 6 l; bez zmiany jednostek i bez drugiej zmiany procentowej. |
| `ogrod-droga` | `IV–VI.XII.6`, `IV–VI.XIV.5` | 0,75 km → 750 m i dodanie 180 m; bez skali mapy i prędkości. |
| `ogrod-temperatura` | `IV–VI.III.5`, `IV–VI.XIV.5` | Rachunek zmian −7 + 12 − 8; nie odczyt wskazania z rysunku termometru. |
| `powrot-2-czesci` | `IV–VI.IV.3`, `IV–VI.IV.4`, `IV–VI.V.1` | Wspólny mianownik i dwa odejmowania 9/10 − 1/4 − 1/3. |
| `powrot-2-znaki` | `IV–VI.III.5` | Odejmowanie liczby ujemnej w −14 − (−6) + 11. |
| `powrot-2-masa` | `IV–VI.V.2`, `IV–VI.XIV.5` | 1,8 − 4 · 0,275 w kg; brak zamiany masy, więc nie przypisano XII.7. |
| `podsumowanie-zbiornik` | `IV–VI.V.4`, `IV–VI.XIV.5` | Obliczenie 2/5 i 1/4 tej samej pojemności 40 l i dodanie wyników; nie wymaga dodawania samych ułamków. |
| `podsumowanie-obnizki` | `VII–VIII.V.2`, `VII–VIII.V.5`, `IV–VI.XIV.5` | Dwie kolejne obniżki, 20% i 10%, z drugą liczoną od zmienionej ceny. |
| `podsumowanie-przepis` | `VII–VIII.VII.2`, `IV–VI.XII.7`, `IV–VI.XIV.5` | Skalowanie 12 → 18 placuszków i zamiana 450 g → 0,45 kg. |
| `podsumowanie-pojemnosc` | `IV–VI.XI.7`, `IV–VI.XIV.5` | 1,2 l → 1200 ml i odjęcie dwóch nalanych porcji; nie pozostałe jednostki sześcienne. |

**Trapez:** opis podstaw i wysokości pozwala ćwiczyć fragment `IV–VI.XI.3`, mimo braku rysunku. Nie uznano go za pełną realizację wymagań dotyczących wszystkich figur, ich przedstawień i zamian jednostek. Samo to geometryczne polecenie nie opisuje zastosowania praktycznego, dlatego nie otrzymało dodatkowo `IV–VI.XIV.5`.

**Rozszerzanie a skracanie:** `IV–VI.IV.3` w zadaniach o różnych mianownikach oznacza rozszerzanie w metodzie wskazanej przez podpowiedzi, rozwiązanie i rubrykę. Nie dowodzi obowiązkowego skracania odpowiedzi. Dla `mapa` mianowniki od początku są równe, a skracanie jest opcjonalne, dlatego nie dodano tam tego punktu. Sama odpowiedź w aplikacji nie rozstrzyga, czy uczeń rzeczywiście wybrał wspólny mianownik; wymaga to wglądu do zeszytu.

### Konkretne luki stwierdzone w pilocie

**13 potwierdzonych punktów katalogu bez powiązania z zadaniem:**

- `IV–VI.IV.12` — brak zadania wymagającego porównania ułamków.
- `VII–VIII.I.1` — brak polecenia zapisania iloczynu jednakowych czynników jako potęgi; samo obliczenie danej potęgi nie realizuje tego kierunku zapisu.
- `VII–VIII.II.4` — brak iloczynów/ilorazów pod pierwiastkiem i wyłączania/włączania czynnika.
- `VII–VIII.IV.2` — brak zadania wymagającego dodawania i odejmowania sum algebraicznych. Opcjonalna redukcja w `diagnoza-b-wyrazenie` nie daje podstaw do oznaczenia tego punktu jako sprawdzanego.
- `IV–VI.IX.5`, `IV–VI.IX.6` — brak zadań sprawdzających własności czworokątów/osie symetrii oraz wskazywanie cięciwy, średnicy i promienia. Sam wzór na pole trapezu nie dowodzi tych umiejętności.
- `VII–VIII.VIII.7` — brak twierdzenia Pitagorasa.
- `VII–VIII.XIV.1`, `VII–VIII.XIV.2`, `VII–VIII.XIV.3`, `VII–VIII.XIV.4` — brak długości okręgu, pola koła i zadań odwrotnych.
- `VII–VIII.X.2` — brak odczytu współrzędnych; zadanie `mapa` dotyczy ułamków.
- `VII–VIII.VI.4` — brak zadania wymagającego równania utworzonego z treści; jedyne równanie jest już podane.

Ponadto nawet **23 punkty z powiązaniami są ćwiczone fragmentarycznie**: dominują dodawanie/odejmowanie ułamków i ułamek liczby; brak samodzielnych zadań na dzielenie dwóch ułamków i liczby mieszane. Jedno pole trapezu nie pokrywa pozostałych figur; objętość pudełka nie pokrywa pola powierzchni ani ostrosłupów. Jedna średnia nie ćwiczy wykresów, a pojedyncze losowanie nie sprawdza wszystkich doświadczeń losowych. Zmiana km/m, g/kg i l/ml nie obejmuje pełnych list jednostek. Zadanie z potęgami można rozwiązać bez praw działań na wykładnikach, a pierwiastki dotyczą tylko dwóch kwadratów liczb naturalnych.

Wśród dalszych braków są zadania na zapis rzymski, podzielność/NWD/NWW jako samodzielny cel, notację wykładniczą, odczytywanie i tworzenie diagramów, przystawanie, dowody geometryczne, układ współrzędnych, skale, zegar/kalendarz i droga–prędkość–czas. Nie oznacza to nieobecności prostych rachunków naturalnych czy planowania etapów: takie czynności występują wewnątrz istniejących zadań, ale nie odwzorowano wszystkich ich wymagań. „Lustra” i „dwa odbicia” to motywy fabularne, nie ćwiczenia symetrii; dział XV zachowuje szczególny status opisany w sekcji 2.

Rubryki wymagają zapisu metody i dają okazję do rozmowy o rozwiązaniu. Są to jednak **2 punkty robocze, nie skala CKE**. Wpis w matrycy nie dowodzi jakości uzasadnienia, pracy bez podpowiedzi, retencji ani transferu. Nie ma w pilocie polecenia wymagającego samodzielnego dowodu porównywalnego z dowodami geometrycznymi podstawy. Nie przeprowadzono badania odpowiedzi uczniów.

## 7. Stan weryfikacji i kontrola spójności

**Zweryfikowano:** wskazanie podstawy 2024 dla E8 2027 w dokumencie CKE; daty aktu i jego ogłoszenia; 29 działów i ich numerację; treść i referencje **36** punktów; szczególny zapis o XV; koła i wcześniejsze wymagania o symetrii; opisane ograniczenia treści i przyborów. Przeczytano i zmapowano **34/34 zadania** na podstawie treści, nie głównego `skillId`.

**Metoda źródłowa:** przed odczytem PDF zastosowano instrukcje skilla `pdf`. Tekst oficjalnych PDF CKE odczytano przez `https://r.jina.ai/<oficjalny-url>`; przy uzupełnieniu mapy ponownie sprawdzono odpowiednie fragmenty zachowanego odczytu tego samego aktu. Pośrednik jest narzędziem ekstrakcji, nie źródłem normatywnym. Daty pochodzą z treści dokumentów i rekordu Dziennika Ustaw. Nie przeprowadzono wizualnej kontroli każdego wzoru, rysunku i przykładu; zniekształconych wzorów nie odtwarzano z pamięci.

**Kontrola danych:** zbiór kluczy `taskRequirements` musi być dokładnie równy zbiorowi 34 ID z `pilotSessions.flatMap(session => session.tasks)`, łącznie z importowanym prologiem. Każda lista jest niepusta, nie zawiera duplikatów i używa wyłącznie referencji z `verifiedRequirements`. Wynik kontroli: **0 brakujących ID, 0 nadmiarowych ID, 0 nieznanych referencji; 36 punktów w katalogu, 23 z powiązaniami, 13 bez powiązań**. Dokument zawiera te same referencje w 34 wierszach matrycy. Sprawdzono TypeScript bez emisji plików.

**Granice:** nie wykonano pełnego odwzorowania wszystkich 161 punktów, wszystkich metod alternatywnych ani ubocznych rachunków. Nie audytowano interfejsu, automatycznego oceniania metod ani wyników uczniów, wszystkich arkuszy dostosowanych ani zmian źródeł po dacie badania. Przypisanie zadania do fragmentu wymagania nie jest pełnym pokryciem punktu. Przy kolejnej zmianie treści pilota trzeba ponowić audyt per zadanie, a nie tylko dopisać jego główny `skillId`.

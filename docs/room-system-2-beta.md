# THE CATROOMS v1.8 Beta · Room System 2.0

Szablony pokoi i biblioteki sektorów znajdują się w `js/maps/room-templates.js`. Generator tworzy instancje pokoi, łączy je i zapisuje graf połączeń. Kampania, HARD, tryb proceduralny, Custom i Boss Rush używają tego samego generatora. Walidator sprawdza graf oraz osiągalność celów i wyjścia z uwzględnieniem wymagań bram i kolejności reaktorów.

Warianty pomieszczeń obejmują obrys, wymiary, wysokość sufitu, stan powierzchni, natężenie i barwę lamp. Lampy w pomieszczeniach technicznych reagują na główne zasilanie i aktywną awarię. Presety pomieszczeń różnicują głośność tła i zasięg hałasu. Wybrane skrzynie i beczki można przesunąć klawiszem E, a przedmioty na skrzyniach przesuwają się wraz z nimi.

Flooded Complex i Bloody Zone mają piętra techniczne w kampanii i HARD. Przejście działa w obie strony za pomocą schodów. Piętro techniczne i sekret to osobne przestrzenie połączone z główną mapą. Schody przełączają przestrzeń w obrębie mapy, więc prawdziwe antresole, piętra nałożone w jednej bryle, dowolnie nachylone powierzchnie i pełna fizyka obiektów pozostają poza zakresem bety.

## Assety do kolejnego etapu

- **Wyposażenie `.glb`**. Zestawy biurowe i serwerowe, sanitarne, mieszkalne, sklepowe, szpitalne i stacji metra. W technicznych pomieszczeniach przydadzą się zawory, manometry, złączki i przewody.
- **Moduły `.glb`**. Okna, przeszklenia, drzwi przemysłowe i przesuwne, rampy, schody, platformy, balustrady, szyby wind i wentylacja.
- **Modele z ruchomymi częściami `.glb`**. Szuflady, szafki, wentylatory, pompy, przenośniki, windy i maszyny. Najłatwiej podłączyć osobne węzły dla ruchomych części albo gotowe klipy animacji.
- **Materiały i kalkomanie `.png` lub `.webp`**. Warianty powierzchni, ślady butów i racic, pęknięcia, szkło, rysy, zacieki, oznaczenia, numery pokoi i drobne rekwizyty. Do materiałów PBR przydadzą się Base Color, Normal i Roughness.
- **Nagrania `.wav`, `.ogg` lub `.mp3`**. Pętle wentylacji, transformatorów, serwerów, maszyn i odgłosy awarii oraz zdarzeń w pokojach.

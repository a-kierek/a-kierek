# THE CATROOMS · HARD CAMPAIGN

## Start

Otwórz `index.html` w przeglądarce obsługującej WebGPU (najlepiej przez GitHub Pages/HTTPS), lub samodzielny HTML. Wybierz **HARD**, a następnie uruchom etap 1. Etapy 2–4 odblokowujesz przez ukończenie poprzednich etapów HARD, osobno od NORMAL.

## Poziomy HARD

- HARD 1: 65×65, 8 baterii, **2 Marmury** (czerwony + zielony champion), 26 skał.
- HARD 2: 73×73, 9 kart, 2 panele, Błysk i Szept oraz dwa różowe warianty Błyska, 34 skały.
- HARD 3: 81×81, 10 rdzeni, 3 panele, Marmur, Błysk i Szept (championy), 41 skał.
- HARD 4: 89×89, 9 puszek karmy, 3 dźwignie, championy CHRUM i podzielony różowy CHRUM, 50 skał.

Każdy HARD losuje spójną mapę na podstawie seeda. Skały są przeszkodami dla ruchu i trasowania AI, a wymagane cele pozostają osiągalne.

## Champions

- czerwony: szybki, ulepszone AI; zielony: pozostawia toksyczne ślady, ulepszone AI; żółty: co 30–90 s (przy kontakcie wzrokowym) spowalnia wyłącznie gracza; szary: widzi przez ściany, jest wolniejszy i ma ulepszone AI; klasyczny: ulepszone AI; różowy: dwie mniejsze niezależne postacie z 0.85× prędkości, bez ulepszonego AI.

## Awaria reaktora

Na etapach HARD pojawia się alarm: masz **45 sekund**, by znaleźć czerwono zaznaczony panel i nacisnąć `E`. Panel jest w osiągalnej części mapy w rozsądnej odległości. Jeśli licznik osiągnie zero, kończysz rundę przegraną. Podczas alarmu działa heartbeat MP3.

## Ekwipunek

Podnieś przedmiot, a potem kliknij jego przycisk w HUD (również na telefonie). Skróty klawiszowe: **1 napój, 2 spowalniacz, 3 zamrażacz**. Pozostawiono również Z/X jako alternatywne skróty dla urządzeń. W każdej mapie z napojami jeden egzemplarz jest fałszywy i spowalnia przez 15 sekund **dopiero po wypiciu**. Zamrażacz unieruchamia widocznego potwora na stałe, ale jego dotknięcie pozostaje śmiertelne.

## Dźwięki

`assets/audio/hard/heartbeat.mp3` (odgłos serca podczas wykrycia/awarii) i `assets/audio/hard/pig-squeal-horror.mp3` (CHRUM w pościgu). Głośność reguluje się przez ustawienia efektów.

## Ograniczenia

Gra wymaga prawdziwego WebGPU. Testy automatyczne obejmują WebGPU ze **symulowanym** urządzeniem, nie natywną kompilację shaderów na GPU. Logikę należy jeszcze sprawdzić w docelowej przeglądarce i przy długiej sesji. Kod CO-OP pozostaje w projekcie, ale jest wyłączony z menu.

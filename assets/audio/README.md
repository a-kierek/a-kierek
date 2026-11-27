# Dźwięki THE CATROOMS

Próbki audio dostarczone przez użytkownika. Działają w przeglądarce również po otwarciu `index.html` bez serwera.

| Plik w projekcie | Oryginalny plik | Wykorzystanie |
|---|---|---|
| `battery-charge.wav` | `battery charge.wav` | **Każde** podniesienie przedmiotu: baterie, karty, rdzenie, karma, klucze i bonusy |
| `roblox-walking.mp3` | `roblox-walking.mp3` | Zapętlone kroki gracza, regulowana głośność i tempo biegu/skradania |
| `pig-oink.mp3` | `freesound_community-pig-oink-47167.mp3` | CHRUM podczas patrolu |
| `pig-grunt.mp3` | `freesound_community-pig-grunt-100272.mp3` | CHRUM podczas patrolu |
| `pig-squeal.mp3` | `universfield-pig-squeal-horror-229155.mp3` | CHRUM podczas pościgu |
| `angry-beast.mp3` | `freesound_community-angry-beast-6172.mp3` | Kot i świnia podczas rozpoczęcia pościgu; świnia ma obniżoną tonację (0.73×), kot podwyższoną (1.16×) |
| `angry-cat.mp3` | `freesound_community-angry-cat-41822.mp3` | Kot na patrolu |
| `very-angry-cat.mp3` | `freesound_community-very-angry-cat-101289.mp3` | Kot podczas pościgu |

**Głośność**: im bliżej gracza znajduje się źródło dźwięku, tym głośniejszy odgłos. Gdy postać się porusza, głośność już rozpoczętych sampli aktualizuje się na bieżąco. Ściany dodatkowo tłumią dźwięk. Dźwięk zanika po oddaleniu się od źródła na ok. 14–22 jednostki mapy (zależnie od zdarzenia).

Ustawienia, odstępy, głośność i tonacje: `../../js/audio/sound.js`. Jeżeli zamienisz plik MP3/WAV, zachowaj nazwę. Przed udostępnieniem gry publicznie sprawdź zasady licencyjne wszystkich sampli.


## Added voices and jumpscare sample

`voices/`: Szept (jadymy na Imielin, nie lubię Imielina, vamos Polska) and Błysk (oni gadają, kurwy, pijany). These are played at intervals, with distance attenuation.

`jumpscares/appear-scream-original.wav` retains the user recording.
`jumpscares/appear-scream-loud.wav` is an amplified (+10 dB, peak approx -3 dBFS) loss-only version. The amplitude change is applied to the file itself, because `HTMLAudioElement.volume` cannot exceed 1.

## Pliki do zastąpienia syntezy JS

Umieść poniższe pliki w `assets/audio/replacements/` z podanymi nazwami, a następnie uruchom `python tools/build_standalone.py` z katalogu projektu. Polecenie aktualizuje zarówno `js/game.bundle.js` dla strony, jak i samodzielny plik HTML. Możesz dodawać pliki pojedynczo. Każdy brakujący sygnał pozostaje cichy.

| Plik MP3 | Kiedy gra |
|---|---|
| `unlock.mp3` | Otwarcie, odblokowanie przejścia, aktywacja panelu lub naprawa reaktora |
| `warning.mp3` | Obudzenie kota, tryb Rage, fałszywy energetyk i alarm awarii w HARD |
| `round-start.mp3` | Start rundy |
| `reactor-wrong-order.mp3` | Reaktory aktywowane w złej kolejności w Bloody Zone |
| `win.mp3` | Zwycięstwo lub ukończenie aktywacji reaktorów |
| `door-locked.mp3` | Próba otwarcia drzwi, gdy brakuje wymaganego przedmiotu lub warunku |
| `event-siren.mp3` | Losowe wydarzenie ALARM SIRENS w Bloody Zone |
| `event-blackout.mp3` | Losowy zanik zasilania w Bloody Zone |
| `yellow-pulse.mp3` | Impuls spowalniający żółtego przeciwnika w HARD |
| `slot-no-prize.mp3` | Przegrana w automacie |
| `hum-default.mp3` | Domyślne zapętlone buczenie tła |
| `hum-flooded.mp3` | Zapętlone buczenie tła w drugim poziomie kampanii NORMAL |
| `hum-bloody.mp3` | Zapętlone buczenie tła w trzecim poziomie kampanii NORMAL |

Podniesienie przedmiotu, obrażenia i jumpscare nadal używają istniejących nagrań. Szum tworzony w pamięci był nieużywany.

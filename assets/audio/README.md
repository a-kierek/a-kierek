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

**Błysk i Szept** nie mają przypisanych odgłosów. **Nie dodano żadnych nowych dźwięków jumpscare**. Zachowano dotychczasowe efekty syntetyczne gry (drzwi, zwycięstwo, wydarzenia).

Ustawienia, odstępy, głośność i tonacje: `../../js/audio/sound.js`. Jeżeli zamienisz plik MP3/WAV, zachowaj nazwę. Przed udostępnieniem gry publicznie sprawdź zasady licencyjne wszystkich sampli.


## Added voices and jumpscare sample

`voices/`: Szept (jadymy na Imielin, nie lubię Imielina, vamos Polska) and Błysk (oni gadają, kurwy, pijany). These are played at intervals, with distance attenuation.

`jumpscares/appear-scream-original.wav` retains the user recording.
`jumpscares/appear-scream-loud.wav` is an amplified (+10 dB, peak approx -3 dBFS) loss-only version. The amplitude change is applied to the file itself, because `HTMLAudioElement.volume` cannot exceed 1.

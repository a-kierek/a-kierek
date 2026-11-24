THE CATROOMS – MAKABRYCZNE UI

Nowa warstwa interfejsu inspirowana zniszczonym archiwum monitoringu:
- silniejsze plamy krwi i ślady dłoni, tłuste plamy, rdza, rysy i sadza,
- ruchome zakłócenia CRT, ziarnistość i przyciemniona winieta,
- metaliczna, szablonowa typografia i uszkodzone etykiety,
- HUD: HP + stamina góra-lewo, zadanie góra-prawo,
  ekwipunek/zebrane przedmioty dół-lewo, interakcja dół-prawo,
- dodatkowe zabrudzenia tłuszczem w sektorze CHRUM.

Nowe pliki:
  css/macabre-ui.css
  js/ui/macabre-hud.js
  assets/ui/blood-ui.png
  assets/ui/handprints-ui.png
  assets/ui/grease-ui.png
  assets/ui/damage-ui.png

Nie dodawano fikcyjnej mechaniki poczytalności ani amunicji, których
obecna gra nie posiada. Nowe panele pokazują rzeczywiste HP, wytrzymałość,
zebrane przedmioty, wabiki i dostępne akcje.

Tryb CO-OP nadal jest wyłączony z menu, ale jego kod i serwer pozostają
w projekcie. Wszystkie dźwięki, mapy, WebGPU i fallback Canvas2D pozostały.

Testy automatyczne (Chromium 144, Canvas fallback):
- uruchomienie Level 1, 2, 3, 4 oraz proceduralnego: OK
- konsola F2: OK
- brak błędów JS w testowanych przebiegach: OK
- układ HUD przy 1366x768, 844x390, 390x844: OK
- natywne WebGPU: niezweryfikowane, brak adaptera w teście

Uruchomienie: otwórz index.html z projektem albo samodzielny plik HTML.

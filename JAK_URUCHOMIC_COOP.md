# THE CATROOMS • CO-OP (komputer hostuje, znajomi dołączają)

Wersja CO-OP: **1–4 graczy w jednym pokoju**, 1 komputer hosta z uruchomionym serwerem Node.js, wspólna mapa, przedmioty, panele, drzwi, zdrowie każdej postaci i współdzielone potwory. Gra jednoosobowa nadal działa bez serwera. CO-OP nie wymaga usług typu Firebase/Supabase.

## A. Najprościej: wszyscy na tej samej sieci Wi-Fi

1. Na komputerze hosta zainstaluj **Node.js** (https://nodejs.org/), wersja 18 lub nowsza.
2. Rozpakuj paczkę `THE_CATROOMS_COOP_PROJEKT.zip`. Otwórz folder `The_Catrooms_Expanded`.
3. Na Windows dwukrotnie kliknij `START_HOST_WINDOWS.bat`. Na macOS/Linux otwórz terminal w folderze i uruchom `node server/server.js` (ew. `./START_HOST_MAC_LINUX.sh`).
4. Na komputerze hosta otwórz **http://localhost:8765**.
5. Kliknij **CO-OP → HOSTUJ POKÓJ**, wybierz poziom i skopiuj sześci znaków kodu (np. `Q7KCM2`).
6. Na drugim urządzeniu w tej samej sieci Wi-Fi otwórz **http://IP-HOSTA:8765**. Adres IP hosta na Windows sprawdzisz poleceniem `ipconfig` (adres IPv4, np. `192.168.1.42`).
7. Drugi gracz wybiera **CO-OP → DOŁĄCZ KODEM**, wpisuje kod pokoju i czeka. Host klika **START CO-OP**.

Serwer słucha na porcie TCP **8765**. Jeżeli urządzenie nie może otworzyć strony, sprawdź, czy Windows Firewall zezwala Node.js na działanie w sieci prywatnej. Nie trzeba przekierowywać portów routera, gdy oba urządzenia są w tej samej sieci.

## B. Znajomi przez internet, z innych domów

GitHub Pages hostuje tylko **statyczny HTML/CSS/JS**. Nie uruchomi serwera Node.js. Dlatego komputer hosta musi pozostać włączony i udostępniać serwer przez bezpieczny adres **HTTPS/WSS**. Możesz to zrobić bez przekierowywania portów przez Cloudflare Tunnel.

1. Host uruchamia lokalny serwer poleceniem `node server/server.js` i pozostawia terminal włączony.
2. Zainstaluj narzędzie `cloudflared` zgodnie z instrukcją Cloudflare: https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/
3. W **drugim** terminalu uruchom:

   ```bash
   cloudflared tunnel --url http://localhost:8765
   ```

4. Cloudflare wyświetli **tymczasowy URL HTTPS**, np. `https://losowa-nazwa.trycloudflare.com` (przykład, nie jest to gotowy link).
5. Host i znajomi mogą wejść na ten URL. CO-OP automatycznie ustawi adres połączenia `wss://losowa-nazwa.trycloudflare.com/ws`. Host tworzy pokój i podaje kod.

**Jeśli korzystasz z GitHub Pages**, możesz trzymać tam `THE_CATROOMS_COOP.html` jako `index.html`. W lobby w polu **Adres WebSocket** host i znajomi wpisują adres z tunelu, ale z `wss://` oraz `/ws` na końcu, np. `wss://losowa-nazwa.trycloudflare.com/ws`. Użytkownicy nadal korzystają z GitHub Pages, natomiast ruch multiplayer trafia przez tunel na komputer hosta.

> Publiczny adres tunelu jest tymczasowy. Jeśli zamkniesz tunel, pozostali gracze utracą połączenie. Nigdy nie wystawiaj portu 8765 jako niezabezpieczone `ws://` do internetu. Do użytku publicznego zalecany jest stały HTTPS/WSS i kontrola dostępu.

## Jak działa rozgrywka

- **Host symuluje** przeciwników, kolizje, zbieranie przedmiotów, obrażenia, HP, bramy, panele i ukończenie levelu. Pozostali wysyłają ruch i akcje; nie mogą dowolnie tworzyć obiektów na mapie.
- Wszyscy mają **oddzielną pozycję, wytrzymałość, HP, latarkę i zapas wabików**. Przedmioty oraz postęp celu są wspólne.
- Przeciwnicy mogą ścigać **dowolnego gracza**, nie tylko hosta. Złapanie **jakiejkolwiek osoby** kończy rundę całej drużyny, tak jak w solo.
- Wyjście jest aktywne po zebraniu celów i uruchomieniu paneli. Gdy **dowolna osoba** dotrze do wyjścia, drużyna kończy poziom.
- Serwer przekazuje stan około **10 razy na sekundę**. Goście mają lokalne przewidywanie ruchu i korektę do rzeczywistej pozycji na hoście.
- Przyciski mobilne działają także u gości. Host może wybrać poziomy 1–4 i tryb proceduralny.
- Gość nie może uruchamiać poleceń konsoli admina. Pauza hosta zatrzymuje wspólny czas; pauza gościa nie zatrzymuje przeciwników u hosta.
- Host musi pozostawić włączone okno gry i serwer. Jeśli wyjdzie albo połączenie się urwie, pokój zostaje zamknięty. Nie ma jeszcze przejmowania roli hosta.

## Najczęstsze problemy

- **Nie można połączyć się z serwerem:** upewnij się, że serwer jest uruchomiony i że wpisano `ws://IP:8765/ws` dla sieci LAN albo `wss://PUBLICZNY-ADRES/ws` przez internet.
- **Na GitHub Pages wpisuję `ws://...` i nie działa:** strona działa przez HTTPS, więc przeglądarka wymaga `wss://`. Użyj tunelu.
- **Nie mogę stworzyć lobby:** nie działa serwer Node.js albo zapora blokuje port.
- **Kod nie działa:** pokój mógł zostać zamknięty, jest pełny lub runda już trwa.
- **Następna runda:** host wybiera ponownie **START CO-OP** w lobby albo **SPRÓBUJ PONOWNIE** po przegranej.
- **Opóźnienia:** zależą od sieci i liczby graczy. Ten tryb jest funkcjonalnym prototypem i nie ma jeszcze dedykowanego serwera z migracją hosta ani profesjonalnym anti-cheatem.

## Pliki

- `index.html` – gra w wielu plikach, może być serwowana przez Node.js lub GitHub Pages.
- `server/server.js` – serwer HTTP + WebSocket bez zależności npm.
- `js/network/coop.js` – synchronizacja pokojów i gry.
- `START_HOST_WINDOWS.bat` / `START_HOST_MAC_LINUX.sh` – uruchamianie serwera.
- `tools/build_standalone.py` – generuje jeden plik HTML z osadzonymi grafikami i dźwiękami.

Źródła dotyczące hostingu:
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/
- https://developers.cloudflare.com/network/websockets/

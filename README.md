# Undernite

Battle Royale unter Wasser – 3D, Third-Person, läuft im Browser.
Ein kleiner Node.js-Server auf dem Windows-PC hostet das Spiel für alle Geräte im Heimnetz
und füllt freie Plätze mit Bots auf.

## Starten (Windows)

1. Einmalig [Node.js LTS](https://nodejs.org) installieren (oder `winget install OpenJS.NodeJS.LTS`).
2. Repo klonen (oder als ZIP laden und entpacken), `start.bat` doppelklicken. Der Browser öffnet sich auf `http://localhost:8080`.
3. Mitspieler im selben WLAN/LAN öffnen die Adresse, die im Serverfenster und in der Lobby
   unter „Mitspieler im Heimnetz“ steht (z. B. `http://192.168.x.y:8080`).
   Beim ersten Start fragt die Windows-Firewall nach – für **private Netzwerke** zulassen.

Beim ersten Start installiert `start.bat` einmalig die einzige Abhängigkeit (`ws`) per `npm install`.
Danach läuft alles offline; three.js liegt unter `public/vendor/` bei.
Anderer Port: `set PORT=9000` vor `node server.js`.

## Steuerung

| Taste | Aktion |
|---|---|
| W A S D | schwimmen (in Blickrichtung, volle 3D-Bewegung) |
| Maus | zielen / umsehen |
| Leertaste / C | aufwärts / abwärts – ganz oben schaut dein Kopf aus dem Wasser |
| Shift | Schub (verbraucht Energie) |
| Linksklick | feuern |
| 1 2 3 / Mausrad | Waffe wechseln |
| R | nachladen |
| E | Truhe öffnen, Waffe aufheben/tauschen, Fahrzeug ein-/aussteigen |
| F | aus dem Oktopusgriff befreien (hämmern) |
| L | Taschenlampe an/aus (Expedition) |

## Was drin ist (v0.1)

- **Runde:** Absprung von der Oberfläche, Ausrüstung suchen, das *Schwarzwasser* (die Zone) zieht sich in
  sechs Phasen zusammen, der Letzte gewinnt. Dauer ca. 5 Minuten.
- **Anzüge:** Manta (klein, schnell, 70 LP) · Triton (Allrounder, 100 LP) · Bollwerk (Panzeranzug, 150 LP) ·
  Goliath (realistischer Unterwasser-Roboter mit Glaskuppel, Propellern, Scheinwerfern und Motorgeräuschen, 240 LP, +12 % Schaden, passt in kein Fahrzeug, Oktopusse können ihn nicht halten).
- **Waffen:** Bolzenpistole, Nadler, Splitterwerfer, Harpune, Torpedowerfer – jeweils in vier Seltenheitsstufen.
- **Fahrzeuge:** U-Scooter (schnell, Fahrer ungeschützt) und Mini-U-Boot (450 Rumpfpunkte, Bordtorpedos).
- **Raubtiere:** Haie wittern Verletzte aus großer Entfernung und greifen im Vorbeischwimmen an,
  Oktopusse lauern an Wrack, Ruinen und Riffen, packen zu und vernebeln die Sicht, Quallenschwärme
  verteilen Stromschläge. Alle lassen sich erlegen und hinterlassen Beute.
- **Welt:** bei jeder Runde neu erzeugt – Graben, Seeberg, Wrack, Ruinen, Kelpwälder, Korallenriffe.

## Modus: Tiefsee-Expedition (v0.2)

In der Lobby rechts zwischen **Battle Royale** und **Tiefsee-Expedition** wählen.

- **Die Welt ist ein Trichter mit 7 Etagen:** Sonnenriff (bis 60 m), Zwielicht (bis 130 m), Mitternacht (bis 210 m),
  Abgrund (bis 290 m), Tiefseegraben (bis 370 m), **Vulkanschlund** (bis 450 m, glüht rot) und **Urzeittiefe** (bis ca. 540 m, ganz unten in der Mitte). In der Mitte an der Oberfläche liegt das **Händler-Boot**.
- **Fische jagen:** 21 Fischarten, 3 pro Etage, tauchen zufällig auf. Je tiefer, desto wertvoller. Selten gibt es
  **goldene Fische** (5× Wert). Manche beißen zurück (Barrakuda, Viperfisch, Anglerfisch, Drachenfisch, Magma-Aal, Säbelzahnfisch).
- **Verkaufen:** Am Boot E drücken – Fische einzeln oder alle verkaufen, Ausrüstung kaufen.
- **6 Unterwasser-Basen:** alle auf Etage 1, 50 m tief, rund um den Rand verteilt (etwa alle 60°). **Jeder Spieler bekommt seine eigene Basis**
  (bis zu 6 Spieler, die gespeicherte bekommst du wieder, wenn sie frei ist). Auf der Minikarte gelb als „Deine Basis“, die anderen mit dem Namen des Besitzers.
  Fische einsetzen nur in der eigenen Basis; Luft tanken kann man an jeder. In jeder Basis sieht man das Aquarium ihres Besitzers.
- **Fang-Leiste:** Alles, was du fängst (Fische *und* besiegte Endbosse), liegt in Slots über den Waffen. Mit **4–9** oder **Q** nimmst du es in die Hand (1–3 = zurück zur Waffe).
  In der Basis setzt du es mit **E** (oder Klick) ins Aquarium. Jeder Slot zeigt, wie viel € pro Sekunde er im Aquarium macht.
- **Aquarium:** Fische darin verdienen jede Minute 8 % ihres Werts (Tiefseefische viel mehr, goldene 5×) – aber **nur während du wirklich spielst**: offline gibt es nichts, und nach 60 s ohne Bewegen/Umschauen (AFK) pausiert das Aquarium.
  **Endbosse** verdienen am meisten, je schwerer, desto mehr: Riffkönig 5 €/s, Krakenmutter 12, Laternenschlund 30, Knochenhai 70, Leviathan 150, Glutkrake 320, Megalodon 700 €/s.
  Es steht als rundes Glasbecken in der Basis. Start mit 3 Plätzen, dort vergrößerbar bis 30. Einkommen wird pro Sekunde angezeigt.
- **Laden (E am Boot):** bessere Waffen, größere **Flaschen** (mehr Luft, tiefer erlaubt), **Atemtraining** (weniger Luftverbrauch) und hellere **Lampen**.
  Alles ist teuer – die besten Sachen kosten mehrere 100.000 €. Nur im Tauch-Modus gibt es **Plasmalanze** und **Schallkanone**;
  Explosionen verletzen dort keine Taucher (Koop).
- **Taschenlampe (L):** hast du von Anfang an. Unten ist es stockdunkel! Der Akku lädt sich an der Oberfläche wieder auf.
- **Reichweite:** jede Waffe schießt nur so weit wie ihre Reichweite (Bolzenpistole 22 m, Splitterwerfer 26 m, Nadler 38 m, Harpune 65 m, Torpedowerfer 80 m).
- **Luft:** sinkt unter Wasser, je tiefer desto schneller. Unter der Maximaltiefe der Flasche macht der Druck Schaden.
  An der Oberfläche füllt sich die Luft wieder.
- **Bosse:** einer pro Etage, jeder Biss macht **20 Schaden** (Glutkrake 25, Megalodon 30), du hast **100 Leben**. Alle, die mitkämpfen, bekommen den Boss in ihre Fang-Leiste. Dann entscheidest du: **am Boot verkaufen** (Belohnung in €) **oder** in der Basis **ins Aquarium** (€ pro Sekunde), nicht beides.
  Was im Aquarium ist, kann man nur noch freilassen (Platz machen), nicht mehr verkaufen.
  Nach 2 Minuten kommt der Boss zurück.
- **Leben regenerieren:** 5 s ohne Schaden, dann heilst du 4 Leben pro Sekunde, an der Oberfläche 15.
- **Startgeld:** neue Taucher beginnen mit 100 €.
- **Ohnmächtig?** Nach 5 s wachst du am Boot auf, die Hälfte deines Fangs ist weg, Geld und Ausrüstung bleiben.
- **Spielstand** wird pro Spielername in `saves/expedition.json` gespeichert.

Alle Werte (Fische, Preise, Flaschen, Bosse) stehen oben in `public/js/shared.js` und lassen sich leicht ändern.
`node test-exp.mjs` spielt bei laufendem Server einen Testtaucher durch die Expedition.

## Aufbau

```
server.js            Node-Server: liefert public/ aus und simuliert das Spiel (20 Hz, autoritativ)
public/js/shared.js  Regeln, Werte und deterministische Welterzeugung (Server und Client)
public/js/main.js    Client: Netzwerk, Eingabe, Kamera, Entity-Sync
public/js/world.js   Meeresboden, Flora, Wasser, Partikel, Zonenwand
public/js/models.js  prozedurale Modelle (Taucher, Mech, U-Boot, Kisten, Projektile)
public/js/creatures.js realistische Meerestiere (Fische, Haie, Krake, Rochen, Bosse)
public/js/mech.js      Goliath-Anzug als realistischer Unterwasser-Roboter
public/js/ship.js    das Piratenschiff des Händlers
public/js/hud.js     HUD, Lobby, Ergebnis
public/js/audio.js   synthetische Sounds (WebAudio)
```

Balance-Werte (Leben, Tempo, Waffen, Zonenphasen) stehen oben in `shared.js` bzw. `server.js` (`PHASES`).
`node test-sim.mjs` spielt bei laufendem Server eine Runde als Testclient durch
(`UN_SPEED=25` am Server = Zeitraffer).

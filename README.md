# D-J-S New-Ark: Áruház Raktár

Egy kisebb raktár- és készletnyilvántartó rendszer áruházak számára. Nyilvántartja a termékeket, hosszabb távon pedig azt is, hogy az egyes termékek fizikailag hol találhatók, generált QR-kódok és vonalkódok segítségével.

A projekt egyben alap "template" is: egy kicsi étterem- és áruházkezelő rendszer, amelyen keresztül bemutathatók a további fejlesztési lehetőségek.

## Technológiák

| Réteg    | Technológia               |
| -------- | ------------------------- |
| Frontend | Vue 3 és Vite             |
| Backend  | Node.js és Express        |
| Adatbázis | SQLite                   |

## Projektstruktúra

```
DJS_Aruhaz-Raktar/
├── docs/
│   └── database_v0.6.dia        # Adatbázisterv (Dia diagram)
└── vue-project/
    ├── database/
    │   └── database.sqlite      # SQLite adatbázisfájl
    ├── server/
    │   ├── server.js            # Express API szerver
    │   └── db.js                # SQLite kapcsolat és lekérdezések
    └── src/
        └── components/
            └── RealRaktar.vue   # Raktár nézet
```

Az adatbázis felépítését a `docs/database_v0.6.dia` fájl dokumentálja. Megnyitható a [Dia](http://dia-installer.de/) programmal.

## Első lépések

### Előfeltételek

- [Node.js](https://nodejs.org/) (az aktuális LTS verzió ajánlott)
- npm

### Telepítés

```bash
git clone https://github.com/tataverteee/DJS_Aruhaz-Raktar.git
cd DJS_Aruhaz-Raktar/vue-project
npm install
```

### Futtatás

A backend indítása:

```bash
node server/server.js
```

A frontend indítása egy másik terminálban:

```bash
npm run dev
```

A Vite indításkor kiírja a helyi címet (általában `http://localhost:5173`).

## Tervek

- Raktárkészlet-nyilvántartás (termékek, mennyiségek, helyek)
- Minden termékhez tárolási hely megadása
- Termékenként generált QR-kód és vonalkód
- Újrahasznosítható alap kisebb ügyviteli rendszerekhez (étterem/áruház)

## Csapat

Alma, Miguel és Emanuel.

## Licenc

Még nincs megadva licenc.

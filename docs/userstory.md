# Raktárkezelő weboldal – Felhasználói történetek (User Stories)

> Minden történet a **"Mint [szerepkör], szeretném [cél], hogy [haszon]"** szerkezetet követi, elfogadási kritériumokkal kiegészítve.

---

## Tartalomjegyzék

1. [Szerepkörök áttekintése](#1-szerepkörök-áttekintése)
2. [Felhasználói jogosultságok](#2-felhasználói-jogosultságok)
3. [Az oldal használata Viewerként](#3-az-oldal-használata-viewerként)
4. [Nyitott kérdések](#4-nyitott-kérdések)

---

## 1. Szerepkörök áttekintése

| Szerepkör | Megtekintés | Keresés | Szerkesztés | Törlés | Teljes hozzáférés |
|-----------|:-----------:|:-------:|:-----------:|:------:|:-----------------:|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Manager** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Warehouse** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Viewer** | ✅ | ✅ | ❌ | ❌ | ❌ |

> A Warehouse szerepkör keresési joga feltételezett, kérlek erősítsd meg.

---

## 2. Felhasználói jogosultságok

### US-01 – Admin: teljes hozzáférés

**Mint** Admin,
**szeretném** a weboldal összes funkcióját teljes hozzáféréssel használni,
**hogy** mindent szabadon megtekinthessek, szerkeszthessek és kezelhessek.

**Elfogadási kritériumok:**
- [ ] Az Admin bejelentkezés után eléri az oldal minden funkcióját.
- [ ] Az Admin létrehozhat, szerkeszthet és törölhet bármilyen adatot.

---

### US-02 – Manager: nyilvántartások szerkesztése és törlése

**Mint** Manager,
**szeretném** szerkeszteni és törölni a raktári nyilvántartásokat,
**hogy** a raktár adatai mindig naprakészek legyenek.

**Elfogadási kritériumok:**
- [ ] A Manager bejelentkezés után szerkesztheti a raktári nyilvántartásokat.
- [ ] A Manager törölheti a raktári nyilvántartásokat.
- [ ] A Manager nem fér hozzá az Adminnak fenntartott funkciókhoz.

---

### US-03 – Warehouse: nyilvántartások megtekintése

**Mint** Warehouse felhasználó (raktári dolgozó),
**szeretném** megnézni a raktári nyilvántartásokat,
**hogy** lássam, mi van jelenleg a raktárban.

**Elfogadási kritériumok:**
- [ ] A Warehouse felhasználó bejelentkezés után megtekintheti a nyilvántartásokat.
- [ ] A Warehouse felhasználó nem szerkeszthet és nem törölhet adatot.

---

### US-04 – Viewer: csak olvasási hozzáférés

**Mint** Viewer,
**szeretnék** keresni és megnézni a tárhelyek állapotát,
**hogy** lássam a raktár tartalmát anélkül, hogy bármit módosíthatnék.

**Elfogadási kritériumok:**
- [ ] A Viewer csak olvasási joggal rendelkezik.
- [ ] A szerkesztés és törlés gombok/funkciók nem jelennek meg számára.

---

## 3. Az oldal használata Viewerként

> ⚠️ **Státusz:** ez a rész még nincs teljesen kész.

### US-05 – Keresés kulcsszóval (főkereső)

**Mint** Viewer,
**szeretném** a főkeresőt használni kulcsszavas kereséshez,
**hogy** megtaláljam a kulcsszóhoz tartozó, illetve hasonló kulcsszavakat tartalmazó tárgyakat.

**Elfogadási kritériumok:**
- [ ] A Viewer bejelentkezés után eléri a főkeresőt.
- [ ] A keresés a pontos és a hasonló kulcsszavakat tartalmazó tárgyakat is megjeleníti.
- [ ] Találat hiányában a rendszer tájékoztató üzenetet jelenít meg.

---

### US-06 – Keresés pontos tárgyazonosítóval (Gyors Keresés)

**Mint** Viewer,
**szeretnék** a „Gyors Keresés" alatti keresőmezőben pontos tárgyazonosítóval (pl. `#T-123`) keresni,
**hogy** egy konkrét tárgyat azonnal megtaláljak.

**Elfogadási kritériumok:**
- [ ] A keresőmező az oldal közepén, a „Gyors Keresés" szakasz alatt található.
- [ ] Érvényes azonosító esetén a rendszer pontosan az adott tárgyat jeleníti meg.
- [ ] Érvénytelen azonosító esetén hibaüzenet jelenik meg.

---

### US-07 – Tárhelyek böngészése

**Mint** Viewer,
**szeretném** az oldal bal oldalán látni az elérhető tárhelyek listáját, és egyre rákattintva megnézni az ott található tárgyakat,
**hogy** átlássam, mi van az adott tárhelyen.

**Elfogadási kritériumok:**
- [ ] A bal oldali sáv felsorolja az elérhető tárhelyeket (pl. `A-100`, `B-200`, `C-300`).
- [ ] Egy tárhelyre kattintva megjelenik az ott található tárgyak listája.
- [ ] Üres tárhely esetén a rendszer jelzi, hogy nincs benne tárgy.

---

## 4. Nyitott kérdések

- **Bejelentkezés:** érdemes külön storyt írni rá (US-00), hogy ne kelljen minden történetben ismételni.
- **Warehouse vs. Viewer:** jelenleg nagyon hasonló a két szerep. Mi a pontos különbség (pl. mennyiségek, tárhelyek pontos helye)?
- **Hasonló kulcsszavak:** hogyan működjön a „hasonló" keresés (részleges egyezés, elírástűrés, szinonimák)?
- **Hibakezelés:** mi történik jogosultság nélküli művelet esetén (tiltott oldal, lejárt munkamenet)?

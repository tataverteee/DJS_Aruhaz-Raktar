<script setup>
async function openBox() {
  const res = await fetch('/api/message')
  const data = await res.json()
  alert(data.message)
}
</script>

<template>
<!-- fejlec -->
  <header>
    <div class="felso-fejlec">
      <a href="#" class="oldal-marka">
        <span class="oldal-marka-ikon">RA</span> <!--logo maybe? idk dolgozom rajta, open to suggestions-->
        <span class ="marka-szoveg">RAKTÁR ARCHÍVUM</span>
      </a>

      <ul class="navigation-kategoriak">
        <li><a href="#">WEB</a></li>
        <li><a href="#">TÁRHELYEK</a></li>
        <li><a href="#">TÁRGYAK</a></li>
        <li><a href="#">KATEGÓRIÁK</a></li>
      </ul>

      <div class="fejlec-felhasznaloi-dolog">
        <span class="user-badge manager">Kevin Papp (MANAGER)</span> <!--(template)-->
        <span>|</span>
        <button type="button" id="regisztracio-gomb" @click="openBox">REGISZTRÁCIÓ</button>
        
        <span>|</span>
        <button type="button" id="bejelentkezes-gomb">BEJELENTKEZÉS</button>
        <span>|</span>
        <a href="#">BEÁLLÍTÁSOK</a>
        
      </div>
    </div>
  </header>

  <!-- weboldal navigacios resze -->
  <nav class="weboldal-navigacio">
    <ul>
      <li><a href="#">RÓLUNK</a></li>
      <li><a href="#">RAKTÁRI EGYSÉGEK</a></li>
      <li><a href="#">LÉTESÍTMÉNYEK</a></li>
      <li><a href="#">KAPCSOLAT</a></li>
    </ul>
  </nav>

  <!-- keresés rész -->
  <section class="kiemelt-banner">
    <div class="kiemelt-tartalom">
      <a href="#" class="logo-doboz">
        <div class="archive-cim-szoveg">
          <h1>RAKTÁR</h1>
          <h3>Raktár-Készlet Archive</h3>
        </div>
      </a>

      <div class="kereses-resz">
        <form class="kereso-doboz-dolog" action="#" method="get">
          <select class="kereso-valaszto">
            <option value="osszes">Összes</option>
            <option value="tarhelyek">Tárhelyek</option>
            <option value="felszereles">Eszközök</option>
            <option value="raklapok">Raklaptételek</option>
          </select>
          <input type="text" class="kereso-doboz-bemenet" placeholder="Adja meg egy tárgy azonosítóját vagy egy kulcsszót.">
          <button type="submit" class="kereso-doboz-gomb">KERESÉS</button>
        </form>
      </div>
    </div>
  </section>

  <!-- eszköztár részlet -->
  <section class="eszkoz-racs-resz">
    <div class="kontener">
      <div class="eszkoz-racs">
        <!-- 1. div, tárhely hivatkozások, kategóriák -->
        <div class="racs-oszlop">
          <div class="oszlop-fejlec">
            <h3>Tárhelyek böngészése</h3>
          </div>
          <p class="oszlop-szoveg">Raktárok és területi helyszínek:</p>
          <ul class="oszlop-lista">
            <li><a href="#">A-100 Egység (Elektronika)</a></li>
            <li><a href="#">B-200 Egység (Szerszámok)</a></li>
            <li><a href="#">C-300 Egység (Dokumentumok)</a></li>
          </ul>
        </div>

        <!-- 2. div: gyorskeresés -->
        <div class="racs-oszlop">
          <div class="oszlop-fejlec">
            <h3>Gyors Keresés</h3>
          </div>
          <p class="oszlop-szoveg">Adjon meg egy pontos azonosító kódot.</p>

          <form class="urlap" action="#" method="get">  
            <input type="text" class="bemenet" placeholder="Azonosító (pl. #T-123)">
            <button type="submit" class="gomb">TÁRGY KERESÉSE</button>
          </form>

        </div>

        <!-- 3. div: tárhelyek/adatbázis állapota -->
        <div class="racs-oszlop">
          <div class="oszlop-fejlec">
            <h3>Tárhelyek állapota</h3>
          </div>
          <table class="statisztika-tablazat">
            <tbody>
              <tr>
                <td class="statisztika-cimke">Összes Létesítmény:</td>
                <td class="statisztika-ertek"></td>
              </tr>
              <tr>
                <td class="statisztika-cimke">Foglalt Tárhelyek:</td>
                <td class="statisztika-ertek"></td>
              </tr>
              <tr>
                <td class="statisztika-cimke">Szabad Kapacitás:</td>
                <td class="statisztika-ertek"></td>
              </tr>
              <tr>
                <td class="statisztika-cimke">Utolsó Ellenőrzés:</td>
                <td class="statisztika-ertek"></td>
              </tr>
              <tr>
                <td class="statisztika-cimke">Adatbázis Állapota:</td>
                <td class="statisztika-ertek"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>

  <!-- legutóbbi raktári nyilvantartasok -->
  <section class="jegyzek-resz">
    <div class="kontener">
      <h3 class="szekcio-cim">Legutóbbi Raktári Nyilvántartások</h3>
      <table class="leltar-tablazat">
  <thead>
    <tr>
      <th>Tárgy ID</th>
      <th>Megnevezés / Leírás</th>
      <th>Tárolási Helyszín</th>
      <th>Kategória</th>
      <th>Elérhetőség</th>
      <th>Műveletek</th>
    </tr>
  </thead>
  <tbody>
    <tr>
     <!-- EZEK PÉLDÁK!!!!!!!!!!!!!!!!!!!!! csak azert irtam le hogy lehessen látni
        hogy hogyan fog kinézni -->
      <td><strong>#T-1</strong></td>
      <td><a href="#">Fúrógép Készlet</a></td>
      <td>B-200 Egység (3. Polc)</td>
      <td>Szerszámok</td> <!-- "statusz raktaron"-rész az mind csak egy template, tudjam hogyan fog kinezni-->
      <td><span class="statusz-jelzo statusz-raktaron">aha</span></td> 
      <td>
        <button class="muvelet-gomb gomb-szerkesztes">Szerkesztés </button>
        <button class="muvelet-gomb gomb-torles">Törlés</button> <!-- csak a "manager,admin" jogosultságú felhasználo láthatná ezeket, az az ötlet -->
      </td>
    </tr>
    <tr>
      <td><strong>#T-2</strong></td>
      <td><a href="#">Ethernet Kábeltekercs (500m)</a></td>
      <td>A-100 Egység (2. Polc)</td>
      <td>Hálózat</td>
      <td><span class="statusz-jelzo statusz-lefoglalva">lefoglalt</span></td>
        <td>
            <button class="muvelet-gomb gomb-szerkesztes">Szerkesztés</button>
            <button class="muvelet-gomb gomb-torles">Törlés</button>
         </td>
    </tr>
    <tr>
      <td><strong>#T-3</strong></td>
      <td><a href="#">2025-09-28 nap Készlet</a></td>
      <td>C-300 Egység (5. Polc)</td>
      <td>Dokumentumok</td>
      <td><span class="statusz-jelzo statusz-kiadva">NINCS</span></td>
        <td>
            <button class="muvelet-gomb gomb-szerkesztes">Szerkesztés</button>
            <button class="muvelet-gomb gomb-torles">Törlés</button>
        </td>
    </tr>
  </tbody>
</table>
    </div>
  </section>    

  <!-- labléc -->
  <footer>
    <div class="kontener">
      <ul class="lablec-linkek">
        <li><a href="#">Rólunk</a></li> |
        <li><a href="#">Kapcsolat</a></li> |
        <li><a href="#">Felhasználási Feltételek</a></li>
      </ul>
    </div>
  </footer>
</template>


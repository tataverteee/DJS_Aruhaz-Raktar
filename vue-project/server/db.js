// SQLite layer for the warehouse app (schema: docs/database_v0.6.dia).
//
// Importing this module opens database/database.sqlite, creates any missing
// tables and fills them with dummy data if the database is still empty.
//
//   import db from './db.js'
//   db.prepare('SELECT * FROM items').all()
//
// Rebuild the file from scratch (drops everything, re-seeds):
//   node server/db.js --reset
//
// Uses Node's built-in `node:sqlite` (Node >= 22.18, see "engines"), so there is
// nothing extra to install. Node may print an ExperimentalWarning for it.

import { DatabaseSync } from 'node:sqlite'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
export const DB_PATH = path.join(path.dirname(__filename), '..', 'database', 'database.sqlite')

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

export const db = new DatabaseSync(DB_PATH)
db.exec('PRAGMA foreign_keys = ON')

// ---------------------------------------------------------------------------
// Schema (database_v0.6.dia). SQLite does not enforce VARCHAR lengths, they are
// kept here as documentation of the diagram.
// ---------------------------------------------------------------------------

// Children first, so the tables can be dropped without FK violations.
const TABLES = [
  'active', 'actionlog', 'palettes', 'orderitems', 'inward', 'outward',
  'items', 'itemtype', 'suppliers', 'ordertypes', 'users', 'permissions',
]

const SCHEMA = `
CREATE TABLE IF NOT EXISTS permissions (
  accesslevel INTEGER PRIMARY KEY AUTOINCREMENT,
  type        VARCHAR(15) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  userid      INTEGER PRIMARY KEY AUTOINCREMENT,
  username    VARCHAR(30) NOT NULL,
  password    VARCHAR(30) NOT NULL,
  accesslevel INTEGER NOT NULL REFERENCES permissions(accesslevel)
);

CREATE TABLE IF NOT EXISTS ordertypes (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS outward (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  type     INTEGER REFERENCES ordertypes(id),
  status   VARCHAR(10),
  customer VARCHAR(40),
  date     DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS itemtype (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  name      VARCHAR(20) NOT NULL,
  profitkey REAL
);

CREATE TABLE IF NOT EXISTS items (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  type  INTEGER REFERENCES itemtype(id),
  stock INTEGER,
  price INTEGER
);

CREATE TABLE IF NOT EXISTS orderitems (
  id     INTEGER NOT NULL REFERENCES outward(id),
  itemid INTEGER NOT NULL REFERENCES items(id),
  count  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS suppliers (
  supplierid INTEGER PRIMARY KEY AUTOINCREMENT,
  name       VARCHAR(40) NOT NULL,
  email      VARCHAR(50),
  phone      VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS inward (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  supplierid INTEGER NOT NULL REFERENCES suppliers(supplierid),
  status     VARCHAR(10),
  date       DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS palettes (
  id     INTEGER NOT NULL REFERENCES inward(id),
  itemid INTEGER REFERENCES items(id),
  count  INTEGER
);

CREATE TABLE IF NOT EXISTS actionlog (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  userid    INTEGER REFERENCES users(userid),
  action    VARCHAR(64),
  status    VARCHAR(6),
  serial    VARCHAR(64) NOT NULL,
  timestamp DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS active (
  userid    INTEGER NOT NULL REFERENCES users(userid),
  token     VARCHAR(64),
  "current" VARCHAR(20)
);
`

export function initSchema() {
  db.exec(SCHEMA)
}

// ---------------------------------------------------------------------------
// Dummy data: 20 rows in every data table. The small lookup tables
// (permissions, ordertypes, itemtype) only hold the values that make sense.
// ---------------------------------------------------------------------------

const DUMMY_PASSWORD = 'Test1234!' // plain text on purpose: dummy data only

// Fake but well-formed session token (64 hex chars) for a user id.
const fakeToken = (userid) => createHash('sha256').update(`dummy-token-${userid}`).digest('hex')

const permissions = [
  [1, 'admin'],
  [2, 'manager'],
  [3, 'warehouse'],
  [4, 'viewer'],
]

// [userid, username, accesslevel]
const users = [
  [1, 'admin', 1],
  [2, 'nagy.istvan', 1],
  [3, 'kevin.papp', 2], // same name as the template badge in RealRaktar.vue
  [4, 'szabo.eszter', 2],
  [5, 'toth.balazs', 2],
  [6, 'kiss.reka', 2],
  [7, 'horvath.david', 3],
  [8, 'varga.nora', 3],
  [9, 'molnar.peter', 3],
  [10, 'farkas.anna', 3],
  [11, 'balogh.tamas', 3],
  [12, 'papp.zsofia', 3],
  [13, 'takacs.mate', 3],
  [14, 'juhasz.lilla', 3],
  [15, 'meszaros.adam', 3],
  [16, 'simon.dora', 3],
  [17, 'racz.bence', 4],
  [18, 'lukacs.vivien', 4],
  [19, 'gal.marton', 4],
  [20, 'orosz.hanna', 4],
].map(([id, name, level]) => [id, name, DUMMY_PASSWORD, level])

const ordertypes = [
  [1, 'retail'],
  [2, 'wholesale'],
  [3, 'online'],
  [4, 'internal'],
]

// [id, name, profitkey (price multiplier)]
const itemtype = [
  [1, 'Electronics', 1.25],
  [2, 'Tools', 1.4],
  [3, 'Household', 1.35],
  [4, 'Office supplies', 1.5],
  [5, 'Toys', 1.6],
  [6, 'Sports', 1.45],
  [7, 'Garden', 1.38],
  [8, 'Auto parts', 1.3],
  [9, 'Groceries', 1.15],
  [10, 'Clothing', 1.7],
]

// [id, type, stock, price in HUF]. The v0.6 items table has no name column,
// so what each row stands for is noted in the comments.
const items = [
  [1, 1, 42, 189990], // laptop 15"
  [2, 1, 215, 7990], // wireless mouse
  [3, 1, 98, 34990], // bluetooth speaker
  [4, 2, 76, 28990], // cordless drill
  [5, 2, 310, 3490], // screwdriver set
  [6, 3, 150, 12990], // electric kettle
  [7, 3, 64, 9990], // storage box set
  [8, 4, 520, 1490], // A4 paper ream
  [9, 4, 275, 890], // ballpoint pens, 10 pack
  [10, 5, 88, 14990], // building blocks set
  [11, 5, 0, 5990], // board game (out of stock)
  [12, 6, 57, 21990], // dumbbell set
  [13, 6, 140, 8990], // yoga mat
  [14, 7, 33, 45990], // electric lawn mower
  [15, 7, 120, 6490], // garden hose
  [16, 8, 190, 18990], // car battery
  [17, 8, 8, 4990], // wiper blades (low stock)
  [18, 9, 600, 590], // pasta, 500 g
  [19, 9, 340, 1290], // coffee beans
  [20, 10, 72, 24990], // winter jacket
]

// [supplierid, name, email, phone]; a few NULLs on purpose (both are nullable)
const suppliers = [
  [1, 'Alföld Nagykereskedelmi Kft.', 'info@alfold-nagyker.example', '+36205550101'],
  [2, 'Dunántúli Elektronika Zrt.', 'rendeles@dunantuli-elektronika.example', '+36305550102'],
  [3, 'Tisza Szerszám Kft.', 'iroda@tisza-szerszam.example', '+36705550103'],
  [4, 'Balaton Háztartási Cikk Kft.', 'info@balaton-haztartas.example', '+36205550104'],
  [5, 'Pannon Irodaszer Bt.', 'megrendeles@pannon-irodaszer.example', '+36305550105'],
  [6, 'Mátra Játék Kft.', 'info@matra-jatek.example', '+36705550106'],
  [7, 'Bakony Sportcikk Kft.', 'sales@bakony-sport.example', null],
  [8, 'Kertész & Fia Kft.', 'kerteszfia@kertesz-fia.example', '+36205550108'],
  [9, 'Zala Autóalkatrész Kft.', 'alkatresz@zala-auto.example', '+36305550109'],
  [10, 'Hortobágyi Élelmiszer Zrt.', 'nagyker@hortobagyi-elelmiszer.example', '+36705550110'],
  [11, 'Szeged Textil Kft.', 'info@szeged-textil.example', '+36205550111'],
  [12, 'Debreceni Műszaki Nagyker', null, '+36305550112'],
  [13, 'Győr-Pack Csomagolás Kft.', 'info@gyor-pack.example', '+36705550113'],
  [14, 'Mecsek Ipari Kft.', 'ugyfel@mecsek-ipari.example', '+36205550114'],
  [15, 'Budai Import-Export Kft.', 'office@budai-impex.example', '+36305550115'],
  [16, 'Kárpát Logisztika Zrt.', 'szallitas@karpat-logisztika.example', '+36705550116'],
  [17, 'Vértes Kerti Szerszám Kft.', 'info@vertes-kerti.example', null],
  [18, 'Duna Bútor Kft.', 'rendeles@duna-butor.example', '+36205550118'],
  [19, 'Sopron Papír Kft.', 'papir@sopron-papir.example', '+36305550119'],
  [20, 'Fertő Sport Kft.', 'info@ferto-sport.example', '+36705550120'],
]

// [id, supplierid, status, date]
const inward = [
  [1, 2, 'stored', '2026-08-04'],
  [2, 5, 'stored', '2026-08-07'],
  [3, 1, 'stored', '2026-08-12'],
  [4, 3, 'stored', '2026-08-18'],
  [5, 8, 'stored', '2026-08-25'],
  [6, 2, 'stored', '2026-09-01'],
  [7, 9, 'stored', '2026-09-04'],
  [8, 4, 'stored', '2026-09-08'],
  [9, 6, 'stored', '2026-09-11'],
  [10, 10, 'stored', '2026-09-15'],
  [11, 1, 'stored', '2026-09-18'],
  [12, 7, 'stored', '2026-09-22'],
  [13, 12, 'received', '2026-09-28'],
  [14, 3, 'received', '2026-10-02'],
  [15, 15, 'received', '2026-10-06'],
  [16, 9, 'received', '2026-10-08'],
  [17, 2, 'ordered', '2026-10-12'],
  [18, 11, 'ordered', '2026-10-13'],
  [19, 5, 'ordered', '2026-10-14'],
  [20, 18, 'ordered', '2026-10-15'],
]

// [inward id, itemid, count]: one palette per delivery
const palettes = [
  [1, 1, 40],
  [2, 8, 500],
  [3, 18, 600],
  [4, 4, 80],
  [5, 14, 40],
  [6, 2, 220],
  [7, 16, 200],
  [8, 6, 150],
  [9, 10, 90],
  [10, 19, 350],
  [11, 9, 300],
  [12, 12, 60],
  [13, 3, 100],
  [14, 5, 320],
  [15, 13, 140],
  [16, 17, 60],
  [17, 1, 50],
  [18, 20, 100],
  [19, 9, 250],
  [20, 7, 70],
]

// [id, type (ordertypes), status, customer, date]
const outward = [
  [1, 1, 'delivered', 'Kovács Anna', '2026-09-02'],
  [2, 3, 'delivered', 'Szűcs Gergő', '2026-09-04'],
  [3, 2, 'delivered', 'Tóth & Társa Kft.', '2026-09-07'],
  [4, 1, 'delivered', 'Fehér Katalin', '2026-09-10'],
  [5, 3, 'delivered', 'Budai Márk', '2026-09-14'],
  [6, 2, 'delivered', 'Zalai Barkácsáruház Kft.', '2026-09-17'],
  [7, 3, 'delivered', 'Pintér Júlia', '2026-09-19'],
  [8, 1, 'delivered', 'Lakatos Ferenc', '2026-09-23'],
  [9, 2, 'delivered', 'Napfény Iskola Alapítvány', '2026-09-25'],
  [10, 3, 'cancelled', 'Sipos Boglárka', '2026-09-28'],
  [11, 1, 'delivered', 'Katona Zoltán', '2026-10-01'],
  [12, 4, 'delivered', 'Belső felhasználás - iroda', '2026-10-03'],
  [13, 2, 'shipped', 'Kertbarát Szaküzlet Bt.', '2026-10-05'],
  [14, 3, 'shipped', 'Orbán Dóra', '2026-10-07'],
  [15, 1, 'shipped', 'Vörös Imre', '2026-10-08'],
  [16, 2, 'packed', 'Sportpláza Kereskedelmi Kft.', '2026-10-12'],
  [17, 3, 'packed', 'Bognár Eszter', '2026-10-13'],
  [18, 1, 'pending', 'Antal Gyula', '2026-10-14'],
  [19, 3, 'pending', 'Gulyás Réka', '2026-10-15'],
  [20, 2, 'pending', 'Autó-Profi Szerviz Kft.', '2026-10-16'],
]

// [outward id, itemid, count]: one line per order
const orderitems = [
  [1, 1, 1],
  [2, 3, 2],
  [3, 8, 50],
  [4, 6, 1],
  [5, 13, 2],
  [6, 4, 10],
  [7, 20, 1],
  [8, 2, 3],
  [9, 9, 40],
  [10, 10, 1],
  [11, 19, 4],
  [12, 8, 5],
  [13, 15, 12],
  [14, 7, 2],
  [15, 5, 1],
  [16, 12, 6],
  [17, 18, 10],
  [18, 14, 1],
  [19, 17, 2],
  [20, 16, 4],
]

// [id, userid, action, status, serial, timestamp]
const actionlog = [
  [1, 1, 'LOGIN', 'OK', 'SES-000001', '2026-10-12 07:55:03'],
  [2, 3, 'LOGIN', 'OK', 'SES-000002', '2026-10-12 08:02:41'],
  [3, 3, 'ORDER_CREATE', 'OK', 'OUT-000016', '2026-10-12 10:05:44'],
  [4, 8, 'INWARD_CREATE', 'OK', 'INW-000017', '2026-10-12 11:20:09'],
  [5, 17, 'ITEM_DELETE', 'DENIED', 'ITM-000011', '2026-10-12 14:40:31'],
  [6, 9, 'LOGIN', 'FAILED', 'SES-000003', '2026-10-13 08:10:55'],
  [7, 9, 'LOGIN', 'OK', 'SES-000004', '2026-10-13 08:11:20'],
  [8, 4, 'ORDER_CREATE', 'OK', 'OUT-000017', '2026-10-13 09:14:48'],
  [9, 10, 'STOCK_UPDATE', 'OK', 'ITM-000017', '2026-10-13 10:02:10'],
  [10, 8, 'INWARD_CREATE', 'OK', 'INW-000018', '2026-10-13 13:27:36'],
  [11, 1, 'USER_UPDATE', 'OK', 'USR-000018', '2026-10-13 15:48:02'],
  [12, 9, 'LOGOUT', 'OK', 'SES-000004', '2026-10-13 16:59:30'],
  [13, 5, 'ORDER_CREATE', 'OK', 'OUT-000018', '2026-10-14 08:33:25'],
  [14, 11, 'INWARD_CREATE', 'OK', 'INW-000019', '2026-10-14 09:45:51'],
  [15, 12, 'STOCK_UPDATE', 'OK', 'ITM-000014', '2026-10-14 11:12:44'],
  [16, 18, 'LOGIN', 'FAILED', 'SES-000005', '2026-10-14 12:30:03'],
  [17, 6, 'ORDER_CREATE', 'OK', 'OUT-000019', '2026-10-15 08:21:17'],
  [18, 13, 'INWARD_CREATE', 'OK', 'INW-000020', '2026-10-15 10:07:39'],
  [19, 2, 'LOGIN', 'OK', 'SES-000006', '2026-10-15 14:25:58'],
  [20, 3, 'ORDER_CREATE', 'OK', 'OUT-000020', '2026-10-16 08:17:06'],
]

// [userid, current]: users 3, 7, 8 are using the app right now, the ones in
// 'logged_in' have a session open, everybody else is 'inactive' (no token).
const activeStates = {
  3: 'active', 7: 'active', 8: 'active',
  1: 'logged_in', 2: 'logged_in', 4: 'logged_in', 5: 'logged_in', 10: 'logged_in', 11: 'logged_in',
}
const active = users.map(([userid]) => {
  const state = activeStates[userid] ?? 'inactive'
  return [userid, state === 'inactive' ? null : fakeToken(userid), state]
})

function insertRows(table, columns, rows) {
  const cols = columns.map((c) => `"${c}"`).join(', ')
  const marks = columns.map(() => '?').join(', ')
  const stmt = db.prepare(`INSERT INTO ${table} (${cols}) VALUES (${marks})`)
  for (const row of rows) stmt.run(...row)
}

// Parents before children, so every foreign key already points at a row.
export function seedDummyData() {
  db.exec('BEGIN')
  try {
    insertRows('permissions', ['accesslevel', 'type'], permissions)
    insertRows('users', ['userid', 'username', 'password', 'accesslevel'], users)
    insertRows('ordertypes', ['id', 'name'], ordertypes)
    insertRows('itemtype', ['id', 'name', 'profitkey'], itemtype)
    insertRows('items', ['id', 'type', 'stock', 'price'], items)
    insertRows('suppliers', ['supplierid', 'name', 'email', 'phone'], suppliers)
    insertRows('inward', ['id', 'supplierid', 'status', 'date'], inward)
    insertRows('palettes', ['id', 'itemid', 'count'], palettes)
    insertRows('outward', ['id', 'type', 'status', 'customer', 'date'], outward)
    insertRows('orderitems', ['id', 'itemid', 'count'], orderitems)
    insertRows('actionlog', ['id', 'userid', 'action', 'status', 'serial', 'timestamp'], actionlog)
    insertRows('active', ['userid', 'token', 'current'], active)
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
}

// Drops every table and rebuilds it with the dummy data.
export function resetDatabase() {
  db.exec('BEGIN')
  try {
    for (const table of TABLES) db.exec(`DROP TABLE IF EXISTS ${table}`)
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
  initSchema()
  seedDummyData()
}

export function rowCounts() {
  return Object.fromEntries(
    [...TABLES].reverse().map((t) => [t, db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get().n]),
  )
}

// ---------------------------------------------------------------------------
// Runs on import: create missing tables, seed only if nothing is in there yet.
// ---------------------------------------------------------------------------
initSchema()
if (db.prepare('SELECT COUNT(*) AS n FROM users').get().n === 0) {
  seedDummyData()
}

// `node server/db.js [--reset]`
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  if (process.argv.includes('--reset')) resetDatabase()
  console.log(`Database ready: ${DB_PATH}`)
  console.table(rowCounts())
}

export default db
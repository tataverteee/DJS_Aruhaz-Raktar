import express from 'express'
import db from './db.js'

const app = express()

// Parses a positive integer route parameter, or returns null.
const toId = (value) => {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : null
}

app.get('/api/health', (req, res) => {
  try {
    db.prepare('SELECT 1').get()
    res.json({ ok: true, db: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, db: false })
  }
})

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the server!', time: new Date().toISOString() })
})

// ---- item categories and items ---------------------------------------------

app.get('/api/itemtypes', (req, res) => {
  res.json(db.prepare('SELECT id, name, profitkey FROM itemtype ORDER BY id').all())
})

// GET /api/items            all items
// GET /api/items?type=3     only items of category 3
app.get('/api/items', (req, res) => {
  const sql = `
    SELECT i.id, i.type AS typeid, t.name AS type, i.stock, i.price
    FROM items i LEFT JOIN itemtype t ON t.id = i.type`
  if (req.query.type === undefined) {
    return res.json(db.prepare(`${sql} ORDER BY i.id`).all())
  }
  const typeId = toId(req.query.type)
  if (!typeId) return res.status(400).json({ error: 'type must be a positive integer' })
  res.json(db.prepare(`${sql} WHERE i.type = ? ORDER BY i.id`).all(typeId))
})

app.get('/api/items/:id', (req, res) => {
  const id = toId(req.params.id)
  if (!id) return res.status(400).json({ error: 'id must be a positive integer' })
  const item = db.prepare(`
    SELECT i.id, i.type AS typeid, t.name AS type, i.stock, i.price
    FROM items i LEFT JOIN itemtype t ON t.id = i.type
    WHERE i.id = ?`).get(id)
  if (!item) return res.status(404).json({ error: 'item not found' })
  res.json(item)
})

// ---- suppliers -------------------------------------------------------------

app.get('/api/suppliers', (req, res) => {
  res.json(db.prepare('SELECT supplierid, name, email, phone FROM suppliers ORDER BY supplierid').all())
})

// ---- outward orders --------------------------------------------------------

// GET /api/orders                 all orders, newest first, with item count and total
// GET /api/orders?status=packed   filtered by status
app.get('/api/orders', (req, res) => {
  const where = req.query.status === undefined ? '' : 'WHERE o.status = ?'
  const params = req.query.status === undefined ? [] : [String(req.query.status)]
  res.json(db.prepare(`
    SELECT o.id, o.type AS typeid, ot.name AS type, o.status, o.customer, o.date,
           COALESCE(SUM(oi.count), 0) AS itemcount,
           COALESCE(SUM(oi.count * i.price), 0) AS total
    FROM outward o
    LEFT JOIN ordertypes ot ON ot.id = o.type
    LEFT JOIN orderitems oi ON oi.id = o.id
    LEFT JOIN items i ON i.id = oi.itemid
    ${where}
    GROUP BY o.id
    ORDER BY o.date DESC, o.id DESC`).all(...params))
})

app.get('/api/orders/:id', (req, res) => {
  const id = toId(req.params.id)
  if (!id) return res.status(400).json({ error: 'id must be a positive integer' })
  const order = db.prepare(`
    SELECT o.id, o.type AS typeid, ot.name AS type, o.status, o.customer, o.date
    FROM outward o LEFT JOIN ordertypes ot ON ot.id = o.type
    WHERE o.id = ?`).get(id)
  if (!order) return res.status(404).json({ error: 'order not found' })
  const lines = db.prepare(`
    SELECT oi.itemid, t.name AS category, oi.count, i.price, oi.count * i.price AS linetotal
    FROM orderitems oi
    JOIN items i ON i.id = oi.itemid
    LEFT JOIN itemtype t ON t.id = i.type
    WHERE oi.id = ?`).all(id)
  res.json({ ...order, lines })
})

// ---- inward deliveries -----------------------------------------------------

app.get('/api/inward', (req, res) => {
  res.json(db.prepare(`
    SELECT n.id, n.supplierid, s.name AS supplier, n.status, n.date
    FROM inward n JOIN suppliers s ON s.supplierid = n.supplierid
    ORDER BY n.date DESC, n.id DESC`).all())
})

app.get('/api/inward/:id', (req, res) => {
  const id = toId(req.params.id)
  if (!id) return res.status(400).json({ error: 'id must be a positive integer' })
  const delivery = db.prepare(`
    SELECT n.id, n.supplierid, s.name AS supplier, n.status, n.date
    FROM inward n JOIN suppliers s ON s.supplierid = n.supplierid
    WHERE n.id = ?`).get(id)
  if (!delivery) return res.status(404).json({ error: 'delivery not found' })
  const palettes = db.prepare(`
    SELECT p.itemid, t.name AS category, p.count
    FROM palettes p
    LEFT JOIN items i ON i.id = p.itemid
    LEFT JOIN itemtype t ON t.id = i.type
    WHERE p.id = ?`).all(id)
  res.json({ ...delivery, palettes })
})

// Any unexpected database error ends up here instead of crashing the server.
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'internal server error' })
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
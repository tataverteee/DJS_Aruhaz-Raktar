import { Router } from 'express'

const router = Router()

// Teljes cím: /api/stock

// Raktárkészlet lekérdezése
// jog: warehouse_stock_view
router.get('/', async (req, res) => {
  res.json({ message: 'Dummy adat: itt a raktárkészlet jelenik meg.' })
})

// Áru átvétel rögzítése
// jog: goods_receipt_create
router.post('/movein', async (req, res) => {
  res.json({ message: 'Dummy adat: itt az áru átvétel végpontja.' })
})

// Áru kiadás rögzítése
// jog: goods_issue_create
router.post('/moveout', async (req, res) => {
  res.json({ message: 'Dummy adat: itt az áru kiadás végpontja.' })
})

// Raktárban lévő áru mozgatásának rögzítése
// jog: goods_movement_create
router.post('/movement', async (req, res) => {
  res.json({ message: 'Dummy adat: itt az áru mozgatásának végpontja.' })
})

export default router

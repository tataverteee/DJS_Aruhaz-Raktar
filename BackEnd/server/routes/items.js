import { Router } from 'express'

const router = Router()

// Teljes cím: /api/items

// Termékkészlet lekérdezése (termékek listája)
// jog: product_stock_view
router.get('/', async (req, res) => {
  res.json({ message: 'Dummy adat: itt a termékek listája jelenik meg.' })
})

// Termék módosítása
// jog: product_list_edit
router.post('/:id', async (req, res) => {
  res.json({ message: `Dummy adat: itt a(z) ${req.params.id}. termék módosítása történik.` })
})

// Terméktípus módosítása
// jog: product_type_list_edit
router.post('/types/:id', async (req, res) => {
  res.json({ message: `Dummy adat: itt a(z) ${req.params.id}. terméktípus módosítása történik.` })
})

export default router

import { Router } from 'express'

const router = Router()

// Teljes cím: /api/purchase

// Termék rendelése a raktárba
// jog: product_order_to_warehouse
router.post('/', async (req, res) => {
  res.json({ message: 'Dummy adat: itt a termék raktárba rendelésének végpontja.' })
})

export default router

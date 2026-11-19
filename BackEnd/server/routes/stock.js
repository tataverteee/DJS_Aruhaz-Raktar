import { Router } from 'express'

const router = Router()

router.get('/stock', async (req, res) => {
  res.json({ message: 'Sziamia' })
})

// server/routes/stock.js

router.get('/',          /* warehouse_stock_view */     async (req, res) => { 
   res.json({message: 'itt a dummy adat, itt termékek jelennek meg'})
})
router.post('/movein',  /* goods_receipt_create */     async (req, res) => {  
  res.json({message: 'itt a dummy adat, itt a árúá  átvét végponja'})

})
router.post('/moveout',    /* goods_issue_create */       async (req, res) => {  
  res.json({message: 'itt a dummy adat, itt árúkiadás végpontja'})
})
router.post('/movement', /* goods_movement_create */    async (req, res) => {  
  res.json({message: 'itt a dummy adat, itt a raktárkészlet mozgatásának végpontja'})
})




export default router



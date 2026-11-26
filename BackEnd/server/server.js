import express from 'express'
import cors from 'cors' // engedi, hogy a frontend (másik port) hívhassa a backendet
import sequelize from './db.js' // adatbázis-kapcsolat
import User from './models/User.js' // felhasználó modell (users tábla)

// Témánkénti route-ok (külön fájlokban)
import stockRouter from './routes/stock.js'
import itemsRouter from './routes/items.js'
import purchaseRouter from './routes/purchase.js'

const app = express()

app.use(cors()) // minden origin-t engedélyez (fejlesztéshez)
app.use(express.json()) // a JSON kérés törzsét beolvassa a req.body-ba

// Bejelentkezés: ha van ilyen username + password páros, visszaadja a felhasználót
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({
    where: { username, password },
    attributes: ['userId', 'username'], // a jelszót nem küldjük vissza
  })
  if (!user) return res.status(401).json({ error: 'Hibás felhasználónév vagy jelszó.' })
  res.json({ user })
})

// Az /api/stock, /api/items és /api/purchase alatti kéréseket a saját router kezeli
app.use('/api/stock', stockRouter)
app.use('/api/items', itemsRouter)
app.use('/api/purchase', purchaseRouter)

// Létrehozza a táblákat, ha még nincsenek
await sequelize.sync()

// Alap admin felhasználó (csak akkor jön létre, ha még nincs)
await User.findOrCreate({ where: { username: 'admin' }, defaults: { password: 'admin' } })

// Szerver indítása a 3000-es porton
app.listen(3000)
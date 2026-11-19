import express from 'express'
import sequelize from './db.js'
import User from './models/User.js'

import requestRouter from './routes/stock.js'




const app = express()
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body ?? {}
  if (!username || !password) {
    return res.status(400).json({ error: 'Add meg a felhasználónevet és a jelszót.' })
  }
  const user = await User.findOne({
    where: { username, password },
    attributes: ['userId', 'username'],
  })
  if (!user) return res.status(401).json({ error: 'Hibás felhasználónév vagy jelszó.' })
  res.json({ ok: true, user })
})

app.get('/api/login/users', async (req, res) => {
  const users = await User.findAll({ attributes: ['userId', 'username', 'password'], order: [['userId', 'ASC']] })
  res.json(users)
})



app.use('/api/request', requestRouter)





app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'internal server error' })
})

// Create the table if it's missing, add the admin user, then start the server
await sequelize.sync()
await User.findOrCreate({ where: { username: 'admin' }, defaults: { password: 'admin' } })

app.listen(3000, () => console.log('Server running on http://localhost:3000'))
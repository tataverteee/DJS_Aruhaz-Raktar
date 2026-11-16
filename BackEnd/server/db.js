import { Sequelize } from 'sequelize'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database', 'database.sqlite'),
  logging: false, // set to console.log to see the generated SQL
})

export default sequelize
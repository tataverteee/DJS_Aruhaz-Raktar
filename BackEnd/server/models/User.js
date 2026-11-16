import { DataTypes } from 'sequelize'
import sequelize from '../db.js'

const User = sequelize.define('User', {
  userId:   { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'users',  // use the existing "users" table
  timestamps: false,   // no createdAt / updatedAt columns
})

export default User
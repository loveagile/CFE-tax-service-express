import mongoose from 'mongoose'
import { hash } from 'bcrypt'

import User from '../models/User.js'
import config from './index.js'

const CONNECTION_URL = `mongodb://${config.db.url}/${config.db.name}`

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
  console.log('Mongo has connected succesfully')
})
mongoose.connection.on('reconnected', () => {
  console.log('Mongo has reconnected')
})
mongoose.connection.on('error', error => {
  console.log('Mongo connection has an error', error)
  mongoose.disconnect()
})
mongoose.connection.on('disconnected', () => {
  console.log('Mongo connection is disconnected')
})

const hashedPassword = await hash('123456', 10)
const seedAdmin = new User({
  firstname: 'Kaori',
  lastname: 'Sato',
  username: 'admin',
  email: 'smart.henry327@gmail.com',
  role: 'admin',
  activated: true,
  password: hashedPassword,
})

const seedDB = async () => {
  const admin = await User.findOne({ username: seedAdmin.username })
  if (admin) return
  await seedAdmin.save()
}

seedDB()

import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'

import config from '../config/index.js'
import User from '../models/User.js'

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username: username })
    const isComparedPassword = await compare(password, user.password)
    if (!isComparedPassword) return res.status(401).json({ success: false, error: "Unauthorized" })
    const token = createToken(user)
    res.status(200).json({ data: user, message: 'login', token: token })
  } catch (error) {
    next(error)
  }
}

const createToken = (user) => {
  const dataStoredInToken = { _id: user._id }
  const expiresIn = 60 * 60
  const secretKey = config.SECRET_KEY

  return { expiresIn, token: jwt.sign(dataStoredInToken, secretKey, { expiresIn }) }
}

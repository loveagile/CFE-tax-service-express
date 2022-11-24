import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'

import config from '../config/index.js'
import User from '../models/User.js'

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username: username })
    const isComparedPassword = await compare(password, user && user.password)
    if (!isComparedPassword)
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    const token = createToken(user)
    return res.status(200).json({ data: user, message: 'login', token: token })
  } catch (error) {
    next(error)
  }
}

const createToken = (user) => {
  const dataStoredInToken = { _id: user._id, role: user.role }
  const expiresIn = 86400 * 7
  const secretKey = config.SECRET_KEY

  return {
    expiresIn,
    token: jwt.sign(dataStoredInToken, secretKey, { expiresIn }),
  }
}

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id })
    return res.status(200).json({ user })
  } catch (error) {
    next(error)
  }
}

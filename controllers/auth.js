import { compare, hash } from 'bcrypt'
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

export const setAccount = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id })
    if (!user) {
      return res.status(500).json({ success: false })
    }
    const data = req.body
    if (data.password && data.confirm) {
      data.password = await hash(data.password, 10)
    }
    Object.assign(user, data)
    user.save()
    return res.status(200).json({ success: true, user: user })
  } catch (error) {
    next(error)
  }
}

export const forgotPassword = async (req, res, next) => {
  try {
    const { type, param } = req.body
    let user
    if (type === 'email') {
      user = await User.findOne({ email: param })
    } else {
      user = await User.findOne({ IDNumber: param })
    }
    if (!user) {
      return res.status(403).json({ success: false })
    }
    const token = createToken(user)
    return res
      .status(200)
      .json({
        link: `${config.CLIENT_URL}/reset/${token.token}`,
        email: user?.email,
      })
  } catch (error) {
    next(error)
  }
}

export const getUserByToken = async (req, res, next) => {
  try {
    const { token } = req.params

    jwt.verify(token, config.SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ success: false, message: err })
      return res.status(200).json({ success: true, user })
    })
  } catch (error) {
    next(error)
  }
}

export const updatePassword = async (req, res, next) => {
  try {
    const { password } = req.body
    const user = await User.findOne({ _id: req.params?._id })
    if (!user) {
      return res.status(500).json({ success: false })
    }
    const hashedPassword = await hash(password, 10)
    Object.assign(user, { password: hashedPassword })
    user.save()
    return res.status(200).json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

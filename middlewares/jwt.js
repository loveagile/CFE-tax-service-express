import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'
import config from '../config/index.js'

export const encode = async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await UserModel.getUserById(userId)
    const payload = {
      userId: user._id,
      role: user.role,
    }
    const authToken = jwt.sign(payload, config.SECRET_KEY, { expiresIn: 86400 })
    req.authToken = authToken
    next()
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message })
  }
}

export const decode = async (req, res, next) => {
  if (!req.headers['authorization']) {
    return res.status(400).json({ success: false, message: 'No access token provided!' })
  }
  const accessToken = req.headers.authorization.split(' ')[1]
  try {
    jwt.verify(accessToken, config.SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ success: false, message: err })
      req.user = user
      return next()
    })
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message })
  }
}

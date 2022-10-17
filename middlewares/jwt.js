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
    const authToken = jwt.sign(payload, config.SECRET_KEY)
    req.authToken = authToken
    next()
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message })
  }
}

export const decode = (req, res, next) => {
  if (!req.headers['authorization']) {
    return res.status(400).json({ success: false, message: 'No access token provided!' })
  }
  const accessToken = req.headers.authorization.split(' ')[1]
  try {
    const decoded = jwt.verify(accessToken, SECRET_KEY)
    req.userId = decoded.userId
    req.role = decoded.type
    return next()
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message })
  }
}

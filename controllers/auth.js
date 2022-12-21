import { compare, hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

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
    const { email, userid } = req.body
    const user = await User.findOne({ email: email, IDNumber: userid })
    if (!user) {
      return res.status(403).json({ success: false })
    }
    const token = createToken(user)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: user.email,
      subject: 'Link to reset password',
      text: `You can reset the password using the following link.\n
      http://localhost:3000/reset/${token.token}`,
    }
    console.log('sending email')
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        next(err)
      } else {
        console.log('response', response)
        return res.status(200).json('Recovery email sent')
      }
    })
  } catch (error) {
    next(error)
  }
}

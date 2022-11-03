import mongoose from 'mongoose'

import Message from '../models/Message.js'
import User from '../models/User.js'

export const getAllMessages = async (req, res, next) => {
  const sender = req.user?._id
  let receiver = req.params?.id || ''
  if (receiver === '' && req.user?.role !== 'admin') {
    const admin = await User.findOne({ username: 'admin' })
    receiver = admin._id
  }
  try {
    let messages = []
    if (receiver) {
      messages = await Message.find({
        $expr: {
          $and: [
            {
              $or: [
                { sender: new mongoose.Types.ObjectId(sender) },
                { receiver: new mongoose.Types.ObjectId(sender) },
              ],
            },
            {
              $or: [
                { sender: new mongoose.Types.ObjectId(receiver) },
                { receiver: new mongoose.Types.ObjectId(receiver) },
              ],
            },
          ],
        },
      })
    } else {
      messages = await Message.find({
        $expr: {
          $or: [
            { sender: new mongoose.Types.ObjectId(sender) },
            { receiver: new mongoose.Types.ObjectId(sender) },
          ],
        },
      })
    }
    return res.status(200).json({ success: true, messages })
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
}

export const addMessage = async (data, req) => {
  const message = data
  if (!message?.receiver) {
    const admin = await User.findOne({ username: 'admin' })
    Object.assign(message, { receiver: admin._id })
  }

  try {
    const newMessage = await new Message(message).save()
    return newMessage
  } catch (error) {
    return error
  }
}

export const createMessage = async (req, res, next) => {
  const message = req.body
  Object.assign(message, { sender: req.user._id })
  if (req.user?.role !== 'admin') {
    const admin = await User.findOne({ username: 'admin' })
    Object.assign(message, { receiver: admin._id })
  }

  try {
    const newMessage = await new Message(message).save()
    return res.status(200).json({ message: newMessage })
  } catch (error) {
    next(error)
  }
}

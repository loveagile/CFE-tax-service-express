import mongoose from 'mongoose'

import File from '../models/File.js'

export const getFiles = async (req, res, next) => {
  try {
    const user = req.user
    const files = await File.find({ from: new mongoose.Types.ObjectId(user.userId) })
    return res.status(200).json({ files })
  } catch (error) {
    next(error)
  }
}

export const getFilesByUserId = async (req, res, next) => {
  try {
    const userId = req.params.id

    const files = await File.find({ from: new mongoose.Types.ObjectId(userId) })
    return res.status(200).json({ files })
  } catch (error) {
    next(error)
  }
}

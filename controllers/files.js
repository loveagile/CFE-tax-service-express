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

export const uploadFiles = async (req, res, next) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: 'No file upload' })
    }
    const user = req.user.id
    const { files } = req.files

    Promise.all(files.map(async (file) => {
      file.mv('./public/uploads/' + file.name)
      const data = new File({
        name: file.name,
        type: file.type,
        size: file.size,
        uploaded_at: new Date(),
        from: user,
        to: req.body.preparer,
        category_id: req.body.category_id,
      })
      const newFile = await data.save()
      return newFile
    })).then(values => {
      return res.status(200).json({ success: true, files: values })
    }).catch(error => {
      return res.status(500).json({ success: false, error: error })
    })
  } catch (error) {
    next(error)
  }
}

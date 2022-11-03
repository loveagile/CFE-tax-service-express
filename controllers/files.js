import mongoose from 'mongoose'

import File from '../models/File.js'
import Category from '../models/Category.js'
import User from '../models/User.js'

const getFiles = async (id) => {
  try {
    return await Category.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'files',
          let: {
            categoryId: '$_id',
            user_id: '$owner',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    {
                      $toObjectId: '$category_id',
                    },
                    '$$categoryId',
                  ],
                },
              },
            },
          ],
          as: 'files',
        },
      },
    ]).exec()
  } catch (error) {
    return error
  }
}

export const getAllFiles = async (req, res, next) => {
  try {
    let from = req.params.id || req.user._id
    const filesByFrom = await getFiles(from)
    if (from.role === 'admin') {
      return res
        .status(200)
        .json({ success: true, filesByFrom, filesByTo: filesByFrom })
    }
    const admin = await User.findOne({ username: 'admin' })
    const filesByTo = await getFiles(admin._id)

    return res.status(200).json({ success: true, filesByFrom, filesByTo })
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
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
    const { category, userId } = req.body
    const { files } = req.files
    const list = []
    if (files.length) {
      for (let i = 0; i < files.length; i++) list.push(files[i])
    } else {
      list.push(files)
    }
    Promise.all(
      list.map(async (file) => {
        file.mv('./public/uploads/' + file.name)
        const data = new File({
          name: file.name,
          type: file.type,
          size: file.size,
          uploaded_at: new Date(),
          from: user,
          to: mongoose.Types.ObjectId(userId),
          category_id: category,
        })
        const newFile = await data.save()
        return newFile
      })
    )
      .then((values) => {
        return res.status(200).json({ success: true, files: values })
      })
      .catch((error) => {
        return res.status(500).json({ success: false, error: error })
      })
  } catch (error) {
    next(error)
  }
}

export const downloadFile = (req, res, next) => {
  const { filename } = req.params
  try {
    const file = `${process.cwd()}/public/uploads/${filename}`
    return res.download(file)
  } catch (err) {
    res.status(500).json({ success: false, error: err })
  }
}

export const deleteFile = async (req, res, next) => {
  try {
    const file = await File.findOne({ _id: req.params.id })
    await file.delete()
    return res.status(204).json({ success: true })
  } catch (error) {
    return res.status(500).json({ success: false })
  }
}

import mongoose from 'mongoose'

import Category from '../models/Category.js'
import User from '../models/User.js'

export const onCreateCategory = async (req, res) => {
  try {
    let owner = req.user._id,
      to = ''
    if (req.user.role === 'user') {
      const admin = await User.findOne({ username: 'admin' })
      to = admin._id
    } else if (req.body.to) {
      to = req.body.to
    }
    const category = await Category.findOne({
      owner: owner,
      name: req.body.category,
      to: to,
    })
    if (category) {
      return res
        .status(422)
        .json({ success: false, error: 'The category is exist.' })
    }
    const newCategory = new Category({
      name: req.body.category,
      owner: new mongoose.Types.ObjectId(owner),
      to: new mongoose.Types.ObjectId(to),
    })
    const savedCategory = await newCategory.save()
    return res.status(201).json({ success: true, category: savedCategory })
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
}

export const onGetCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id })
    return res.status(200).json({ success: true, category })
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
}

export const onGetAllCategories = async (req, res) => {
  try {
    let owner = req.params.id || req.user._id

    Category.aggregate(
      [
        {
          $match: {
            owner: new mongoose.Types.ObjectId(owner),
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
      ],
      function (err, categories) {
        if (err) return res.status(500).json({ success: false, err })
        return res.status(200).json({ success: true, categories })
      }
    )
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
}

export const onUpdateCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id })
    const updatedCategory = req.body
    Object.assign(category, updatedCategory)
    if (req.user.role !== 'admin' && req.user.id !== category.owner) {
      return res.status(403).json({ success: false, error: 'Not authrization' })
    }
    category.save()
    return res.status(200).json({ success: true, category })
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
}

export const onDeleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id })
    if (req.user.role !== 'admin' && req.user.id !== category.owner) {
      return res.status(403).json({ success: false, error: 'Not authrization' })
    }
    const deletedCategory = await category.delete()
    return res.status(204).json({ success: true })
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
}

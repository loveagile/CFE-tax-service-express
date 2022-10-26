import makeValidation from '@withvoid/make-validation'
import { hash } from 'bcrypt'

import User from '../models/User.js'

export const onCreateUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: "Not authrization" })
    }
    const validation = makeValidation(types => ({
      payload: req.body,
      checks: {
        username: {
          type: types.string,
          options: { unique: true, empty: false }
        }
      }
    }))
    if (!validation.success)
      return res.status(422).json(validation)
    const { username } = req.body
    const user = await User.findOne({ username })
    if (user) {
      return res.status(422).json({ success: false, error: "The user is exist." })
    }
    const newUser = new User(req.body)
    if (newUser.password) {
      newUser.password = await hash(req.body.password, 10)
    }
    const savedUser = await newUser.save()
    return res.status(201).json({ success: true, savedUser })
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
}

export const onGetUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id })
    return res.status(200).json({ success: true, user })
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
}

export const onGetAllUsers = async (req, res) => {
  try {
    const user = req.user
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'You are not authorized' })
    }
    const users = await User.find({ _id: { $ne: user._id } })
    return res.status(200).json({ success: true, users })
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
}

export const onUpdateUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id })
    const updatedUser = req.body
    if (req.body.password) {
      updatedUser.password = await hash(updatedUser.password, 10)
    }
    Object.assign(user, updatedUser)
    user.save()

    return res.status(200).json({ success: true, user })
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
}

export const onDeleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id })
    const deletedUser = await user.delete()
    return res.status(204).json({ success: true, deletedUser })
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
}
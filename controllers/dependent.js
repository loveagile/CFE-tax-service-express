import mongoose from 'mongoose'

import Dependent from '../models/Dependent.js'

export const getDependents = async (req, res, next) => {
  const user_id = req.user?._id
  if (!user_id) {
    return res.status(500).json({ success: false })
  }
  try {
    const dependents = await Dependent.find({ user_id })
    return res.status(200).json({ success: true, dependents })
  } catch (error) {
    return res.status(500).json({ success: false, error })
  }
}

export const addDependent = async (req, res, next) => {
  try {
    const user_id = req.user?._id
    const dependent = req.body
    Object.assign(dependent, { user_id })
    const newDependent = await new Dependent(dependent).save()
    return res.status(200).json({ success: true, dependent: newDependent })
  } catch (error) {
    next(error)
  }
}

export const editDependent = async (req, res, next) => {
  try {
    const dependent_id = req.params?.id
    let dependent = await Dependent.findOne({ _id: dependent_id })
    if (dependent) {
      Object.assign(dependent, req.body)
      dependent.save()
      return res.status(200).json({ success: true, dependent })
    } else {
      return res.status(500).json({ success: false })
    }
  } catch (error) {
    next(error)
  }
}

export const deleteDependent = async (req, res, next) => {
  try {
    const dependent_id = req.params?.id
    const dependent = await Dependent.findOne({ _id: dependent_id })
    await dependent.delete()
    return res.status(204).json({ success: true })
  } catch (error) {
    return res.status(500).json({ success: false })
  }
}

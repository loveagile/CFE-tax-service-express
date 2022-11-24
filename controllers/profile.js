import mongoose from 'mongoose'

import Profile from '../models/Profile.js'

export const getProfile = async (req, res, next) => {
  const user_id = req.user?._id
  if (user_id === '') {
    return res.status(500).json({ success: false })
  }
  try {
    const profile = await Profile.findOne({ user_id: user_id })
    return res.status(200).json({ success: true, profile })
  } catch (error) {
    return res.status(500).json({ success: false, error })
  }
}

export const addProfile = async (req, res, next) => {
  try {
    const user_id = req.user?._id
    let profile = await Profile.findOne({ user_id })
    if (profile) {
      Object.assign(profile, req.body)
      profile.save()
      return res.status(200).json({ success: true, profile })
    } else {
      profile = req.body
      Object.assign(profile, { user_id: req.user?._id })
      const newProfile = await new Profile(profile).save()
      return res.status(200).json({ success: true, profile: newProfile })
    }
  } catch (error) {
    next(error)
  }
}

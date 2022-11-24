import express from 'express'

import { getProfile, addProfile } from '../controllers/profile.js'
import { decode } from '../middlewares/jwt.js'

const router = express.Router()

router.get('/', decode, getProfile)
router.post('/', decode, addProfile)

export default router

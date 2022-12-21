import express from 'express'

import {
  login,
  getCurrentUser,
  setAccount,
  forgotPassword,
} from '../controllers/auth.js'
import { decode } from '../middlewares/jwt.js'

const router = express.Router()

router.post('/login', login)
router.get('/currentuser', decode, getCurrentUser)
router.put('/account', decode, setAccount)
router.post('/forgotpassword', forgotPassword)

export default router

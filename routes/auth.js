import express from 'express'

import {
  login,
  getCurrentUser,
  setAccount,
  forgotPassword,
  getUserByToken,
  updatePassword,
} from '../controllers/auth.js'
import { decode } from '../middlewares/jwt.js'

const router = express.Router()

router.post('/login', login)
router.get('/currentuser', decode, getCurrentUser)
router.put('/account', decode, setAccount)
router.post('/forgotpassword', forgotPassword)
router.get('/reset/:token', getUserByToken)
router.put('/updatepassword/:_id', updatePassword)

export default router

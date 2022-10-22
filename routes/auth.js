import express from 'express'

import { login, getCurrentUser } from '../controllers/auth.js'
import { decode } from '../middlewares/jwt.js'

const router = express.Router()

router.post('/login', login)
router.get('/currentuser', decode, getCurrentUser)

export default router

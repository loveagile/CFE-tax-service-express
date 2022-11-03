import express from 'express'

import { getAllMessages, createMessage } from '../controllers/message.js'
import { decode } from '../middlewares/jwt.js'

const router = express.Router()
router.get('/:id', decode, getAllMessages)
router.get('/', decode, getAllMessages)
router.post('/', decode, createMessage)

export default router

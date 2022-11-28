import express from 'express'

import {
  getAllMessages,
  createMessage,
  createMessageWithAdmin,
} from '../controllers/message.js'
import { decode } from '../middlewares/jwt.js'

const router = express.Router()
router.get('/:id', decode, getAllMessages)
router.get('/', decode, getAllMessages)
router.post('/:id', decode, createMessage)
router.post('/', decode, createMessageWithAdmin)

export default router

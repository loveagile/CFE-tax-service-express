import express from 'express'

import { getFiles, getFilesByUserId } from '../controllers/files.js'
import { decode } from '../middlewares/jwt.js'

const router = express.Router()
router.get('/', decode, getFiles)
router.get('/:id', decode, getFilesByUserId)

export default router

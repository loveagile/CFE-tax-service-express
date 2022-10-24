import express from 'express'

import { getFiles, getFilesByUserId, uploadFiles } from '../controllers/files.js'
import { decode } from '../middlewares/jwt.js'

const router = express.Router()
router.get('/', decode, getFiles)
router.get('/:id', decode, getFilesByUserId)
router.post('/', decode, uploadFiles)

export default router

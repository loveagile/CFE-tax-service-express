import express from 'express'

import { getFilesByUserId, uploadFiles, downloadFile } from '../controllers/files.js'
import { onGetAllCategories } from '../controllers/category.js'
import { decode } from '../middlewares/jwt.js'

const router = express.Router()
router.get('/download/:filename', decode, downloadFile)
router.get('/:id', decode, getFilesByUserId)
router.get('/', decode, onGetAllCategories)
router.post('/', decode, uploadFiles)

export default router

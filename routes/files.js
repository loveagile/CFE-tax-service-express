import express from 'express'

import {
  getAllFiles,
  uploadFiles,
  downloadFile,
  deleteFile,
} from '../controllers/files.js'
import { decode } from '../middlewares/jwt.js'

const router = express.Router()
router.get('/download/:filename', decode, downloadFile)
router.get('/:id', decode, getAllFiles)
router.get('/', decode, getAllFiles)
router.post('/', decode, uploadFiles)
router.delete('/:id', decode, deleteFile)

export default router

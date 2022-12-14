import express from 'express'

import {
  onCreateCategory,
  onGetAllCategories,
  onGetCategory,
  onUpdateCategory,
  onDeleteCategory
} from '../controllers/category.js'
import { decode } from '../middlewares/jwt.js'

const router = express.Router()
router.get('/all/:id', decode, onGetAllCategories)
router.get('/:id', decode, onGetCategory)
router.get('/', decode, onGetAllCategories)
router.post('/', decode, onCreateCategory)
router.put('/:id', decode, onUpdateCategory)
router.delete('/:id', decode, onDeleteCategory)

export default router

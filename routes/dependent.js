import express from 'express'

import {
  getDependents,
  addDependent,
  editDependent,
  deleteDependent,
} from '../controllers/dependent.js'
import { decode } from '../middlewares/jwt.js'

const router = express.Router()
router.get('/', decode, getDependents)
router.post('/', decode, addDependent)
router.put('/:id', decode, editDependent)
router.delete('/:id', decode, deleteDependent)

export default router

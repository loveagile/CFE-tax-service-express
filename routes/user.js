import express from 'express'

import { onCreateUser, onGetAllUsers, onGetUserById, onUpdateUser, onDeleteUser } from '../controllers/user.js'
import { decode } from '../middlewares/jwt.js'

const router = express.Router()
router.get('/', decode, onGetAllUsers)
router.get('/:id', decode, onGetUserById)
router.post('/', decode, onCreateUser)
router.put('/:id', decode, onUpdateUser)
router.delete('/:id', decode, onDeleteUser)

export default router

const express = require('express')
const { createUser, loginUser, refreshTokenUser, logoutUser, getUser, updatePasswordUser, updateUser, deleteUser } = require('../../resolvers/user')
const { isAdmin, isUser } = require('../../middlewares')

const router = express.Router()

router.post('/register', isAdmin, createUser)
router.post('/login', loginUser)
router.get('/', isUser, getUser)
router.get('/refresh-token', isUser, refreshTokenUser)
router.put('/reset-password', isUser, updatePasswordUser)
router.put('/', isUser, updateUser)
router.delete('/:id', isAdmin, deleteUser)
router.delete('/logout', logoutUser)

module.exports = router
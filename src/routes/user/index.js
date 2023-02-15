const express = require('express')
const { createUser, loginUser, refreshTokenUser, logoutUser, getUser, getsUser, updatePasswordUser, updateUser, deleteUser } = require('../../resolvers/user')
const { isAdmin, isUser } = require('../../middlewares')

const router = express.Router()

router.post('/register', isAdmin, createUser)
router.post('/login', loginUser)
router.get('/', isUser, getUser)
router.get('/get/', isAdmin, getsUser)
router.get('/refresh-token', isUser, refreshTokenUser)
router.put('/reset-password', isUser, updatePasswordUser)
router.put('/', isUser, updateUser)
router.delete('/logout/', logoutUser)
router.delete('/:id', isAdmin, deleteUser)

module.exports = router
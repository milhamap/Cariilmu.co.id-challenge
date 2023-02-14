const express = require('express')
const { register, login, refreshToken, logout, getUser } = require('../../resolvers/admin')
const { isAdmin } = require('../../middlewares')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/', isAdmin, getUser)
router.get('/refresh-token', isAdmin, refreshToken)
router.delete('/logout', logout)

module.exports = router
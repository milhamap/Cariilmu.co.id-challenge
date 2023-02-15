const express = require('express')
const { createUserCourse, updateUserCourse, getsUserCourse, getUserCourse, getDetailUserCourse, deleteUserCourse } = require('../../resolvers/user_course')
const { verifyToken, isAdmin, isUser } = require('../../middlewares')

const router = express.Router()

router.post('/', isAdmin, createUserCourse)
router.put('/:id', isAdmin, updateUserCourse)
router.get('/', isAdmin, getsUserCourse)
router.get('/:id', verifyToken, getDetailUserCourse)
router.get('/get/', isUser, getUserCourse)
router.delete('/:id', isAdmin, deleteUserCourse)

module.exports = router
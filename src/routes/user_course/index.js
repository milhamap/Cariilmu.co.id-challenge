const express = require('express')
const { createUserCourse, updateUserCourse, getsUserCourse, getUserCourse, deleteUserCourse } = require('../../resolvers/user_course')
const { isAdmin, isUser } = require('../../middlewares')

const router = express.Router()

router.post('/', isAdmin, createUserCourse)
router.put('/:id', isAdmin, updateUserCourse)
router.get('/', isAdmin, getsUserCourse)
router.get('/:id', isUser, getUserCourse)
router.delete('/:id', isAdmin, deleteUserCourse)

module.exports = router
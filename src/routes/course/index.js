const express = require('express')
const { createCourse, updateCourse, getsCourse, getCourse, deleteCourse } = require('../../resolvers/course')
const { verifyToken, isAdmin } = require('../../middlewares')

const router = express.Router()

router.post('/', isAdmin, createCourse)
router.put('/:id', isAdmin, updateCourse)
router.get('/', verifyToken, getsCourse)
router.get('/:id', verifyToken, getCourse)
router.delete('/:id', isAdmin, deleteCourse)

module.exports = router
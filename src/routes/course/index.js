const express = require('express')
const { createCourse, updateCourse, getsCourse, getCourse, deleteCourse } = require('../../resolvers/course')
const { verifyToken } = require('../../middlewares')

const router = express.Router()

router.post('/', verifyToken, createCourse)
router.put('/:id', verifyToken, updateCourse)
router.get('/', verifyToken, getsCourse)
router.get('/:id', verifyToken, getCourse)
router.delete('/:id', verifyToken, deleteCourse)

module.exports = router
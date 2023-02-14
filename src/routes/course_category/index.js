const express = require('express')
const { createCourseCategory, updateCourseCategory, getsCourseCategory, getCourseCategory, deleteCourseCategory } = require('../../resolvers/course_category')
const { verifyToken } = require('../../middlewares')

const router = express.Router()

router.post('/', verifyToken, createCourseCategory)
router.put('/:id', verifyToken, updateCourseCategory)
router.get('/', verifyToken, getsCourseCategory)
router.get('/:id', verifyToken, getCourseCategory)
router.delete('/:id', verifyToken, deleteCourseCategory)

module.exports = router
const express = require('express')
const { createCourseCategory, updateCourseCategory, getsCourseCategory, getCourseCategory, deleteCourseCategory } = require('../../resolvers/course_category')
const { verifyToken, isAdmin } = require('../../middlewares')

const router = express.Router()

router.post('/', isAdmin, createCourseCategory)
router.put('/:id', isAdmin, updateCourseCategory)
router.get('/', verifyToken, getsCourseCategory)
router.get('/:id', verifyToken, getCourseCategory)
router.delete('/:id', isAdmin, deleteCourseCategory)

module.exports = router
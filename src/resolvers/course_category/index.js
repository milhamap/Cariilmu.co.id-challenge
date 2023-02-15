const knex = require('../../databases')
const { check, validationResult } = require('express-validator');
const { promise } = require('bcrypt/promises');

module.exports = {
    createCourseCategory: async (req, res) => {
        try {
            const name = req.body.name;
            await check('name').isString().notEmpty().run(req)
            const result = validationResult(req)
            if (!result.isEmpty()) return res.status(400).json({errors: result.array()})
            const cc = await knex('course_categories').insert({
                name: name
            })
            if (cc.length == 0) return res.status(400).json({message: 'Failed Create Course Category'})
            res.status(200).json({
                message: "Success Create Course Category",
                data: {
                    id: cc[0],
                    name
                }
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            })
        }
    },
    updateCourseCategory: async (req, res) => {
        try {
            const name = req.body.name
            const id = req.params.id
            await check('name').isString().notEmpty().run(req)
            const result = validationResult(req)
            if (!result.isEmpty()) return res.status(400).json({errors: result.array()})
            const pc = await knex('course_categories').where('id', id).update({
                name
            })
            if (pc == 0) return res.status(400).json({message: 'Course Category not found'})
            res.status(200).json({
                message: 'Success Update Course Category'
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    getsCourseCategory: async (req, res) => {
        const data = await knex('course_categories')
        if (data.length == 0) return res.status(400).json({message: 'Course Category is empty'})
        res.status(200).json({
            message: 'Success Get All Course Category',
            data
        })
    },
    getCourseCategory: async (req, res) => {
        const id = req.params.id
        const data = await knex('course_categories').where('id', id).first()
        if (!data) return res.status(400).json({message: 'Course Category not found'})
        res.status(200).json({
            message: 'Success Get Course Category',
            data
        })
    },
    deleteCourseCategory: async (req, res) => {
        const id = req.params.id
        const courses = await knex('courses').where('course_category_id', id)
        console.log(courses)
        if (courses) {
            Promise.all(courses.map(async (course) => {
                if (await knex('user_courses').where('course_id', course.id)) {
                    console.log(course.id)
                    await knex('user_courses').where('course_id', course.id).del()
                }
            }))
            console.log('Hello')
            await knex('courses').where('course_category_id', id).del() 
        } 
        const data = await knex('course_categories').where('id', id).del()
        if (data == 0) return res.status(400).json({message: 'Course Category not found'})
        res.status(200).json({
            message: 'Success Delete Course Category'
        })
    }
}
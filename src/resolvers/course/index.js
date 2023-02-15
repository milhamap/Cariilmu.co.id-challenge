const knex = require('../../databases')
const { check, validationResult } = require('express-validator')

module.exports = {
    createCourse: async (req, res) => {
        try {
            const { title, course_category_id } = req.body;
            await check('title').isString().notEmpty().run(req)
            await check('course_category_id').isInt().notEmpty().run(req)
            const result = validationResult(req)
            if (!result.isEmpty()) return res.status(400).json({errors: result.array()})
            const cc = await knex('courses').insert({
                title,
                course_category_id
            })
            if (cc.length == 0) return res.status(400).json({message: 'Failed Create Course'})
            res.status(200).json({
                message: "Success Create Course",
                data: {
                    id: cc[0],
                    title,
                    course_category_id
                }
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            })
        }
    },
    updateCourse: async (req, res) => {
        try {
            const { title, course_category_id } = req.body
            const id = req.params.id
            await check('title').isString().notEmpty().run(req)
            await check('course_category_id').isInt().notEmpty().run(req)
            const result = validationResult(req)
            if (!result.isEmpty()) return res.status(400).json({errors: result.array()})
            const pc = await knex('courses').where('id', id).update({
                title,
                course_category_id
            })
            if (pc == 0) return res.status(400).json({message: 'Course not found'})
            res.status(200).json({
                message: 'Success Update Course'
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    getsCourse: async (req, res) => {
        const data = await knex({c: 'courses'}).join({cc: 'course_categories'}, 'c.course_category_id', 'cc.id').select('c.id', 'c.title', 'cc.name as course_category', 'c.course_category_id')
        if (data.length == 0) return res.status(400).json({message: 'Course is empty'})
        res.status(200).json({
            message: 'Success Get All Course',
            data
        })
    },
    getCourse: async (req, res) => {
        const id = req.params.id
        const data = await knex({c: 'courses'}).join({cc: 'course_categories'}, 'c.course_category_id', 'cc.id').where('c.id', id).select('c.id', 'c.title', 'cc.name as course_category', 'c.course_category_id').first()
        if (!data) return res.status(400).json({message: 'Course not found'})
        res.status(200).json({
            message: 'Success Get Course',
            data
        })
    },
    deleteCourse: async (req, res) => {
        const id = req.params.id
        const user_course = await knex('user_courses').where('course_id', id)
        if (user_course) {
            user_course.map(async (uc) => {
                await knex('user_courses').where('id', uc.id).del()
            })
        }
        const data = await knex('courses').where('id', id).del()
        if (data == 0) return res.status(400).json({message: 'Course not found'})
        res.status(200).json({
            message: 'Success Delete Course'
        })
    }
}
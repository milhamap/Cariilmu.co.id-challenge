const knex = require('../../databases')
const { check, validationResult } = require('express-validator')

module.exports = {
    createUserCourse: async (req, res) => {
        try {
            const { user_id, course_id } = req.body
            await check('user_id').isInt().notEmpty().run(req)
            await check('course_id').isInt().notEmpty().run(req)
            const result = validationResult(req)
            if (!result.isEmpty()) return res.status(400).json({ errors: result.array() })
            const uc = await knex('user_courses').insert({
                user_id,
                course_id
            })
            if (uc.length == 0) return res.status(400).json({ message: 'Failed Create User Course' })
            res.status(200).json({
                message: "Success Create User Course",
                data: {
                    id: uc[0],
                    user_id,
                    course_id
                }
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    updateUserCourse: async (req, res) => {
        try {
            const { user_id, course_id } = req.body
            const id = req.params.id
            await check('user_id').isInt().notEmpty().run(req)
            await check('course_id').isInt().notEmpty().run(req)
            const result = validationResult(req)
            if (!result.isEmpty()) return res.status(400).json({ errors: result.array() })
            const uc = await knex('user_courses').where('id', id).update({
                user_id,
                course_id
            })
            if (uc == 0) return res.status(400).json({ message: 'User Course not found' })
            res.status(200).json({
                message: 'Success Update User Course'
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    getsUserCourse: async (req, res) => {
        const data = await knex({uc: 'user_courses'}).join({u: 'users'}, 'uc.user_id', 'u.id').join({c: 'courses'}, 'uc.course_id', 'c.id').select('uc.id', 'u.name as user', 'uc.user_id', 'c.title as course', 'uc.course_id')
        if (data.length == 0) return res.status(400).json({ message: 'User Course is empty' })
        res.status(200).json({
            message: 'Success Get All User Course',
            data
        })
    },
    getUserCourse: async (req, res) => {
        const data = await knex({uc: 'user_courses'}).join({u: 'users'}, 'uc.user_id', 'u.id').join({c: 'courses'}, 'uc.course_id', 'c.id').select('uc.id', 'u.name as user', 'uc.user_id', 'c.title as course', 'uc.course_id').where('uc.user_id', user.id).first()
        if (data.length == 0) return res.status(400).json({ message: 'User Course not found' })
        res.status(200).json({
            message: 'Success Get User Course',
            data
        })
    },
    deleteUserCourse: async (req, res) => {
        try {
            const id = req.params.id
            const dc = await knex('user_courses').where('id', id).del()
            if (dc == 0) return res.status(400).json({ message: 'User Course not found' })
            res.status(200).json({
                message: 'Success Delete User Course'
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }
}
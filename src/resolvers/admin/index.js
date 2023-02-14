const knex = require('../../databases')
const { createUserToken, createRefreshToken } = require('../../helpers/tokens')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    register: async (req, res) => {
        try {
            const { name, email, password, confirmPassword } = req.body
            await check('name').isString().notEmpty().run(req)
            await check('email').isEmail().notEmpty().matches(/.+\@.+\..+/).run(req)
            await check('password').exists().notEmpty().isLength({min: 8}).run(req)
            await check('confirmPassword').exists().notEmpty().isLength({min: 8}).run(req)
            const result = validationResult(req)
            if (!result.isEmpty()) return res.status(400).json({ errors: result.array() })
            if (password !== confirmPassword) return res.status(400).json({message: 'Email or Password not match'})
            if(await knex('admin').where('email', email).then(data => data.length) !== 0) return res.status(400).json({message: 'Email or Password not match'})
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password, salt)
            const data = await knex('admin').insert({
                name,
                email,
                password: hashedPassword
            })
            res.status(200).json({
                message: 'Register Success',
                id: data[0]
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            await check('email').isEmail().notEmpty().run(req)
            await check('password').isString().isLength({min: 8}).notEmpty().run(req)
            const result = validationResult(req)
            if (!result.isEmpty()) return res.status(400).json({errors: result.array()})
            const admin = await knex('admin').where('email', email).first()
            if (!admin) return res.status(400).json({message: 'Email or Password not match'})
            const validatedPassword = await bcrypt.compare(password, admin.password)
            if (!validatedPassword) return res.status(400).json({message: "Email or Password not match"})
            const token = createUserToken({
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: 'admin'
            })
            const refreshToken = createRefreshToken({
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: 'admin'
            })
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })
            res.status(200).json({
                message: 'Login Success',
                admin,
                token
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            })
        }
    },
    refreshToken: async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) return res.status(400).json({message: 'Refresh token not found'})
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.sendStatus(403)
                const token = createUserToken({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: 'admin'
                })
                res.status(200).json({
                    message: 'Refresh token success',
                    token
                })
            })            
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            })
        }
    },
    logout: async (req, res) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(204)
        res.clearCookie('refreshToken')
        res.status(200).json({message: 'Logout Success'})
    },
    getUser: async (req, res) => {
        const admin = await knex('admin').where('id', user.id).first()
        if (!admin) return res.status(400).json({message: "Data Admin not found"})
        res.status(200).json({
            message: 'Seccess Get Admin User',
            admin
        })
    }
}
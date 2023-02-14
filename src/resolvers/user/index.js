const knex = require('../../databases')
const { check, validationResult } = require('express-validator')

module.exports = {
    createUser: async (req, res) => {
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
            const data = await knex('users').insert({
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
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body
            await check('email').isEmail().notEmpty().run(req)
            await check('password').isString().isLength({min: 8}).notEmpty().run(req)
            const result = validationResult(req)
            if (!result.isEmpty()) return res.status(400).json({errors: result.array()})
            const user = await knex('users').where('email', email).first()
            if (!user) return res.status(400).json({message: 'Email or Password not match'})
            const validatedPassword = await bcrypt.compare(password, user.password)
            if (!validatedPassword) return res.status(400).json({message: "Email or Password not match"})
            const token = createUserToken({
                id: user.id,
                name: user.name,
                email: user.email,
                role: 'user'
            })
            const refreshToken = createRefreshToken({
                id: user.id,
                name: user.name,
                email: user.email,
                role: 'user'
            })
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })
            res.status(200).json({
                message: 'Login Success',
                user,
                token
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            })
        }
    },
    refreshTokenUser: async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) return res.status(400).json({message: 'Refresh token not found'})
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.sendStatus(403)
                const token = createUserToken({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: 'user'
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
    logoutUser: async (req, res) => {
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
    },
    getsUser: async (req, res) => {
        const users = await knex('users')
        if (!users) return res.status(400).json({message: "Data Users not found"})
        res.status(200).json({
            message: 'Seccess Get Users',
            users
        })
    },
    updatePasswordUser: async (req, res) => {
        try {
            const { password, newPassword, confirmPassword } = req.body
            await check('password').isString().isLength({min: 8}).notEmpty().run(req)
            await check('newPassword').isString().isLength({min: 8}).notEmpty().run(req)
            await check('confirmPassword').isString().isLength({min: 8}).notEmpty().run(req)
            const result = validationResult(req)
            if (!result.isEmpty()) return res.status(400).json({errors: result.array()})
            const u = await knex('users').where('id', user.id).first()
            if (!u) return res.status(400).json({message: 'User not found'})
            const validatedPassword = await bcrypt.compare(password, u.password)
            if (!validatedPassword) return res.status(400).json({message: 'Password not match'})
            if (newPassword !== confirmPassword) return res.status(400).json({message: 'Password not match'})
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(newPassword, salt)
            await knex('users').where('id', user.id).update({
                password: hashedPassword
            })
            res.status(200).json({message: 'Update Password Success'})
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            })
        }
    },
    updateUser: async (req, res) => {
        try {
            const { name, email } = req.body
            await check('name').isString().notEmpty().run(req)
            await check('email').isEmail().notEmpty().matches(/.+\@.+\..+/).run(req)
            const result = validationResult(req)
            if (!result.isEmpty()) return res.status(400).json({errors: result.array()})
            const u = await knex('users').where('id', user.id).first()
            if (!u) return res.status(400).json({message: 'User not found'})
            await knex('users').where('id', user.id).update({
                name,
                email
            })
            res.status(200).json({message: 'Update User Success'})
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            })
        }
    },
    deleteUser: async (req, res) => {
        try {
            const id = req.params.id
            const u = await knex('users').where('id', id).first()
            if (!u) return res.status(400).json({message: 'User not found'})
            await knex('users').where('id', id).del()
            res.status(200).json({message: 'Delete User Success'})
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            })
        }
    }
}
const jwt = require('jsonwebtoken')

module.exports = {
    verifyToken: (req, res, next) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.status(400).json({message: 'You must login first'})
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, enc) => {
            if (err) return res.sendStatus(403)
            user = enc
            next()
        })
    },
    isAdmin: (req, res, next) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.status(400).json({message: 'You must login first'})
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, enc) => {
            if (err) return res.sendStatus(403)
            if (user.role !== 'admin') return res.status(403).json({message: `You aren't admin`})
            user = enc
            next()
        })
    },
    isUser: (req, res, next) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.status(400).json({message: 'You must login first'})
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, enc) => {
            if (err) return res.sendStatus(403)
            if (user.role !== 'user') return res.status(403).json({message: `You aren't user`})
            user = enc
            next()
        })
    }
}
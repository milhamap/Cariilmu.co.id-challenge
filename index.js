const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const adminRouter = require('./src/routes/admin')
const courseCategoryRouter = require('./src/routes/course_category')
const courseRouter = require('./src/routes/course')
const userRouter = require('./src/routes/user')
const userCourseRouter = require('./src/routes/user_course')

require('dotenv').config()

const app = express()

app.use(cookieParser())
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/admin', adminRouter)
app.use('/course-category', courseCategoryRouter)
app.use('/course', courseRouter)
app.use('/user', userRouter)
app.use('/user-course', userCourseRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})

module.exports = app;
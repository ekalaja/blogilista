const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./utils/config')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
app.use(middleware.tokenExtractor)


app.use(cors())
app.use(bodyParser.json())

const mongoUrl = config.mongoUrl
mongoose.connect(mongoUrl)
mongoose.Promise = global.Promise

const loginRouter = require('./controllers/login')
app.use('/api/login', loginRouter)

const blogsRouter = require('./controllers/blogs')
app.use('/api/blogs', blogsRouter)


const usersRouter = require('./controllers/users')
app.use('/api/users', usersRouter)


const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}

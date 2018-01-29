const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./utils/config')
const mongoose = require('mongoose')

app.use(cors())
app.use(bodyParser.json())

const mongoUrl = config.mongoUrl
mongoose.connect(mongoUrl)
mongoose.Promise = global.Promise

const blogsRouter = require('./controllers/blogs')
app.use('/api/blogs', blogsRouter)


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

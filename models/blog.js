const mongooseSettings = require('../mongo')


const Blog = mongooseSettings.model('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
})

module.exports = Blog

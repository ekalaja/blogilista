const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
})

blogSchema.statics.format = (blog) => {
  return {
    id: blog.id,
    user: blog.user,
    likes: blog.likes,
    title: blog.title,
    author: blog.author,
    url: blog.url,
    comments: blog.comments
  }
}


const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog

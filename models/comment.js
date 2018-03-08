const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  title: String,
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }
})

commentSchema.statics.format = (comment) => {
  return {
    id: comment.id,
    title: comment.title,
  }
}


const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment

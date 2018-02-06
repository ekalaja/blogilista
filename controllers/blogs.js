const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { id: 1, username: 1, name: 1 })
  response.json(blogs.map(Blog.format))
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = await User.findById(body.userId)
  if (request.body.title === undefined || request.body.url === undefined) {
    return response.status(400).json({ error: 'missing fields' })
  }
  try {
    const blog = new Blog(body)
    blog.likes = body.likes === undefined ? 0 : body.likes
    blog.user = user._id
    await blog.save()
    response.json(blog)
    user.blogs = user.blogs.concat(blog._id)
    await user.save()
  }  catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'id not found' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const body = await request.body
    await Blog.findByIdAndUpdate(request.params.id, body, { new: true })
    response.json(body)
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'id not found' })
  }
})


module.exports = blogsRouter
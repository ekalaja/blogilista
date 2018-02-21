const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { id: 1, username: 1, name: 1 })
  response.json(blogs.map(Blog.format))
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (body.title === undefined || body.author === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }

    const user = await User.findById(decodedToken.id)

    if (request.body.title === undefined || request.body.url === undefined) {
      return response.status(400).json({ error: 'missing fields' })
    }

    const blog = new Blog(body)
    blog.likes === undefined ? blog.likes = 0 : blog.likes
    blog.user = user._id
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(Blog.format(blog))
  } catch(exception) {
    if (exception.name === 'JsonWebTokenError') {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong...' })
    }
  }
})

blogsRouter.delete('/:id', async (request, response) => {

  try {
    const blog = await Blog.findById(request.params.id)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    const user = await User.findById(decodedToken.id)
    if (blog.user === undefined && user) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    }

    if ( blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else {
      response.status(400).send({ error: 'unauthorized action' })
    }
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError') {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong...' })
    }
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
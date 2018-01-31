const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  console.log('request: ', request.body)
  if (request.body.title === undefined || request.body.url === undefined) {
    return response.status(400).json({ error: 'missing fields' })
  }
  try {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0: body.likes
    }) /*
    const blog = new Blog(request.body)*/
    await blog.save()
    response.json(blog)
  }  catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = blogsRouter
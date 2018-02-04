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
    if (body.likes === undefined) {
      const blog = new Blog(body)
      blog.likes = 0
      await blog.save()
      response.json(blog)
    } else {
      const blog = new Blog(body)
      console.log('BLLOOOGG: ', blog)
      console.log('request body: ', body)
      await blog.save()
      response.json(blog)
    }
  }  catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = blogsRouter
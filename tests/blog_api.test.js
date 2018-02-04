const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')


describe('Database has blogs', async () => {
  beforeAll(async () => {
    await Blog.remove({})
    const noteObjects = helper.initialBlogs.map(n => new Blog(n))
    await Promise.all(noteObjects.map(n => n.save()))
  })
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there is 4 blogs', async () => {
    const response = await api
      .get('/api/blogs')
    expect(response.body.length).toBe(4)
  })

  test('the first blog is about HTTP methods', async () => {
    const response = await api
      .get('/api/blogs')
    var firstBlog = response.body[0]
    expect(firstBlog.author).toBe('Maija Malli')
  })
})

describe('Adding a new blog', async () => {
  test('a valid blog with likes can be added', async () => {
    const newBlog = helper.additionalBlog
    const blogsBefore = await helper.blogsInDb()
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter.length).toBe(blogsBefore.length + 1)
    expect(blogsAfter).toContainEqual(helper.format(newBlog))
  })

  test('a valid blog without likes can be added', async () => {
    const newBlog = helper.noLikesFieldBlog
    const blogsBefore = await helper.blogsInDb()
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter.length).toBe(blogsBefore.length + 1)
    expect(blogsAfter).toContainEqual(helper.format(newBlog))
  })

  test('blog without title and url can not be added', async () => {
    const newBlog = helper.noTitleAndUrlBlog
    const blogsBefore = await helper.blogsInDb()
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter.length).toBe(blogsBefore.length)
  })
})

describe('Deleting a blog', async () => {
  test('blog without title and url can not be added', async () => {
    const blogsBefore = await helper.blogsInDb()
    console.log('vika BLOGI', blogsBefore.last)
  })
})


afterAll(() => {
  server.close()
})
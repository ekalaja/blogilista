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
  beforeAll(async () => {
    await Blog.remove({})
    const noteObjects = helper.initialBlogs.map(n => new Blog(n))
    await Promise.all(noteObjects.map(n => n.save()))
  })
  test('blog can be deleted using id', async () => {
    const blogsBefore = await helper.blogsInDb()
    await api
      .delete(`/api/blogs/${blogsBefore[3].id}`)
      .expect(204)
    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter.length).toBe(blogsBefore.length-1)
  })

  test('invalid id will not delete anything', async () => {
    const blogsBefore = await helper.blogsInDb()
    await api
      .delete('/api/blogs/123eioleid12313')
      .expect(400)
    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter.length).toBe(blogsBefore.length)
  })
})

describe('Updating a blog', async () => {
  beforeAll(async () => {
    await Blog.remove({})
    const noteObjects = helper.initialBlogs.map(n => new Blog(n))
    await Promise.all(noteObjects.map(n => n.save()))
  })
  test('blog can be updated using a proper id', async () => {
    const blogsBefore = await helper.blogsInDb()
    const newBlog = blogsBefore[1]
    newBlog.likes = 50
    await api
      .put(`/api/blogs/${newBlog.id}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter.length).toBe(blogsBefore.length)
    expect(blogsAfter[1].likes).toBe(50)
  })

  test.only('no blog is added when the blog id is incorrect', async () => {
    const blogsBefore = await helper.blogsInDb()
    const newBlog = blogsBefore[1]
    const amountOfLikes = newBlog.likes
    newBlog.likes = 50
    newBlog.id = '123123123'
    console.log('BLOGI ',newBlog.id)
    await api
      .put('/api/blogs/123ideiole1234')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter.length).toBe(blogsBefore.length)
    expect(blogsAfter[1].likes).toBe(amountOfLikes)
  })
})



afterAll(() => {
  server.close()
})
const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234a13f7',
    title: 'Eka blogi',
    author: 'Maija Malli',
    url: 'https://blogiblogi.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  }
]

const additionalBlog = new Blog ({
  title: 'Additional Blog one',
  author: 'T. Author',
  url: 'http://www.authorauthor.com',
  likes: 2,
  __v: 0
})

const noLikesFieldBlog = new Blog ({
  title: 'Additional Blog Two',
  author: 'Despised Writer',
  url: 'http://www.nolikesfield.com',
  __v: 0
})

const noTitleAndUrlBlog = new Blog ({
  author: 'Titless Writer',
  likes: 2
})




beforeAll(async () => {
  await Blog.remove({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[2])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[3])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there is 3 blogs', async () => {
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
describe('Adding a new blog', async () => {
  test('new blog with valid data is added to the database', async () => {
    const originalBlogs = await Blog.find({})

    await api
      .post('/api/blogs')
      .send(additionalBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await Blog.find({})
    expect(blogsAfter.length).toBe(originalBlogs.length + 1)
  })
  test('blog without likes gets value 0 on likes', async () => {
    const response = await api
      .post('/api/blogs')
      .send(noLikesFieldBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.likes).toBe(0)
    const blogsAfter = await Blog.find({})
    const likes = blogsAfter.map(blog => blog.likes)
    expect(likes).toEqual([7,7,5,12,2,0])

  })
  test('blog without title and url gets response bad request', async () => {
    await api
      .post('/api/blogs')
      .send(noTitleAndUrlBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})


afterAll(() => {
  server.close()
})
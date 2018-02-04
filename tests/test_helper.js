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
  likes: 2
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

const format = (blog) => {
  return {
    id: blog._id,
    author: blog.author,
    likes: blog.likes === undefined ? 0: blog.likes,
    title: blog.title,
    url: blog.url
  }
}

const nonExistingId = async () => {
  const note = new Blog()
  await note.save()
  await note.remove()

  return note._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(format)
}

module.exports = {
  initialBlogs, format, nonExistingId, blogsInDb, additionalBlog, noLikesFieldBlog, noTitleAndUrlBlog
}
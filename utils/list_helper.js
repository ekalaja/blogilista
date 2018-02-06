const dummy = (blogs) => {
  console.log(blogs)
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}


const mostLikes = (blogs) => {
  if (blogs[0]===undefined) {
    return 'no blogs'
  }
  var authorsMap = new Map ()
  blogs.map(function (blog) {
    authorsMap.get(blog.author)===undefined ? authorsMap.set(blog.author, blog.likes):
      authorsMap.set(blog.author, (authorsMap.get(blog.author) + blog.likes))
  })
  const listOfAuthorsAndLikes = Array.from(authorsMap)
  const mostLikedAuthor = listOfAuthorsAndLikes.reduce(function (previousValue, currentValue) { return previousValue[1] < currentValue[1] ? currentValue : previousValue }, ['no one', 0])
  return {
    author: mostLikedAuthor[0],
    likes: mostLikedAuthor[1]
  }
}

const mostBlogs = (blogs) => {
  if (blogs[0]===undefined) {
    return 'no blogs'
  }
  var authorsMap = new Map ()
  blogs.map(function (blog) {
    authorsMap.get(blog.author)===undefined ? authorsMap.set(blog.author, 1):
      authorsMap.set(blog.author, (authorsMap.get(blog.author) + 1))
  })
  const listOfAuthorsAndBlogs = Array.from(authorsMap)
  const authorWithMostBlogs = listOfAuthorsAndBlogs.reduce(function (previousValue, currentValue) { return previousValue[1] < currentValue[1] ? currentValue : previousValue }, ['no one', 0])
  return {
    author: authorWithMostBlogs[0],
    blogs: authorWithMostBlogs[1]
  }
}


const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce(function (previousValue, currentValue) {return previousValue.likes < currentValue.likes ? currentValue : previousValue }, blogs[0])
  return favorite
}

module.exports = {
  dummy,
  favoriteBlog,
  totalLikes,
  mostBlogs,
  mostLikes
}
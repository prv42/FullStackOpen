const Blog = require('../models/blog')

const initialBlogs = [
  { title: '1', author: 'A', url: 'https://example.com/a', likes: 1 },
  { title: '2', author: 'B', url: 'https://example.com/b', likes: 2 },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = { initialBlogs, blogsInDb }
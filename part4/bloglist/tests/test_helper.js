const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  { title: '1', author: 'A', url: 'https://example.com/a', likes: 1 },
  { title: '2', author: 'B', url: 'https://example.com/b', likes: 2 },
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', url: 'http://example.com' })
  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = { initialBlogs, nonExistingId, blogsInDb, usersInDb }
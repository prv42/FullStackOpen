const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct amount of blogs is returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert.notStrictEqual(blog.id, undefined)
    assert.strictEqual(blog._id, undefined)
  })
})

test('a valid blog can be added', async () => {
  const newBlog = { title: '3', author: 'C', url: 'https://example.com/c', likes: 3 }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const addedBlog = blogsAtEnd.find(b => b.id === response.body.id)
  assert.strictEqual(addedBlog.title, newBlog.title)
  assert.strictEqual(addedBlog.author, newBlog.author)
  assert.strictEqual(addedBlog.url, newBlog.url)
  assert.strictEqual(addedBlog.likes, newBlog.likes)
})

test('if likes is missing, it defaults to 0', async () => {
  const newBlog = { title: '4', author: 'D', url: 'https://example.com/d' }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)

  assert.strictEqual(response.body.likes, 0)
})

after(async () => {
  await mongoose.connection.close()
})
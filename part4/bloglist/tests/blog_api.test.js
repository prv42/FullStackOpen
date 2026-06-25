const { test, describe, after, beforeEach } = require('node:test')
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

describe('when there are initially some blogs saved', () => {
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
})

describe('addition of a new blog', () => {
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

  test('blog without title is not added', async () => {
    const newBlog = { author: 'X', url: 'https://example.com/x', likes: 1 }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog without url is not added', async () => {
    const newBlog = { title: 'X', author: 'X', likes: 1 }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const ids = blogsAtEnd.map(b => b.id)
    assert(!ids.includes(blogToDelete.id))
  })

  test('deleting a non-existing but valid id returns 204', async () => {
    const validNonExistingId = await helper.nonExistingId()

    await api
      .delete(`/api/blogs/${validNonExistingId}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('deleting with a malformed id returns 400', async () => {
    await api
      .delete('/api/blogs/not-a-valid-id')
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
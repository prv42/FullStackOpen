const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const supertest = require('supertest')
const app = require('../app')
const config = require('../utils/config')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  token = jwt.sign({ username: user.username, id: user._id }, config.SECRET)

  const blogObjects = helper.initialBlogs.map(b => new Blog({ ...b, user: user._id }))
  await Blog.insertMany(blogObjects)
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
    const newBlog = { title: 'x', author: 'X', url: 'https://example.com/x', likes: 10 }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
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

  test('fails with 401 if no token is provided', async () => {
    const newBlog = { title: 'x', author: 'X', url: 'https://example.com/x', likes: 10 }

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    assert(result.body.error.includes('token invalid'))

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('if likes is missing, it defaults to 0', async () => {
    const newBlog = { title: 'x', author: 'X', url: 'https://example.com/x' }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without title is not added', async () => {
    const newBlog = { author: 'X', url: 'https://example.com/x', likes: 1 }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog without url is not added', async () => {
    const newBlog = { title: 'X', author: 'X', likes: 1 }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('a blog can be deleted by its creator', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const ids = blogsAtEnd.map(b => b.id)
    assert(!ids.includes(blogToDelete.id))
  })

  test('fails with 401 if no token is provided', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('deleting a non-existing but valid id returns 404', async () => {
    const validNonExistingId = await helper.nonExistingId()

    await api
      .delete(`/api/blogs/${validNonExistingId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('deleting with a malformed id returns 400', async () => {
    await api
      .delete('/api/blogs/not-a-valid-id')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('updating a blog', () => {
  test('the likes of a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedData = { ...blogToUpdate, likes: blogToUpdate.likes + 10 }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 10)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 10)
  })

  test('all fields of a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const newData = {
      title: 'updated title',
      author: 'updated author',
      url: 'https://example.com/updated',
      likes: 999,
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.title, newData.title)
    assert.strictEqual(response.body.author, newData.author)
    assert.strictEqual(response.body.url, newData.url)
    assert.strictEqual(response.body.likes, newData.likes)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.title, newData.title)
    assert.strictEqual(updatedBlog.author, newData.author)
    assert.strictEqual(updatedBlog.url, newData.url)
    assert.strictEqual(updatedBlog.likes, newData.likes)
  })

  test('updating a non-existing but valid id returns 404', async () => {
    const validNonExistingId = await helper.nonExistingId()

    await api
      .put(`/api/blogs/${validNonExistingId}`)
      .send({ likes: 42 })
      .expect(404)
  })

  test('updating with a malformed id returns 400', async () => {
    await api
      .put('/api/blogs/not-a-valid-id')
      .send({ likes: 42 })
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
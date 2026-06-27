const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0 ? null : blogs.reduce((favorite, blog) => blog.likes > favorite.likes ? blog : favorite)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = blogs.reduce((acc, blog) => {
    acc[blog.author] ? acc[blog.author]++ : acc[blog.author] = 1
    return acc
  }, {})

  let topAuthor = null
  let maxBlogs = 0

  for (const author in counts) {
    if (counts[author] > maxBlogs) {
      topAuthor = author
      maxBlogs = counts[author]
    }
  }

  return { author: topAuthor, blogs: maxBlogs }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const counts = blogs.reduce((acc, blog) => {
    acc[blog.author] ? acc[blog.author] += blog.likes : acc[blog.author] = blog.likes
    return acc
  }, {})

  let topAuthor = null
  let maxLikes = -1

  for (const author in counts) {
    if (counts[author] > maxLikes) {
      topAuthor = author
      maxLikes = counts[author]
    }
  }

  return { author: topAuthor, likes: maxLikes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
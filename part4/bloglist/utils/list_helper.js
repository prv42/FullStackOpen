const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0 ? null : blogs.reduce((favorite, blog) => blog.likes > favorite.likes ? blog : favorite)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Invalid authentication token')
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const { userID, username } = payload
    req.user = { userID: userID, username: username }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Invalid authentication token')
  }
}

module.exports = authMiddleware

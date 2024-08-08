const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ username: user.username, token })
}

const login = async (req, res) => {
  res.send('login user')
}

module.exports = {
  register,
  login,
}

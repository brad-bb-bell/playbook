const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = jwt.sign(
    { userID: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    },
  )
  res.status(StatusCodes.CREATED).json({ username: user.username, token })
}

const login = async (req, res) => {
  res.send('login user')
}

module.exports = {
  register,
  login,
}

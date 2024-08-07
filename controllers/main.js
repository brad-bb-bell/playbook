// check username/pasword in post(login) request
// if exists, create new JWT
// send back to front end

// set up auth so only the request with JWT can access the dashboard

const jwt = require('jsonwebtoken')
const CustomAPIError = require('../errors/custom-error')

const login = async (req, res) => {
  const { username, password } = req.body
  // mongoose validation
  // joi
  // check in the controller
  if (!username || !password) {
    throw new CustomAPIError('Please provide email and password', 400)
  }

  //for demo.. should be provided by DB
  const id = new Date().getDate()

  //try to keep payload small for better ux
  //you should not store sensitive session data in browswer storage due to lack of security
  //although it does look like you store the token in local storage
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })

  console.log(username, password)
  res.status(200).json({ msg: 'user created', token })
}

const dashboard = async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new CustomAPIError('No token provided', 401)
    //401 is authentication error
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const luckyNumber = Math.floor(Math.random() * 100)
    res.status(200).json({
      msg: `Hello ${decoded.username}`,
      secret: `Your lucky number is: ${luckyNumber}`,
    })
  } catch (error) {
    //token might be expired
    throw new CustomAPIError('Not authorized to access this route', 401)
  }
}

module.exports = {
  login,
  dashboard,
}

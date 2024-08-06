// check username/pasword in post(login) request
// if exists, create new JWT
// send back to front end

// set up auth so only the request with JWT can access the dashboard

const CustomAPIError = require('../errors/custom-error')

const login = async (req, res) => {
  const { username, password } = req.body
  // mongoose validation
  // joi
  // check in the controller
  if (!username || !password) {
    throw new CustomAPIError('Please provide email and password', 400)
  }

  console.log(username, password)
  res.send('login route')
}

const dashboard = async (req, res) => {
  const luckyNumber = Math.floor(Math.random() * 100)
  res.status(200).json({
    msg: `Hello user.`,
    secret: `Your lucky number is: ${luckyNumber}`,
  })
}

module.exports = {
  login,
  dashboard,
}

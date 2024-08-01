// check username/pasword in post(login) request
// if exists, create new JWT
// send back to frontend

// set up auth so only the request with JWT can access the dashboard

const login = async (req, res) => {
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

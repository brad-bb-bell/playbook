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

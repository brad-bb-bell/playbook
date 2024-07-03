const getAllBets = (req, res) => {
  res.send('get all bets')
}

const createBet = (req, res) => {
  res.send('create new bet')
}

const getBet = (req, res) => {
  res.send('get single bet')
}

const updateBet = (req, res) => {
  res.send('update bet')
}

const deleteBet = (req, res) => {
  res.send('delete bet')
}

module.exports = { getAllBets, createBet, getBet, updateBet, deleteBet }

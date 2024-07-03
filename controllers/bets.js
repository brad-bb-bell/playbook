const getAllBets = (req, res) => {
  res.send('get all bets')
}

const createBet = (req, res) => {
  res.json(req.body)
}

const getBet = (req, res) => {
  res.json({ id: req.params.id })
}

const updateBet = (req, res) => {
  res.send('update bet')
}

const deleteBet = (req, res) => {
  res.send('delete bet')
}

module.exports = { getAllBets, createBet, getBet, updateBet, deleteBet }

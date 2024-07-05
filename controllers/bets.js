const Bet = require('../models/bets')

const getAllBets = (req, res) => {
  res.send('get all bets')
}

const createBet = async (req, res) => {
  try {
    const bet = await Bet.create(req.body)
    res.status(201).json({ bet })
  } catch (error) {
    res.status(500).json({ msg: error })
  }
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

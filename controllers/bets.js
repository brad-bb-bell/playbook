const Bet = require('../models/bets')

const getAllBets = async (req, res) => {
  try {
    const bets = await Bet.find({})
    res.status(200).json({ bets })
  } catch (error) {
    res.status(500).json({ msg: error })
  }
}

const createBet = async (req, res) => {
  try {
    const bet = await Bet.create(req.body)
    res.status(201).json({ bet })
  } catch (error) {
    res.status(500).json({ msg: error })
  }
}

const getBet = async (req, res) => {
  try {
    const { id: betID } = req.params
    const bet = await Bet.findOne({ _id: betID })
    if (!bet) {
      return res.status(404).json({ msg: `No bet with ID: ${betID}` })
    }
    res.status(200).json({ bet })
  } catch (error) {
    res.status(500).json({ msg: error })
  }
}

const updateBet = (req, res) => {
  res.send('update bet')
}

const deleteBet = (req, res) => {
  res.send('delete bet')
}

module.exports = { getAllBets, createBet, getBet, updateBet, deleteBet }

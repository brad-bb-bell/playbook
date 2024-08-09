const Bet = require('../models/Bet')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const mongoose = require('mongoose')

const getAllBets = async (req, res) => {
  const bets = await Bet.find({ createdBy: req.user.userID }).sort('datePlaced')
  res.status(StatusCodes.OK).json({ bets, count: bets.length })
}

const createBet = async (req, res) => {
  req.body.createdBy = req.user.userID
  const bet = await Bet.create(req.body)
  res.status(StatusCodes.CREATED).json({ bet })
}

const getBet = async (req, res) => {
  const {
    user: { userID },
    params: { id: betID },
  } = req
  const bet = await Bet.findOne({ _id: betID, createdBy: userID })
  if (!bet) {
    throw new NotFoundError(`No bet with ID: ${betID}`)
  }
  res.status(StatusCodes.OK).json({ bet })
}

const updateBet = async (req, res) => {
  try {
    const { id: betID } = req.params
    if (!mongoose.Types.ObjectId.isValid(betID)) {
      return res.status(400).json({ msg: `Invalid ID format: ${betID}` })
    }
    const bet = await Bet.findOneAndUpdate({ _id: betID }, req.body, {
      new: true,
      runValidators: true,
    })
    res.status(200).json({ msg: 'Bet updated', data: bet })
  } catch (error) {
    res.status(500).json({ msg: error })
  }
}

const deleteBet = async (req, res) => {
  try {
    const { id: betID } = req.params
    if (!mongoose.Types.ObjectId.isValid(betID)) {
      return res.status(400).json({ msg: `Invalid ID format: ${betID}` })
    }
    const bet = await Bet.findOneAndDelete({ _id: betID })
    if (!bet) {
      return res.status(404).json({ msg: `No bet with ID: ${betID}` })
    }
    res.status(200).json({ msg: 'Bet deleted' })
  } catch (error) {
    res.status(500).json({ msg: error })
  }
}

module.exports = { getAllBets, createBet, getBet, updateBet, deleteBet }

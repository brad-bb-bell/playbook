const Bet = require('../models/Bet')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError } = require('../errors')

const getAllBets = async (req, res) => {
  //replaced req.user.userID with hardcoded value
  const bets = await Bet.find({ createdBy: '66ba14a1adac04fe7fbc883c' }).sort(
    'datePlaced',
  )
  res.status(StatusCodes.OK).json({ bets, count: bets.length })
}

const createBet = async (req, res) => {
  req.body.createdBy = req.user.userID
  const bet = await Bet.create(req.body)
  res.status(StatusCodes.CREATED).json({ bet })
}

const getBet = async (req, res) => {
  //replaced userID with hardcoded value
  const {
    params: { id: betID },
  } = req
  const bet = await Bet.findOne({
    _id: betID,
    createdBy: '66ba14a1adac04fe7fbc883c',
  })
  if (!bet) {
    throw new NotFoundError(`No bet with ID: ${betID}`)
  }
  res.status(StatusCodes.OK).json({ bet })
}

const updateBet = async (req, res) => {
  //could validate the body here.. no empty fields, etc
  const {
    user: { userID },
    params: { id: betID },
  } = req

  const bet = await Bet.findOneAndUpdate(
    { _id: betID, createdBy: userID },
    req.body,
    { new: true, runValidators: true },
  )

  if (!bet) {
    throw new NotFoundError(`No bet with ID: ${betID}`)
  }
  res.status(StatusCodes.OK).json({ bet })
}

const deleteBet = async (req, res) => {
  const {
    user: { userID },
    params: { id: betID },
  } = req
  const bet = await Bet.findOneAndDelete({ _id: betID, createdBy: userID })
  if (!bet) {
    throw new NotFoundError(`No bet with ID: ${betID}`)
  }
  res.status(StatusCodes.OK).json('Bet deleted successfully')
}

module.exports = { getAllBets, createBet, getBet, updateBet, deleteBet }

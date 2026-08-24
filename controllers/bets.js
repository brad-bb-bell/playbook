const Bet = require('../models/Bet')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../errors')
const { normalizeNflTeam } = require('../constants/teams')

const MULTI_LEG_BET_TYPES = ['parlay', '2-team-teaser', '3-team-teaser']
// Historical conventions: '' (futures), 'XXX' (opponent not tracked),
// 'BYE' (playoff-bye teaser legs)
const OPPONENT_PLACEHOLDERS = ['', 'xxx', 'bye']

// Converts team/opponent entries to canonical NFL abbreviations in place.
// Lives here rather than on the schema because update validators can't see
// sibling fields (sport) on findOneAndUpdate.
const normalizeBetTeams = (body) => {
  if (body.sport && body.sport !== 'NFL') return

  const unmatched = []
  ;['team', 'opponent'].forEach((field) => {
    if (body[field] == null) return
    const entries = Array.isArray(body[field]) ? body[field] : [body[field]]
    body[field] = entries.map((entry) => {
      if (typeof entry !== 'string' || entry.trim() === '') return entry
      if (field === 'opponent' && OPPONENT_PLACEHOLDERS.includes(entry.trim().toLowerCase())) {
        return entry
      }
      const abbr = normalizeNflTeam(entry)
      if (abbr) return abbr
      // futures can be on players ("Bo Nix", Offensive ROTY), not just teams
      if (body.betType === 'future') return entry
      unmatched.push(`${field}: "${entry}"`)
      return entry
    })
  })
  if (unmatched.length) {
    throw new BadRequestError(`Unrecognized NFL team(s): ${unmatched.join(', ')}`)
  }

  if (MULTI_LEG_BET_TYPES.includes(body.betType)) {
    const teams = Array.isArray(body.team) ? body.team.length : 0
    const opponents = Array.isArray(body.opponent) ? body.opponent.length : 0
    if (teams && opponents && teams !== opponents) {
      throw new BadRequestError('team and opponent must have the same number of legs')
    }
  }
}

const getAllBets = async (req, res) => {
  //replaced req.user.userID with hardcoded value
  const bets = await Bet.find({ createdBy: '66ba14a1adac04fe7fbc883c' }).sort(
    'datePlaced',
  )
  res.status(StatusCodes.OK).json({ bets, count: bets.length })
}

const createBet = async (req, res) => {
  req.body.createdBy = req.user.userID
  normalizeBetTeams(req.body)
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

  normalizeBetTeams(req.body)
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

module.exports = {
  getAllBets,
  createBet,
  getBet,
  updateBet,
  deleteBet,
  normalizeBetTeams,
}

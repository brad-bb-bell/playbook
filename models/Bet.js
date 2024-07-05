const mongoose = require('mongoose')

const BetSchema = new mongoose.Schema({
  sport: {
    type: String,
    required: [true, 'must provide a sport'],
    enum: ['NFL', 'NBA'],
  },
  betType: {
    type: String,
    required: [true, 'must provide a bet type'],
    enum: [
      'spread',
      'moneyline',
      'over-under',
      'future',
      'parlay',
      '2-team-teaser',
      '3-team-teaser',
    ],
  },
  team: {
    type: Array,
    required: [true, 'must provide a team'],
  },
  opponent: {
    type: Array,
    required: [true, 'must provide an opponent'],
  },
  odds: {
    type: String,
    required: [true, 'must provide odds'],
  },
  betAmount: {
    type: Number,
    required: [true, 'must provide a bet amount'],
  },
  betPayout: {
    type: Number,
    // not required because it will be calculated but should have an option to confirm/edit
  },
  result: {
    type: String,
    enum: ['win', 'loss', 'push', 'pending'],
    default: 'pending',
  },
  datePlaced: {
    type: Date,
    default: Date.now,
  },
  dateSettled: {
    type: Date,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Bet', BetSchema)

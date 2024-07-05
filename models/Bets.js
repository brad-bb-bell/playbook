const mongoose = require('mongoose')

const BetSchema = new mongoose.Schema({
  sport: {
    type: String,
    required: true,
    enum: ['NFL', 'NBA'],
  },
  betType: {
    type: String,
    required: true,
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
    required: true,
  },
  opponent: {
    type: Array,
    required: true,
  },
  odds: {
    type: String,
    required: [true, 'You must provide odds'],
  },
  betAmount: {
    type: Number,
    required: [true, 'You must provide a bet amount'],
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

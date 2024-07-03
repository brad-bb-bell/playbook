const express = require('express')
const router = express.Router()

const {
  getAllBets,
  createBet,
  getBet,
  updateBet,
  deleteBet,
} = require('../controllers/bets')

router.route('/').get(getAllBets).post(createBet)
router.route('/:id').get(getBet).patch(updateBet).delete(deleteBet)

module.exports = router

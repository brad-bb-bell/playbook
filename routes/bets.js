const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/auth')

const {
  getAllBets,
  createBet,
  getBet,
  updateBet,
  deleteBet,
} = require('../controllers/bets')

//no auth
router.route('/').get(getAllBets)
router.route('/:id').get(getBet)

//auth required
router.route('/').post(authenticateUser, createBet)
router
  .route('/:id')
  .patch(authenticateUser, updateBet)
  .delete(authenticateUser, deleteBet)

module.exports = router

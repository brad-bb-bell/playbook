const express = require('express')
const router = express.Router()

const { getAllBets } = require('../controllers/bets')

router.route('/').get(getAllBets)

module.exports = router

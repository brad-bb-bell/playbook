const express = require('express')
const router = express.Router()

const { dashboard } = require('../controllers/main')

const authMiddleware = require('../middleware/auth')

router.route('/').get(authMiddleware, dashboard)

module.exports = router

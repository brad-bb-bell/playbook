const express = require('express')
const multer = require('multer')
const rateLimit = require('express-rate-limit')
const router = express.Router()
const authenticateUser = require('../middleware/auth')
const { BadRequestError } = require('../errors')

const {
  getAllBets,
  createBet,
  getBet,
  updateBet,
  deleteBet,
} = require('../controllers/bets')
const parseTicket = require('../controllers/parse-ticket')

// ticket images stay in memory only — never written to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp)$/.test(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new BadRequestError('Only JPEG, PNG, or WebP images are supported'))
    }
  },
})
// tighter than the global limiter — each parse is a paid LLM call
const parseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
})

//no auth
router.route('/').get(getAllBets)

//auth required
// literal path must be declared before '/:id'
router
  .route('/parse-ticket')
  .post(authenticateUser, parseLimiter, upload.single('image'), parseTicket)
router.route('/').post(authenticateUser, createBet)
router.route('/:id').get(getBet)
router
  .route('/:id')
  .patch(authenticateUser, updateBet)
  .delete(authenticateUser, deleteBet)

module.exports = router

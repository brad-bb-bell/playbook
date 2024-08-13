require('dotenv').config()
require('express-async-errors')

//security packages
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const bodyParser = require('body-parser')
const { xss } = require('express-xss-sanitizer')

const express = require('express')
const app = express()

const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/auth')

//routers
const betsRouter = require('./routes/bets')
const authRouter = require('./routes/auth')

//error handler
const errorHandlerMiddleware = require('./middleware/error-handler')

//security
app.set('trust proxy', 1)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
)
app.use(express.json())
app.use(bodyParser.json({ limit: '1kb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '1kb' }))
app.use(xss())
app.use(helmet())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Playbook API')
})
//routes
app.use('/api/v1/bets', authenticateUser, betsRouter)
app.use('/api/v1/auth', authRouter)

//middleware
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`Server is listening on port ${port}`))
  } catch (error) {
    console.error(error)
  }
}

start()

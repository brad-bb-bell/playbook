require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const betsRouter = require('./routes/bets')
const authRouter = require('./routes/auth')

const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/auth')

//error handlers
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

//middleware
app.use(express.json())

//routes
app.use('/api/v1/bets', authenticateUser, betsRouter)
app.use('/api/v1/auth', authRouter)

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

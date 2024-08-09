require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const betsRouter = require('./routes/bets')
const authRouter = require('./routes/auth')

const connectDB = require('./db/connect')

//error handlers
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

//middleware
app.use(express.json())

//routes
app.use('/api/v1/bets', betsRouter)
app.use('/api/v1/auth', authRouter)

// app.get('/api/v1/bets', asyncWrapper(getAllBets)        - get all bets
// app.post('/api/v1/bets', asyncWrapper(createBet)        - create new bet
// app.get('/api/v1/bets/:id', asyncWrapper(getSingleBet)  - get single bet
// app.patch('/api/v1/bets/:id', asyncWrapper(updateBet)   - update bet
// app.delete('/api/v1/bets/:id', asyncWrapper(deleteBet)  - delete bet

app.use(notFoundMiddleware)
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

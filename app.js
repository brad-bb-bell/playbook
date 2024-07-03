require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const bets = require('./routes/bets')

const connectDB = require('./db/connect')

//middleware
app.use(express.json())

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

//routes
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/v1/bets', bets)

// app.get('/api/v1/bets', asyncWrapper(getAllBets)        - get all bets
// app.post('/api/v1/bets', asyncWrapper(createBet)        - create new bet
// app.get('/api/v1/bets/:id', asyncWrapper(getSingleBet)  - get single bet
// app.patch('/api/v1/bets/:id', asyncWrapper(updateBet)   - update bet
// app.delete('/api/v1/bets/:id', asyncWrapper(deleteBet)  - delete bet

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`Server is listening on port ${port}`))
  } catch (error) {
    console.error(error)
  }
}

start()

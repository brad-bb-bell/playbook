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

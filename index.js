import http from 'http'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import './config/mongo.js'
import authRouter from './routes/auth.js'
import userRouter from './routes/user.js'
import filesRouter from './routes/files.js'

const port = process.env.PORT || "4000"
const options = {
  origin: 'http://localhost:3000',
}

const app = express()
app.set("port", port)
app.use(cors(options))
app.use(express.static('public'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization']
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1]
    req.token = bearerToken
    next()
  } else {
    res.sendStatus(403)
  }
}

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/files', filesRouter)

const server = http.createServer(app)
server.listen(port)
server.on('listening', () => {
  console.log(`Listening on port:: http://localhost:${port}`)
})

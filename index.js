import http from 'http'
import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import bodyParser from 'body-parser'
import { Server } from 'socket.io'
import herokuSSLRedirect from 'heroku-ssl-redirect'

import authRouter from './routes/auth.js'
import userRouter from './routes/user.js'
import filesRouter from './routes/files.js'
import categoryRouter from './routes/category.js'
import messageRouter from './routes/message.js'
import { addMessage } from './controllers/message.js'
import './config/mongo.js'

const port = process.env.PORT || '4000'
const sslRedirect = herokuSSLRedirect.default
const app = express()
const server = http.Server(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: '*',
  },
})

app.set('port', port)
app.use(sslRedirect())
app.use(
  fileUpload({
    createParentPath: true,
  })
)
app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/files', filesRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/messages', messageRouter)

server.listen(port, (error) => {
  if (!error)
    console.log(
      'Server is Successfully Running, and App is listening on port ' + port
    )
  else console.log("Error occurred, server can't start", error)
})

io.on('connection', async (socket) => {
  socket.on('send-message', async (data) => {
    const messages = await addMessage(data)
    io.emit('messages', messages)
  })
})

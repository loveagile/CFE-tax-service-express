import http from 'http'
import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import bodyParser from 'body-parser'
import herokuSSLRedirect from 'heroku-ssl-redirect'

import authRouter from './routes/auth.js'
import userRouter from './routes/user.js'
import filesRouter from './routes/files.js'
import categoryRouter from './routes/category.js'
import './config/mongo.js'

const port = process.env.PORT || "4000"
const options = {
  origin: 'http://localhost:' + port,
  'Access-Control-Allow-Origin': 'https://localhost:4000'
}

const sslRedirect = herokuSSLRedirect.default
const app = express()
app.set("port", port)
app.use(sslRedirect())
app.use(fileUpload({
  createParentPath: true
}))
app.use(cors({
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
}))
app.use(express.static('public'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/files', filesRouter)
app.use('/api/categories', categoryRouter)

const server = http.createServer(app)
server.listen(port)
server.on('listening', () => {
  console.log(`Listening on port:: http://localhost:${port}`)
})

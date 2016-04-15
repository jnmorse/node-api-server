// Main starting point of the application
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const router = require('./router')
const mongoose = require('mongoose')

// DB Setup
mongoose.connect('mongodb://localhost:auth/auth')

// App Setup
app.use(morgan('combined'))
app.use(bodyParser.json({ type: '*/*' }))
app.use(router(app))

// Server Setup
const port = process.env.PORT || 3090

app.listen(port, function() {
  console.log('Server Listening on: ' + port)
})

const User = require('../models/user')
const JWT = require('jwt-simple')
const Dotenv = require('dotenv')
Dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

function tokenForUser(user) {
  const timestamp = new Date().getTime()
  return JWT.encode({ sub: user.id, iat: timestamp }, JWT_SECRET)
}

exports.signin = function(req, res, next) {
  res.send({ token: tokenForUser(req.user) })
}

exports.signup = function(req, res, next) {
  const email = req.body.email
  const password = req.body.password

  User.findOne({ email: email }, function(error, existingUser) {
    if (error) { return next(error) }

    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' })
    }

    else {
      const user = new User({
        email: email,
        password: password
      })

      user.save(function(error) {
        if (error) { return next(error) }

        return res.json({ token: tokenForUser(user) })
      })
    }
  })
}

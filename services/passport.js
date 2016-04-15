const passport = require('passport')
const User = require('../models/user')
const dotenv = require('dotenv')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
dotenv.config()
const LocalStrategy = require('passport-local').Strategy

const localOptions = {
  usernameField: 'email'
}

const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  User.findOne({ email: email }, function(error, user) {
    if (error) { return done(error) }

    if(!user) { return done(null, false) }

    user.comparePassword(password, function(error, isMatch) {
      if (error) { return done(error) }
      if (!isMatch) { return done(null, false) }

      return done(null, user)
    })
  })
})

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET
}

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  User.findOne(payload.sub, function(error, user) {
    if (error) { return done(error, false) }

    if (user) {
      done (null, user)
    }

    else {
      done(null, false)
    }
  })
})

passport.use('jwt', jwtLogin)
passport.use('local', localLogin)

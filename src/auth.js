import passport from 'koa-passport'
import { Strategy } from 'passport-github'
import CONFIG from './server.config'

const { HOST, PORT } = CONFIG

passport.use(new Strategy({
  clientID: '90294f603aa7ffc17167',
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `http://${HOST}:${PORT}/auth/github/callback`,
}, (token, tokenSecret, profile, done) => {
  console.info(`Got user ${profile.id}`)
  done(null, parseInt(profile.id, 10))
}))

passport.serializeUser((userId, done) => done(null, userId))
passport.deserializeUser((userId, done) => done(null, userId))

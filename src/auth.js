import passport from 'koa-passport'
import { Strategy } from 'passport-github'
import CONFIG from './server.config'

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} = process.env

const {
  HOST,
  PORT,
  PATHS: { GITHUB_CALLBACK },
} = CONFIG

passport.use(new Strategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: `http://${HOST}:${PORT}${GITHUB_CALLBACK}`,
}, (token, tokenSecret, profile, done) => {
  console.info(`Got user ${profile.id}`)
  done(null, parseInt(profile.id, 10))
}))

passport.serializeUser((userId, done) => done(null, userId))
passport.deserializeUser((userId, done) => done(null, userId))

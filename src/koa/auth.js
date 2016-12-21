// @flow
import passport from 'koa-passport'
import { Strategy } from 'passport-github'
import logger from '../logger'
import type { CreateAuthorPrivateAction } from '../types/flow'
import { AUTHORS } from '../types/constants'
import store from '../redux/store'
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

const strategyOptions = {
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: `http://${HOST}:${PORT}${GITHUB_CALLBACK}`,
}

const strategyCallback = (token, tokenSecret, profile, done) => {
  const authorId = profile.id
  console.info(`Got profile ${authorId}`)

  const author = store
    .getState()
    .get(AUTHORS)
    .get(authorId)

  if (!author) {
    const action: CreateAuthorPrivateAction = {
      type: 'CREATE_AUTHOR',
      authorId,
      name: profile.displayName,
    }
    logger.logAction(action)
    store.dispatch(action)
  }

  done(null, authorId)
}

passport.use(new Strategy(strategyOptions, strategyCallback))
passport.serializeUser((userId, done) => done(null, userId))
passport.deserializeUser((userId, done) => done(null, userId))

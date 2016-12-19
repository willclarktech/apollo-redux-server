// @flow
import passport from 'koa-passport'
import { Strategy } from 'passport-github'
import { find } from 'lodash'
import type { CreateAuthorPrivateAction } from './types/flow'
import CONFIG from './server.config'
import store from './store'
import logger from './logger'

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
  const profileId = profile.id
  console.info(`Got profile ${profileId}`)

  const { authors } = store.getState()
  const author = find(authors, { id: profileId })
  if (!author) {
    const action: CreateAuthorPrivateAction = {
      type: 'CREATE_AUTHOR',
      authorId: profileId,
      name: profile.displayName,
    }
    logger.logAction(action)
    store.dispatch(action)
  }

  done(null, profileId)
}))

passport.serializeUser((userId, done) => done(null, userId))
passport.deserializeUser((userId, done) => done(null, userId))

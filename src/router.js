// @flow
import type { Context } from 'koa'
import Router from 'koa-router'
import passport from 'koa-passport'
import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa'
import schema from './schema'
import CONFIG from './server.config'

require('./auth')

const GITHUB = 'github'
const {
  GRAPHQL: GRAPHQL_PATH,
  GITHUB: GITHUB_PATH,
  GITHUB_CALLBACK: GITHUB_CALLBACK_PATH,
  LOGOUT: LOGOUT_PATH,
} = CONFIG.PATHS

const GRAPHQL_OPTIONS = (context: Context) => ({
  context,
  schema,
  debug: true,
})

const GRAPHIQL_OPTIONS = {
  endpointURL: GRAPHQL_PATH,
}

const AUTH_OPTIONS = {
  successRedirect: GRAPHQL_PATH,
  failureRedirect: GRAPHQL_PATH,
}

const router = new Router()

router.post(GRAPHQL_PATH, graphqlKoa(GRAPHQL_OPTIONS))
router.get(GRAPHQL_PATH, graphiqlKoa(GRAPHIQL_OPTIONS))

router.get(GITHUB_PATH, passport.authenticate(GITHUB))
router.get(GITHUB_CALLBACK_PATH, passport.authenticate(GITHUB, AUTH_OPTIONS))
router.get(LOGOUT_PATH, ctx => {
  ctx.logout()
  ctx.redirect(GRAPHQL_PATH)
})

export default router

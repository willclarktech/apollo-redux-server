// @flow
import type { Context } from 'koa'
import Router from 'koa-router'
import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa'
import schema from '../apollo/schema'
import CONFIG from './server.config'
import {
  handleGitHubCallback,
  redirectToGitHub,
} from './auth'

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

const router = new Router()

const logout = (ctx: Context) => {
  ctx.logout()
  ctx.redirect(GRAPHQL_PATH)
}

router.post(GRAPHQL_PATH, graphqlKoa(GRAPHQL_OPTIONS))
router.get(GRAPHQL_PATH, graphiqlKoa(GRAPHIQL_OPTIONS))

router.get(GITHUB_PATH, redirectToGitHub)
router.get(GITHUB_CALLBACK_PATH, handleGitHubCallback)
router.get(LOGOUT_PATH, logout)

export default router

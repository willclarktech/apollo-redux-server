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
  GRAPHIQL: GRAPHIQL_PATH,
  GITHUB_LOGIN: GITHUB_LOGIN_PATH,
  GITHUB_CALLBACK: GITHUB_CALLBACK_PATH,
} = CONFIG.PATHS

const GRAPHQL_OPTIONS = (context: Context) => ({
  context,
  schema,
  debug: process.env.GRAPHQL_DEBUG,
})

const GRAPHIQL_OPTIONS = {
  endpointURL: GRAPHQL_PATH,
}

const router = new Router()

router
  .post(GRAPHQL_PATH, graphqlKoa(GRAPHQL_OPTIONS))
  .get(GRAPHIQL_PATH, graphiqlKoa(GRAPHIQL_OPTIONS))
  .get(GITHUB_LOGIN_PATH, redirectToGitHub)
  .get(GITHUB_CALLBACK_PATH, handleGitHubCallback)

export default router

// @flow
import Router from 'koa-router'
import passport from 'koa-passport'
import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa'
import schema from './schema'

require('./auth')

const GRAPHQL_OPTIONS = context => ({
  context,
  schema,
  debug: true,
})

const GRAPHIQL_OPTIONS = {
  endpointURL: '/graphql',
}

const AUTH_OPTIONS = {
  successRedirect: '/graphql',
  failureRedirect: '/graphql',
}

const router = new Router()

router.post('/graphql', graphqlKoa(GRAPHQL_OPTIONS))
router.get('/graphql', graphiqlKoa(GRAPHIQL_OPTIONS))

router.get('/auth/github', passport.authenticate('github'))
router.get('/auth/github/callback', passport.authenticate('github', AUTH_OPTIONS))
router.get('/logout', ctx => {
  ctx.logout()
  ctx.redirect('/graphql')
})

export default router

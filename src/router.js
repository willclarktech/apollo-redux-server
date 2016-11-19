import Router from 'koa-router'
import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa'
import schema from './schema'

const GRAPHQL_OPTIONS = {
  schema,
  debug: true,
}

const GRAPHIQL_OPTIONS = {
  endpointURL: '/graphql',
}

const router = new Router()
router.post('/graphql', graphqlKoa(GRAPHQL_OPTIONS))
router.get('/graphql', graphiqlKoa(GRAPHIQL_OPTIONS))

export default router

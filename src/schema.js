// @flow
import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolvers'
import typeDefs from './types/graphql'

export default makeExecutableSchema({
  typeDefs,
  resolvers,
  logger: { log: console.error },
})

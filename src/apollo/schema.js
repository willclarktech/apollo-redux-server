// @flow
import { makeExecutableSchema } from 'graphql-tools'
import initializeResolvers from './resolvers'
import typeDefs from '../types/graphql'

const defineSchema = resolvers => makeExecutableSchema({
  typeDefs,
  resolvers,
})

const initializeSchema = () => initializeResolvers().then(defineSchema)

export default initializeSchema

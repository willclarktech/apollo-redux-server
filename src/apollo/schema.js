// @flow
import { makeExecutableSchema } from 'graphql-tools'
import initialiseResolvers from './resolvers'
import typeDefs from '../types/graphql'

const defineSchema = resolvers => makeExecutableSchema({
  typeDefs,
  resolvers,
})

const initialiseSchema = () => initialiseResolvers().then(defineSchema)

export default initialiseSchema

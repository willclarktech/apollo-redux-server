// @flow
import { Record as ImmutableRecord } from 'immutable'

const PathsRecord = ImmutableRecord({
  CLIENT: 'http://localhost:3001',
  GRAPHQL: '/graphql',
  GRAPHIQL: '/graphiql',
  GITHUB_LOGIN: '/auth/github',
  GITHUB_CALLBACK: '/auth/github/callback',
})

const ServerConfigRecord = ImmutableRecord({
  FAVICON_LOCATION: './public/favicon.ico',
  HOST: 'localhost',
  PORT: 3000,
  PATHS: new PathsRecord(),
})

export default new ServerConfigRecord()

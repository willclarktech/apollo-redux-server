// @flow
import { Record as ImmutableRecord } from 'immutable'

const PathsRecord = ImmutableRecord({
  GRAPHQL: '/graphql',
  LOGOUT: '/logout',
  GITHUB: '/auth/github',
  GITHUB_CALLBACK: '/auth/github/callback',
})

const ServerConfigRecord = ImmutableRecord({
  HOST: 'localhost',
  PORT: 3000,
  PATHS: new PathsRecord(),
})

export default new ServerConfigRecord()
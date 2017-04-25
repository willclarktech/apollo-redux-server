// @flow
import type {
  Config,
  Paths,
} from '../types/flow'

const PATHS: Paths = {
  CLIENT: 'http://localhost:3001',
  GRAPHQL: '/graphql',
  GRAPHIQL: '/graphiql',
  GITHUB_LOGIN: '/auth/github',
  GITHUB_CALLBACK: '/auth/github/callback',
}

const CONFIG: Config = {
  FAVICON_LOCATION: './public/favicon.ico',
  HOST: 'localhost',
  PORT: 3000,
  PATHS,
}

export default CONFIG

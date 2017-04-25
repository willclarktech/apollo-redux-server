// @flow
import type { ID } from './helper.types'

export type Context = {
  redirect: (url: string) => any,
  assert: (expression: any, status: number, message: string) => any,
  throw: (status: number, message: string) => any,
  state: {
    user: ?{
      id: ID,
    },
  },
  query: {
    code: ?string,
  },
}

type Middleware = (ctx: Context) => any

export type AuthHandlers = {
  redirectToGitHub: Middleware,
  handleGitHubCallback: Middleware,
}

export type Paths = {
  CLIENT: string,
  GRAPHQL: string,
  GRAPHIQL: string,
  GITHUB_LOGIN: string,
  GITHUB_CALLBACK: string,
}

export type Config = {
  FAVICON_LOCATION: string,
  HOST: string,
  PORT: number,
  PATHS: Paths,
}

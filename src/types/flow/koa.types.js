import type { ID } from './helper.types'

// @flow
export type Context = {
  redirect: (url: string) => any,
  assert: (expression: any, status: number, message: string) => any,
  throw: (status: number, message: string) => any,
  state: {
    user: ?{
      id: ID,
    },
  },
  query: {},
}

type Middleware = (ctx: Context) => any

export type AuthHandlers = {
  redirectToGitHub: Middleware,
  handleGitHubCallback: Middleware,
}

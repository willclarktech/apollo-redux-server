// @flow
import type { Context } from 'koa'
import type { ID, Action } from './types/flow'

const assertIsAuthenticated = (ctx: Context) => ctx.assert(
  ctx.isAuthenticated(),
  401,
  'You must be logged in to do that',
)

const assertAuthorIsUser = (author: ID) => (ctx: Context) => ctx.assert(
  author === ctx.state.user,
  401,
  'You cannot create posts for this author',
)

const authenticate = (ctx: Context) => {
  assertIsAuthenticated(ctx)
  return (action: Action): void => {
    switch (action.type) {
      case 'UPVOTE_POST':
        break
      case 'CREATE_POST':
        assertAuthorIsUser(action.author)(ctx)
        break
      default:
        break
    }
  }
}

export default authenticate

// @flow
import type { Action, Context, ID } from '../types/flow'

const assertIsAuthenticated = (ctx: Context) => ctx.assert(
  !!ctx.state.user,
  401,
  'You must be logged in to do that',
)

const assertAuthorIsUser = (authorId: ID) => (ctx: Context) => ctx.assert(
  ctx.state.user && authorId === ctx.state.user.id,
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
        assertAuthorIsUser(action.authorId)(ctx)
        break
      default:
        break
    }
  }
}

export default authenticate

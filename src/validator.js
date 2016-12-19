// @flow
import type { Context } from 'koa'
import type { Action } from './types/flow'

const validator = (ctx: Context) => (action: Action): void => {
  switch (action.type) {
    case 'CREATE_POST':
      ctx.assert(!!action.authorId, 400, 'No author id specified')
      ctx.assert(!!action.title, 400, 'No title specified')
      break
    case 'UPVOTE_POST':
      ctx.assert(!!action.postId, 400, 'No post id specified')
      break
    default:
      ctx.throw(400, 'Not a valid action type')
  }
}

export default validator

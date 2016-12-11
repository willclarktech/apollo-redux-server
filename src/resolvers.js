// @flow
import type { Context } from 'koa'
import { filter, find } from 'lodash'
import makeStore from './store'
import validate from './validator'
import authenticate from './authenticator'
import Logger from './logger'
import getMutationResponse from './responder'

import type {
  AuthorQueryParams,
  MutationParams,
  PostQueryParams,
  Author,
  Post,
  Secret,
  ReduxStore,
} from './types/flow'

const logger = new Logger()
const store: ReduxStore = makeStore()

export default {
  Query: {
    posts(): Array<Post> {
      const { posts } = store.getState()
      return posts
    },
    secrets(_: any, __: any, ctx: Context): Array<Secret> {
      authenticate(ctx)
      const { user } = ctx.state
      const { secrets } = store.getState()
      return secrets.filter(({ userId }) => userId === parseInt(user, 10))
    },
  },
  Post: {
    author({ authorId }: PostQueryParams): Post {
      const { authors } = store.getState()
      return find(authors, { id: authorId })
    },
  },
  Author: {
    posts({ id }: AuthorQueryParams): Author {
      const { posts } = store.getState()
      return filter(posts, { authorId: id })
    },
  },
  Mutation: {
    dispatch(_: any, { action }: MutationParams, ctx: Context): any {
      validate(ctx)(action)
      authenticate(ctx)(action)
      logger.logAction(action)
      store.dispatch(action)
      return getMutationResponse(store.getState())(action)
    },
  },
}

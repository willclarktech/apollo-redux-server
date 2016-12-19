// @flow
import type { Context } from 'koa'
import { filter, find } from 'lodash'
import store from './store'
import validate from './validator'
import authenticate from './authenticator'
import logger from './logger'
import getMutationResponse from './responder'

import type {
  AuthorQueryParams,
  MutationParams,
  PostQueryParams,
  Author,
  Post,
  Secret,
} from './types/flow'

export default {
  Query: {
    posts(): Array<Post> {
      const { posts } = store.getState()
      // $FlowFixMe: https://github.com/facebook/flow/issues/1059
      return [...posts.entries()]
        .map(([id: string, post: Post]) => ({
          ...post,
          id,
        }))
    },
    secrets(_: any, __: any, ctx: Context): Array<Secret> {
      authenticate(ctx)
      const { user } = ctx.state
      const { secrets } = store.getState()
      // $FlowFixMe: https://github.com/facebook/flow/issues/1059
      return [...secrets.values()]
        .filter(({ author }: Secret): boolean => author === user)
    },
  },
  Post: {
    author({ author: id }: AuthorQueryParams): Author {
      const { authors } = store.getState()
      const author = authors.get(id)
      if (!author) {
        throw new Error(`Couldn’t find author with id ${id}`)
      }
      return {
        ...author,
        id,
      }
    },
  },
  Author: {
    posts({ author: id }: PostQueryParams): Array<Post> {
      const { posts } = store.getState()
      // $FlowFixMe: https://github.com/facebook/flow/issues/1059
      return [...posts.values()]
        .filter(({ author }: Post): boolean => author === id)
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

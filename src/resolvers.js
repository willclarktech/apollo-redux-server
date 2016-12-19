// @flow
import type { Context } from 'koa'
import store from './store'
import validate from './validator'
import authenticate from './authenticator'
import logger from './logger'
import getMutationResponse from './responder'

import type {
  MutationParams,
  Author,
  Post,
  Secret,
  ID,
  WithID,
} from './types/flow'

export default {
  Query: {
    posts(): Array<WithID<Post>> {
      const { posts } = store.getState()
      // $FlowFixMe: https://github.com/facebook/flow/issues/1059
      return [...posts.entries()]
        .map(([id: ID, post: Post]) => ({
          ...post,
          id,
        }))
    },
    secrets(_: any, __: any, ctx: Context): Array<WithID<Secret>> {
      authenticate(ctx)
      const { user } = ctx.state
      const { secrets } = store.getState()
      // $FlowFixMe: https://github.com/facebook/flow/issues/1059
      return [...secrets.entries()]
        // eslint-disable-next-line no-unused-vars
        .filter(([id: ID, { authorId }: Secret]): boolean => authorId === user)
        .map(([id: ID, secret: Secret]) => ({
          ...secret,
          id,
        }))
    },
  },
  Post: {
    author({ authorId: id }: WithID<Post>): WithID<Author> {
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
    posts({ id }: WithID<Author>): Array<WithID<Post>> {
      const { posts } = store.getState()
      // $FlowFixMe: https://github.com/facebook/flow/issues/1059
      return [...posts.entries()]
        // eslint-disable-next-line no-unused-vars
        .filter(([postId: ID, { authorId }: Post]): boolean => authorId === id)
        .map(([postId: ID, post: Post]) => ({
          ...post,
          id: postId,
        }))
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

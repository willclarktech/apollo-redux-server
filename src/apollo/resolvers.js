// @flow
import logger from '../logger'
import storePromise from '../redux/store'
import validate from '../redux/validator'
import authenticate from './authenticator'
import {
  convertMapToArray,
  convertMapToArrayWithFilter,
  doesAuthorIdMatchUserId,
  getAuthorFromStoreById,
} from './helpers'

import type {
  AuthorWithID,
  Context,
  DispatchParams,
  DispatchResult,
  PostWithID,
  ReduxStore,
  Resolvers,
  SecretWithID,
} from '../types/flow'

const defineResolvers = (store: ReduxStore): Resolvers => {
  const getAuthorById = getAuthorFromStoreById(store)
  return {
    Query: {
      posts(): Array<PostWithID> {
        const { posts } = store.getState()
        return convertMapToArray(posts)
      },
      secrets(_: any, __: any, ctx: Context): Array<SecretWithID> {
        authenticate(ctx)
        const { user } = ctx.state
        if (!user) throw new Error('No user in context state.')
        const { secrets } = store.getState()

        return convertMapToArrayWithFilter(doesAuthorIdMatchUserId(user.id))(secrets)
      },
    },
    Post: {
      author({ authorId }: PostWithID): AuthorWithID {
        return getAuthorById(authorId)
      },
    },
    Secret: {
      author({ authorId }: SecretWithID): AuthorWithID {
        return getAuthorById(authorId)
      },
    },
    Author: {
      posts({ id }: AuthorWithID): Array<PostWithID> {
        const { posts } = store.getState()
        return convertMapToArrayWithFilter(doesAuthorIdMatchUserId(id))(posts)
      },
    },
    Mutation: {
      dispatch(_: any, { action }: DispatchParams, ctx: Context): Promise<DispatchResult> {
        validate(ctx)(action)
        authenticate(ctx)(action)

        return logger
          .log(action)
          .then(() => store.dispatch(action))
          .then(() => ({ success: true }))
          .catch(error => ctx.throw(error.status || 500, error.message))
      },
    },
  }
}

const initializeResolvers = (): Promise<Resolvers> =>
  storePromise
    .then(defineResolvers)

export default initializeResolvers

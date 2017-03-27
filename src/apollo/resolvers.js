// @flow
import type { Context } from 'koa'
import {
  AUTHORS,
  POSTS,
  SECRETS,
} from '../types/constants'
import logger from '../logger'
import initialiseStore from '../redux/store'
import validate from '../redux/validator'
import authenticate from './authenticator'
import { convertMapIntoObjectWithId } from './helpers'

import type {
  AuthorWithID,
  Converter,
  ConverterWithFilter,
  DispatchParams,
  DispatchResult,
  ID,
  PostWithID,
  ReduxStore,
  SecretWithID,
} from '../types/flow'

const doesAuthorIdMatchUserId = (userId: ID) =>
  ([/* key */, { authorId }: { authorId: ID }]): boolean =>
  userId === authorId

const convertToArray: Converter = map =>
  [...map.entries()]
    .map(convertMapIntoObjectWithId)

const convertToArrayWithFilter: ConverterWithFilter = filter => map =>
  [...map.entries()]
    .filter(filter)
    .map(convertMapIntoObjectWithId)

const defineResolvers = (store: ReduxStore): Object => {
  const getAuthorById = (id: ID): AuthorWithID => {
    const author = store
    .getState()
    .get(AUTHORS)
    .get(id)

    if (!author) {
      throw new Error(`Couldn’t find author with id ${id}`)
    }

    return convertMapIntoObjectWithId([id, author])
  }
  return {
    Query: {
      posts(): Array<PostWithID> {
        const posts = store
          .getState()
          .get(POSTS)

        return convertToArray(posts)
      },
      secrets(_: any, __: any, ctx: Context): Array<SecretWithID> {
        authenticate(ctx)
        const { user } = ctx.state
        const secrets = store
          .getState()
          .get(SECRETS)

        return convertToArrayWithFilter(doesAuthorIdMatchUserId(user.id))(secrets)
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
        const posts = store
          .getState()
          .get(POSTS)

        return convertToArrayWithFilter(doesAuthorIdMatchUserId(id))(posts)
      },
    },
    Mutation: {
      dispatch(_: any, { action }: DispatchParams, ctx: Context): DispatchResult {
        validate(ctx)(action)
        authenticate(ctx)(action)

        logger.logAction(action)
        store.dispatch(action)

        return { success: true }
      },
    },
  }
}

const initialiseResolvers = () =>
  initialiseStore().then(defineResolvers)

export default initialiseResolvers

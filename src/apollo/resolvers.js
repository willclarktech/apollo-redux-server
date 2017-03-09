// @flow
import type { Context } from 'koa'
import {
  AUTHORS,
  POSTS,
  SECRETS,
} from '../types/constants'
import logger from '../logger'
import store from '../redux/store'
import validate from '../redux/validator'
import authenticate from './authenticator'
import { convertMapIntoObjectWithId } from './helpers'

import type {
  AuthorWithID,
  Converter,
  ConverterWithFilter,
  ID,
  MutationDispatchResult,
  MutationParams,
  PostWithID,
  SecretWithID,
} from '../types/flow'

const doesAuthorIdMatchUser = (user: ID) =>
  ([, { authorId }: { authorId: ID }]): boolean =>
  user === authorId

const convertToArray: Converter = map =>
  [...map.entries()]
    .map(convertMapIntoObjectWithId)

const convertToArrayWithFilter: ConverterWithFilter = filter => map =>
  [...map.entries()]
    .filter(filter)
    .map(convertMapIntoObjectWithId)

export default {
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

      return convertToArrayWithFilter(doesAuthorIdMatchUser(user))(secrets)
    },
  },
  Post: {
    author({ authorId: id }: PostWithID): AuthorWithID {
      const author = store
        .getState()
        .get(AUTHORS)
        .get(id)

      if (!author) {
        throw new Error(`Couldn’t find author with id ${id}`)
      }

      return convertMapIntoObjectWithId([id, author])
    },
  },
  Author: {
    posts({ id }: AuthorWithID): Array<PostWithID> {
      const posts = store
        .getState()
        .get(POSTS)

      return convertToArrayWithFilter(doesAuthorIdMatchUser(id))(posts)
    },
  },
  Mutation: {
    dispatch(_: any, { action }: MutationParams, ctx: Context): MutationDispatchResult {
      validate(ctx)(action)
      authenticate(ctx)(action)

      logger.logAction(action)
      store.dispatch(action)

      return { success: true }
    },
  },
}

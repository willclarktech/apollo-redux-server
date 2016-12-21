// @flow
import type { Context } from 'koa'
import {
  AUTHOR_ID,
  AUTHORS,
  POSTS,
  SECRETS,
} from '../types/constants'
import logger from '../logger'
import store from '../redux/store'
import validate from '../redux/validator'
import authenticate from './authenticator'
import getMutationResponse from './responder'

import type {
  MutationParams,
  AuthorWithID,
  PostWithID,
  SecretWithID,
  ID,
} from '../types/flow'

const convertMapIntoObjectWithId = ([id, v]) => ({
  ...v.toObject(),
  id,
})

export default {
  Query: {
    posts(): Array<PostWithID> {
      const posts = store
        .getState()
        .get(POSTS)

      return [...posts.entries()]
        .map(convertMapIntoObjectWithId)
    },
    secrets(_: any, __: any, ctx: Context): Array<SecretWithID> {
      // authenticate(ctx)
      const { user } = ctx.state
      const secrets = store
        .getState()
        .get(SECRETS)

      return [...secrets.entries()]
        // eslint-disable-next-line no-unused-vars
        .filter(([id: ID, secret: Secret]): boolean => secret.get(AUTHOR_ID) === user)
        .map(convertMapIntoObjectWithId)
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

      return [...posts.entries()]
        // eslint-disable-next-line no-unused-vars
        .filter(([postId: ID, { authorId }: Post]): boolean => authorId === id)
        .map(convertMapIntoObjectWithId)
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

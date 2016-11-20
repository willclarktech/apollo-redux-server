// @flow
import { filter, find } from 'lodash'
import makeStore from './store'
import Logger from './logger'
import getMutationResponse from './responder'

import type {
  AuthorQueryParams,
  MutationParams,
  PostQueryParams,
  Author,
  Post,
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
    dispatch(_: any, { action }: MutationParams): any {
      logger.logAction(action)
      store.dispatch(action)
      return getMutationResponse(store.getState())(action)
    },
  },
}

import { filter, find } from 'lodash'
import makeStore from './store'
import Logger from './logger'
import getMutationResponse from './responder'

const logger = new Logger()
const store = makeStore()

export default {
  Query: {
    posts() {
      const { posts } = store.getState()
      return posts
    },
  },
  Post: {
    author({ authorId }) {
      const { authors } = store.getState()
      return find(authors, { id: authorId })
    },
  },
  Author: {
    posts({ id }) {
      const { posts } = store.getState()
      return filter(posts, { authorId: id })
    },
  },
  Mutation: {
    dispatch(_, { action }) {
      logger.logAction(action)
      store.dispatch(action)
      return getMutationResponse(store.getState())(action)
    },
  },
}

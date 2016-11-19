import { filter, find } from 'lodash'
import makeStore from './store'

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
      store.dispatch(action)

      const { posts } = store.getState()
      const post = find(posts, { id: action.postId })

      return post
    },
  },
}

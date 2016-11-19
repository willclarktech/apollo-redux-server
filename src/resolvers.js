import { filter, find } from 'lodash'
import makeStore from './store'

const store = makeStore()

const getMutationResponse = action => {
  switch (action.type) {
    case 'UPVOTE_POST': {
      const { posts } = store.getState()
      return find(posts, { id: action.postId })
    }
    case 'CREATE_POST': {
      const { posts } = store.getState()
      return posts[posts.length - 1]
    }
    default:
      return null
  }
}

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
      return getMutationResponse(action)
    },
  },
}

// @flow
import { find } from 'lodash'

import type {
  Action,
  AppState,
  CreatePostAction,
  UpvotePostAction,
} from './types/flow'

const upvotePost = (state: AppState) => (action: UpvotePostAction): AppState => {
  const { postId: id } = action
  const post = find(state.posts, { id })
  if (!post) throw new Error(`Couldn’t find post with id ${id}`)
  post.votes += 1
  return state
}

const createPost = (state: AppState) => (action: CreatePostAction): AppState => {
  const { authorId, title } = action
  state.posts.push({
    id: state.posts.length + 1,
    authorId,
    title,
    votes: 0,
  })
  return state
}

export default (initialState: ?AppState) => (
  state: ?AppState = initialState,
  action: Action,
): AppState => {
  if (!state) {
    throw new Error('No initial state provided')
  }
  switch (action.type) {
    case 'UPVOTE_POST':
      return upvotePost(state)(action)
    case 'CREATE_POST':
      return createPost(state)(action)
    default:
      return state
  }
}

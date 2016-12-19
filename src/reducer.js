// @flow
import type {
  Action,
  AppState,
  CreateAuthorPrivateAction,
  // CreatePostPrivateAction,
  CreatePostPublicAction,
  // UpvotePostPrivateAction,
  UpvotePostPublicAction,
} from './types/flow'

const upvotePost = (state: AppState) => (action: UpvotePostPublicAction): AppState => {
  const { posts } = state
  const { postId } = action
  const post = posts.get(postId)
  if (!post) throw new Error(`Couldn’t find post with id ${postId}`)
  post.votes += 1
  return state
}

const createPost = (state: AppState) => (action: CreatePostPublicAction): AppState => {
  const { posts } = state
  const { authorId, title } = action
  const id = `${posts.size + 1}`
  posts.set(id, {
    authorId,
    title,
    votes: 0,
  })
  return state
}

const createAuthor = (state: AppState) => (action: CreateAuthorPrivateAction): AppState => {
  const { authors } = state
  const { authorId, name } = action
  const id = authorId ? authorId : `${authors.size + 1}`
  authors.set(id, { name })
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
    case 'CREATE_AUTHOR':
      return createAuthor(state)(action)
    default:
      return state
  }
}

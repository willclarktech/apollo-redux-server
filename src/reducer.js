// @flow
import {
  AuthorRecord,
  PostRecord,
} from './types/immutable'
import type {
  Action,
  AppState,
  CreateAuthorPrivateAction,
  CreatePostPublicAction,
  Post,
  UpvotePostPublicAction,
} from './types/flow'

const upvotePost = (state: AppState) => (action: UpvotePostPublicAction): AppState => {
  const { postId } = action
  const posts = state.get('posts')
  const oldPost = posts.get(postId)
  if (!oldPost) throw new Error(`Couldn’t find post with id ${postId}`)
  const oldVotes = oldPost.get('votes')

  const newPost = oldPost.set('votes', oldVotes + 1)
  const newPosts = posts.set(postId, newPost)
  return state.set('posts', newPosts)
}

const createPost = (state: AppState) => (action: CreatePostPublicAction): AppState => {
  const { authorId, title } = action
  const posts = state.get('posts')
  const id = `${posts.size + 1}`
  const newPost: Post = PostRecord({
    authorId,
    title,
    votes: 0,
  })
  const newPosts = posts.set(id, newPost)
  return state.set('posts', newPosts)
}

const createAuthor = (state: AppState) => (action: CreateAuthorPrivateAction): AppState => {
  const authors = state.get('authors')
  const { authorId, name } = action
  const id = authorId ? authorId : `${authors.size + 1}`
  const newAuthor = AuthorRecord({ name })
  const newAuthors = authors.set(id, newAuthor)
  return state.set('authors', newAuthors)
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

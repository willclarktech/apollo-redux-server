// @flow
import type {
  Action,
  AppState,
  Author,
  CreateAuthorPrivateAction,
  CreatePostPublicAction,
  Post,
  UpvotePostPublicAction,
} from '../types/flow'

const upvotePost = (state: AppState) => (action: UpvotePostPublicAction): AppState => {
  const { postId } = action
  const { posts } = state
  const post = posts.get(postId)
  if (!post) throw new Error(`Couldn’t find post with id ${postId}.`)
  const { votes } = post
  const newPosts = posts.set(postId, {
    ...post,
    votes: votes + 1,
  })
  return {
    ...state,
    posts: newPosts,
  }
}

const createPost = (state: AppState) => (action: CreatePostPublicAction): AppState => {
  const { authorId, title } = action
  const { posts } = state
  const id = `${posts.size + 1}`
  const newPost: Post = {
    authorId,
    title,
    votes: 0,
  }
  const newPosts = posts.set(id, newPost)
  return {
    ...state,
    posts: newPosts,
  }
}

const createAuthor = (state: AppState) => (action: CreateAuthorPrivateAction): AppState => {
  const { authors } = state
  const { authorId, name } = action
  const id = authorId ? authorId : `${authors.size + 1}`
  const newAuthor: Author = { name }
  const newAuthors = authors.set(id, newAuthor)
  return {
    ...state,
    authors: newAuthors,
  }
}

export default (initialState: ?AppState) => (
  state: ?AppState = initialState,
  action: Action,
): AppState => {
  if (!state) {
    throw new Error('No initial state provided.')
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

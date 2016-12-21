// @flow
import { POSTS } from '../types/constants'
import type {
  Action,
  AppState,
  Post,
  UpvotePostPublicAction,
} from '../types/flow'

const POST_NOT_FOUND_ERROR = (id: string) => `Couldn’t find a post with id ${id}`

const getUpvotePostResponse = (state: AppState) =>
  ({ postId }: UpvotePostPublicAction): Post => {
    const post = state
      .get(POSTS)
      .get(postId)

    if (!post) {
      throw new Error(POST_NOT_FOUND_ERROR(postId))
    }
    return post
  }

const getCreatePostResponse = (state: AppState) =>
  (): Post => {
    const posts = state.get(POSTS)
    const id = `${posts.size}`
    const post = posts.get(id)
    if (!post) {
      throw new Error(POST_NOT_FOUND_ERROR(id))
    }
    return post
  }

export default (state: AppState) => (action: Action): any => {
  switch (action.type) {
    case 'UPVOTE_POST':
      return getUpvotePostResponse(state)(action)
    case 'CREATE_POST':
      return getCreatePostResponse(state)(action)
    default:
      return null
  }
}
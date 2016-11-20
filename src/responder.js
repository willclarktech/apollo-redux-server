// @flow
import { find } from 'lodash'

import type {
  Action,
  AppState,
  Post,
  UpvotePostAction,
} from './types/flow'

const getUpvotePostResponse = ({ posts }: AppState) => (action: UpvotePostAction): Post =>
  find(posts, { id: action.postId })

const getCreatePostResponse = ({ posts }: AppState) => (): Post =>
  posts[posts.length - 1]

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

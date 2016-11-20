// @flow
import type {
  Author,
  Post,
} from './domain.types'

export type AppState = {
  authors: Array<Author>,
  posts: Array<Post>,
}

export type UpvotePostAction = {
  type: 'UPVOTE_POST',
  postId: number,
}

export type CreatePostAction = {
  type: 'CREATE_POST',
  authorId: number,
  title: string,
}

export type Action
  = UpvotePostAction
  | CreatePostAction

export type Reducer = (state: AppState, action: Action) => AppState

export type ReduxStore = {
  dispatch: (action: Action) => AppState,
  getState: () => AppState,
}

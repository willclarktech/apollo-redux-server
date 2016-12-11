// @flow
import type {
  Author,
  Post,
  Secret,
} from './domain.types'

export type AppState = {|
  authors: Array<Author>,
  posts: Array<Post>,
  secrets: Array<Secret>,
|}

export type UpvotePostAction = {
  type: 'UPVOTE_POST',
  postId: number,
}

export type CreatePostAction = {
  type: 'CREATE_POST',
  authorId: number,
  title: string,
}

export type CreateAuthorAction = {
  type: 'CREATE_AUTHOR',
  id: number,
  name: string,
}

type PublicAction
  = UpvotePostAction
  | CreatePostAction

type PrivateAction
  = CreateAuthorAction

export type Action
  = PublicAction
  | PrivateAction

export type Reducer = (state: AppState, action: Action) => AppState

export type ReduxStore = {
  dispatch: (action: Action) => AppState,
  getState: () => AppState,
}

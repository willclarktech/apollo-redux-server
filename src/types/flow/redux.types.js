// @flow
import type {
  Author,
  Post,
  Secret,
} from './domain.types'
import type { ID } from './helper.types'

export type AppState = {|
  authors: Map<ID, Author>,
  posts: Map<ID, Post>,
  secrets: Map<ID, Secret>,
|}

export type UpvotePostPublicAction = {
  type: 'UPVOTE_POST',
  post: ID,
}

export type CreatePostPublicAction = {
  type: 'CREATE_POST',
  author: ID,
  title: string,
}

export type UpvotePostPrivateAction
  = UpvotePostPublicAction

export type CreatePostPrivateAction
  = CreatePostPublicAction
  & {
    post: ID,
  }

export type CreateAuthorPrivateAction = {
  type: 'CREATE_AUTHOR',
  author: ID,
  name: string,
}

export type PublicAction
  = UpvotePostPublicAction
  | CreatePostPublicAction

export type PrivateAction
  = UpvotePostPrivateAction
  | CreatePostPrivateAction
  | CreateAuthorPrivateAction

export type Action
  = PublicAction
  | PrivateAction

export type Reducer = (state: AppState, action: Action) => AppState

export type ReduxStore = {
  dispatch: (action: Action) => AppState,
  getState: () => AppState,
}

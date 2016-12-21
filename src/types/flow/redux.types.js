// @flow
import type {
  Map as ImmutableMap,
  Record as ImmutableRecord,
} from 'immutable'
import type {
  Author,
  Post,
  Secret,
} from './domain.types'
import type { ID } from './helper.types'

export type AppStateObject = {
  authors: ImmutableMap<ID, Author>,
  posts: ImmutableMap<ID, Post>,
  secrets: ImmutableMap<ID, Secret>,
}

export type AppState = ImmutableRecord<AppStateObject>

export type UpvotePostPublicAction = {
  type: 'UPVOTE_POST',
  postId: ID,
}

export type CreatePostPublicAction = {
  type: 'CREATE_POST',
  authorId: ID,
  title: string,
}

export type UpvotePostPrivateAction
  = UpvotePostPublicAction

export type CreatePostPrivateAction
  = CreatePostPublicAction
  & {
    postId: ID,
  }

export type CreateAuthorPrivateAction = {
  type: 'CREATE_AUTHOR',
  authorId: ID,
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

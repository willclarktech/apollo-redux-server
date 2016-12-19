// @flow
import type { ID } from './helper.types'
import type { Action } from './redux.types'

export type MutationParams = {
  action: Action,
}

export type PostQueryParams = {
  authorId: ID,
}

export type AuthorQueryParams = {
  authorId: ID,
}

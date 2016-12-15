// @flow
import type { ID } from './helper.types'
import type { Action } from './redux.types'

export type MutationParams = {
  action: Action,
}

export type PostQueryParams = {
  author: ID,
}

export type AuthorQueryParams = {
  author: ID,
}

// @flow
import type {
  Action,
} from './redux.types'

export type MutationParams = {
  action: Action,
}

export type PostQueryParams = {
  authorId: number,
}

export type AuthorQueryParams = {
  id: number,
}

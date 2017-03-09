// @flow
import type { PublicAction } from './redux.types'

export type MutationDispatchResult = {
  success: boolean,
}

export type MutationParams = {
  action: PublicAction,
}

// @flow
import type { PublicAction } from './redux.types'

export type DispatchParams = {
  action: PublicAction,
}

export type DispatchResult = {
  success: boolean,
}

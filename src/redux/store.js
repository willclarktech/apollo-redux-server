// @flow
import { createStore } from 'redux'
import createReducer from './reducer'
import INITIAL_STATE from './initialState'
import { getLoggedActions } from './helpers'

import type {
  Action,
  AppState,
  Reducer,
  ReduxStore,
} from '../types/flow'

const initializeStore = async (): Promise<ReduxStore> => {
  const loggedActions: Array<Action> = await getLoggedActions()

  const initializedState: AppState =
    loggedActions.reduce(createReducer(), INITIAL_STATE)

  const reducer: Reducer = createReducer(initializedState)
  return createStore(reducer)
}

const storePromise = initializeStore()
export default storePromise

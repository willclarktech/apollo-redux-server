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

const loggedActions: Array<Action> = getLoggedActions()

const initialisedState: AppState =
  loggedActions.reduce(createReducer(), INITIAL_STATE)

const reducer: Reducer = createReducer(initialisedState)

const store: ReduxStore = createStore(reducer)

export default store

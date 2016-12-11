// @flow
import fs from 'fs'
import { createStore } from 'redux'
import createReducer from './reducer'

import type {
  Action,
  AppState,
  Reducer,
  ReduxStore,
} from './types/flow'

const INITIAL_STATE: AppState = {
  authors: [
    { id: 1, firstName: 'Tom', lastName: 'Coleman' },
    { id: 2, firstName: 'Sashko', lastName: 'Stubailo' },
    { id: 11036220, firstName: 'Will', lastName: 'Clark' },
  ],
  posts: [
    { id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2 },
    { id: 2, authorId: 2, title: 'GraphQL Rocks', votes: 3 },
    { id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1 },
  ],
  secrets: [
    { id: 1, userId: 11036220, content: 'This is a secret!' },
    { id: 2, userId: 11036221, content: 'This is someone else’s secret' },
  ],
}

const ACTIONS: Array<Action> =
  fs.readFileSync('actions.log', 'utf-8')
    .split('\n')
    .filter(action => !!action)
    .map(action => JSON.parse(action))

const initialisedState: AppState =
  ACTIONS.reduce(createReducer(), INITIAL_STATE)

const reducer: Reducer = createReducer(initialisedState)

export default (): ReduxStore => createStore(reducer)

import fs from 'fs'
import { createStore } from 'redux'
import createReducer from './reducer'

const INITIAL_STATE = {
  authors: [
    { id: 1, firstName: 'Tom', lastName: 'Coleman' },
    { id: 2, firstName: 'Sashko', lastName: 'Stubailo' },
  ],
  posts: [
    { id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2 },
    { id: 2, authorId: 2, title: 'GraphQL Rocks', votes: 3 },
    { id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1 },
  ],
}

const ACTIONS =
  fs.readFileSync('actions.log', 'utf-8')
    .split('\n')
    .filter(action => !!action)
    .map(JSON.parse)

const initialisedState =
  ACTIONS.reduce(createReducer(), INITIAL_STATE)

const reducer = createReducer(initialisedState)

export default () => createStore(reducer)

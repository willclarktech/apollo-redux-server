// @flow
import fs from 'fs'
import { createStore } from 'redux'
import {
  Map as ImmutableMap,
} from 'immutable'
import createReducer from './reducer'
import {
  makeNewRecord,
  AppStateRecord,
  AuthorRecord,
  PostRecord,
  SecretRecord,
} from './types/immutable'

import type {
  Action,
  AppState,
  Author,
  Post,
  Reducer,
  ReduxStore,
  Secret,
} from './types/flow'

const INITIAL_AUTHORS: Array<Author> = [
  { name: 'Tom Coleman' },
  { name: 'Sashko Stubailo' },
].map(makeNewRecord(AuthorRecord))

const INITIAL_POSTS: Array<Post> = [
  { authorId: '1', title: 'Introduction to GraphQL', votes: 2 },
  { authorId: '2', title: 'GraphQL Rocks', votes: 3 },
  { authorId: '2', title: 'Advanced GraphQL', votes: 1 },
].map(makeNewRecord(PostRecord))

const INITIAL_SECRETS: Array<Secret> = [
  { authorId: '11036220', content: 'This is a secret!' },
  { authorId: '11036221', content: 'This is someone else’s secret' },
].map(makeNewRecord(SecretRecord))

const INITIAL_STATE: AppState = new AppStateRecord({
  authors: ImmutableMap(
    INITIAL_AUTHORS.map((a, i) => [(i + 1).toString(), a]),
  ),
  posts: ImmutableMap(
    INITIAL_POSTS.map((p, i) => [(i + 1).toString(), p]),
  ),
  secrets: ImmutableMap(
    INITIAL_SECRETS.map((s, i) => [(i + 1).toString(), s]),
  ),
})

const ACTIONS: Array<Action> =
  fs.readFileSync('actions.log', 'utf-8')
    .split('\n')
    .filter(action => !!action)
    .map(action => JSON.parse(action))

const initialisedState: AppState =
  ACTIONS.reduce(createReducer(), INITIAL_STATE)

const reducer: Reducer = createReducer(initialisedState)

const store: ReduxStore = createStore(reducer)

export default store

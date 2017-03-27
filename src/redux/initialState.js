// @flow
import { Map as ImmutableMap } from 'immutable'
import { createTupleWithId } from './helpers'
import {
  makeNewRecord,
  AppStateRecord,
  AuthorRecord,
  PostRecord,
  SecretRecord,
} from '../types/immutable'

import type {
  AppState,
  Author,
  Post,
  Secret,
} from '../types/flow'

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
  authors: ImmutableMap(INITIAL_AUTHORS.map(createTupleWithId)),
  posts: ImmutableMap(INITIAL_POSTS.map(createTupleWithId)),
  secrets: ImmutableMap(INITIAL_SECRETS.map(createTupleWithId)),
})

export default INITIAL_STATE

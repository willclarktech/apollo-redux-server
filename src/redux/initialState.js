// @flow
import type {
  AppState,
  Author,
  ID,
  Post,
  Secret,
} from '../types/flow'

const createTupleWithId = <V>(v: V, i: number): [ID, V] => [(i + 1).toString(), v]

const authors: Map<ID, Author> = new Map([
  { name: 'Tom Coleman' },
  { name: 'Sashko Stubailo' },
].map(createTupleWithId))

const posts: Map<ID, Post> = new Map([
  { authorId: '1', title: 'Introduction to GraphQL', votes: 2 },
  { authorId: '2', title: 'GraphQL Rocks', votes: 3 },
  { authorId: '2', title: 'Advanced GraphQL', votes: 1 },
].map(createTupleWithId))

const secrets: Map<ID, Secret> = new Map([
  { authorId: '11036220', content: 'This is a secret!' },
  { authorId: '11036221', content: 'This is someone else’s secret' },
].map(createTupleWithId))

const initialState: AppState = {
  authors,
  posts,
  secrets,
}

export default initialState

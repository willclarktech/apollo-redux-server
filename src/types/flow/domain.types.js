// @flow
import type { ID } from './helper.types'

export type Author = {
  name: string,
}

export type Post = {
  author: ID,
  title: string,
  votes: number,
}

export type Secret = {
  author: ID,
  content: string,
}

export type WithID<T>
  = T
  & { id: ID }

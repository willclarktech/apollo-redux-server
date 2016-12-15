// @flow
import type { ID } from './helper.types'

export type Author = {
  id: ID,
  name: string,
}

export type Post = {
  id: ID,
  author: ID,
  title: string,
  votes: number,
}

export type Secret = {
  id: ID,
  author: ID,
  content: string,
}

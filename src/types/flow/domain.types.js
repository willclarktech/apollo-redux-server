// @flow
import type { ID } from './helper.types'

export type Author = {
  name: string,
}

export type Post = {
  authorId: ID,
  title: string,
  votes: number,
}

export type Secret = {
  authorId: ID,
  content: string,
}

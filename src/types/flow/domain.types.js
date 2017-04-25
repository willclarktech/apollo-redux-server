// @flow
import type { ID, WithID } from './helper.types'

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

export type DomainObject
  = Author
  | Post
  | Secret

export type AuthorWithID = WithID<Author>
export type PostWithID = WithID<Post>
export type SecretWithID = WithID<Secret>

// @flow
import type { Record as ImmutableRecord } from 'immutable'
import type { ID, WithID } from './helper.types'

export type AuthorObject = {
  name: string,
}

export type PostObject = {
  authorId: ID,
  title: string,
  votes: number,
}

export type SecretObject = {
  authorId: ID,
  content: string,
}

export type Author = ImmutableRecord<AuthorObject>
export type Post = ImmutableRecord<PostObject>
export type Secret = ImmutableRecord<SecretObject>

export type AuthorWithID = WithID<AuthorObject>
export type PostWithID = WithID<PostObject>
export type SecretWithID = WithID<SecretObject>

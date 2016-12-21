// @flow
import {
  Map as ImmutableMap,
  Record as ImmutableRecord,
} from 'immutable'

export const AuthorRecord = ImmutableRecord({ name: '' })
export const PostRecord = ImmutableRecord({
  authorId: '',
  title: '',
  votes: 0,
})
export const SecretRecord = ImmutableRecord({
  authorId: '',
  content: '',
})

type RecordClassType
  = AuthorRecord
  | PostRecord
  | SecretRecord

export const makeNewRecord = (RecordClass: RecordClassType) => (obj: Object) =>
    new RecordClass(obj)

export const AppStateRecord = ImmutableRecord({
  authors: ImmutableMap(),
  posts: ImmutableMap(),
  secrets: ImmutableMap(),
})

// @flow
import {
  Map as ImmutableMap,
  Record as ImmutableRecord,
} from 'immutable'
import {
  AUTHORS,
  POSTS,
  SECRETS,
  VOTES,
} from '../../constants'

export const AuthorRecord = ImmutableRecord({ name: '' })
export const PostRecord = ImmutableRecord({
  authorId: '',
  title: '',
  [VOTES]: 0,
})
export const SecretRecord = ImmutableRecord({
  authorId: '',
  content: '',
})

export const AppStateRecord = ImmutableRecord({
  [AUTHORS]: ImmutableMap(),
  [POSTS]: ImmutableMap(),
  [SECRETS]: ImmutableMap(),
})

type RecordClassType
  = AuthorRecord
  | PostRecord
  | SecretRecord

export const makeNewRecord = (RecordClass: RecordClassType) => (obj: Object) =>
    new RecordClass(obj)

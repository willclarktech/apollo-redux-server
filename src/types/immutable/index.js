// @flow
import {
  Map as ImmutableMap,
  Record as ImmutableRecord,
} from 'immutable'
import {
  AUTHOR_ID,
  AUTHORS,
  POSTS,
  SECRETS,
  VOTES,
} from '../constants'

export const AuthorRecord = ImmutableRecord({ name: '' })
export const PostRecord = ImmutableRecord({
  [AUTHOR_ID]: '',
  title: '',
  [VOTES]: 0,
})
export const SecretRecord = ImmutableRecord({
  [AUTHOR_ID]: '',
  content: '',
})

export const AppStateRecord = ImmutableRecord({
  [AUTHORS]: ImmutableMap(),
  [POSTS]: ImmutableMap(),
  [SECRETS]: ImmutableMap(),
})

export type RecordClassType
  = AuthorRecord
  | PostRecord
  | SecretRecord

export const makeNewRecord = (RecordClass: RecordClassType) => (obj: Object) =>
    new RecordClass(obj)

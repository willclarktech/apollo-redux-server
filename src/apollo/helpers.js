// @flow
import type { RecordClassType } from '../types/immutable'

// eslint-disable-next-line import/prefer-default-export
export const convertMapIntoObjectWithId = ([id, v]: [string, RecordClassType]) => ({
  ...v.toObject(),
  id,
})

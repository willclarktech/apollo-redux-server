// @flow
import type {
  DomainObject,
  ID,
} from '../types/flow'

// eslint-disable-next-line import/prefer-default-export
export const convertMapIntoObjectWithId = ([id, value]: [ID, DomainObject]) => ({
  ...value,
  id,
})

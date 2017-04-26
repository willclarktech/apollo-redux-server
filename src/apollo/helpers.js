// @flow
import type {
  Converter,
  ConverterWithFilter,
  DomainObject,
  ID,
} from '../types/flow'

export const convertMapToObjectWithId = ([id, value]: [ID, DomainObject]) => ({
  ...value,
  id,
})

export const convertMapToArray: Converter = map =>
[...map.entries()]
  .map(convertMapToObjectWithId)

export const convertMapToArrayWithFilter: ConverterWithFilter = filter => map =>
[...map.entries()]
  .filter(filter)
  .map(convertMapToObjectWithId)

export const doesAuthorIdMatchUserId = (userId: ID) =>
  ([/* id */, { authorId }]: [any, { authorId: ID }]): boolean =>
  userId === authorId

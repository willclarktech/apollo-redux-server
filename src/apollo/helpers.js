// @flow
import type {
  AuthorWithID,
  Converter,
  ConverterWithFilter,
  DomainObject,
  ID,
  ReduxStore,
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

export const getAuthorFromStoreById = (store: ReduxStore) => (id: ID): AuthorWithID => {
  const { authors } = store.getState()
  const author = authors.get(id)

  if (!author) {
    throw new Error(`Couldn’t find author with id ${id}.`)
  }

  return convertMapToObjectWithId([id, author])
}

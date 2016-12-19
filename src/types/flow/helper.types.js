// @flow
export type ID = string

export type WithID<T>
  = T
  & { id: ID }

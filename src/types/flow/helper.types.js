// @flow
export type ID = string

export type WithID<T>
  = T
  & { id: ID }

export type Converter = (map: any) => Array<WithID<Object>>

export type ConverterWithFilter =
  (filter: (item: any) => boolean) => Converter

import type Action from './redux.types'

export type LogWithoutHash = {|
  action: Action,
  meta: {
    timestamp: date,
    previousHash: string,
  },
|}

export type Log = LogWithoutHash & {|
  hash: string,
|}

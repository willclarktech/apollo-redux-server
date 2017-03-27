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

export type LogAggregator = {|
  previousHash: string,
  validLogs: Array<Log>,
|}

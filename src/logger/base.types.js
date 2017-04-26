// @flow
export type LogWithoutHash<D> = {
  data: D,
  meta: {|
    timestamp: Date,
    previousHash: string,
  |},
}

export type Log<D> = LogWithoutHash<D> & {
  hash: string,
}

export type LogAggregator = {|
  previousHash: string,
  validLogs: Array<Log<any>>,
|}

export type LoggerOptions = {
  genesisHash: string,
}

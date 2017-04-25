// @flow
import logger from '../logger'
import type {
  LogAggregator,
  Log,
} from '../types/flow'

const ensureHashConsistency = (aggregator: LogAggregator, log: Log): LogAggregator => {
  const { previousHash, validLogs } = aggregator
  const { hash, meta } = log
  return meta.previousHash === previousHash
    ? {
      previousHash: hash,
      validLogs: [...validLogs, log],
    }
    : aggregator
}

const getInitialLogAggregator = (): LogAggregator => {
  if (!process.env.GENESIS_HASH) {
    throw new Error('Genesis hash not set in environment.')
  }
  return {
    previousHash: process.env.GENESIS_HASH,
    validLogs: [],
  }
}

export const getLoggedActions = () =>
  logger
    .getLogs()
    .then(logs => process.env.ENSURE_HASH_CONSISTENCY
      ? logs
        .reduce(ensureHashConsistency, getInitialLogAggregator())
        .validLogs
      : logs,
    )
    .then(logs => logs.map(log => log.action))

export const createTupleWithId = (v: any, i: number) => [(i + 1).toString(), v]

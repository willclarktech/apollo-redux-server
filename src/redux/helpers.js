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


const initialLogAggregator: LogAggregator = {
  previousHash: process.env.GENESIS_HASH,
  validLogs: [],
}

// eslint-disable-next-line import/prefer-default-export
export const getLoggedActions = () => {
  const logs = logger.getLogs()
  const validLogs = process.env.ENSURE_HASH_CONSISTENCY
    ? logs
      .reduce(ensureHashConsistency, initialLogAggregator)
      .validLogs
    : logs

  return validLogs
    .map(log => log.action)
}

export const createTupleWithId = (v: any, i: number) => [(i + 1).toString(), v]

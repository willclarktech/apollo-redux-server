// @flow
/* eslint-disable immutable/no-mutation, immutable/no-this, class-methods-use-this */
import crypto from 'crypto'
import type {
  Log,
  LogAggregator,
  LogWithoutHash,
} from '../types/flow'

export type LoggerOptions = {
  genesisHash: string,
}

class Logger<D> {
  genesisHash: string
  mostRecentHash: ?string

  constructor({
    genesisHash,
  }: LoggerOptions) {
    this.genesisHash = genesisHash
  }

  // eslint-disable-next-line no-unused-vars
  async store(logString: string): Promise<boolean> {
    throw new Error('`store` method on Logger class should be overwritten by children.')
  }

  // eslint-disable-next-line no-unused-vars
  async getLogs(n: ?number): Promise<Array<Log<D>>> {
    throw new Error('`getLogs` method on Logger class should be overwritten by children.')
  }

  async constructLogFromData(data: D): Promise<Log<D>> {
    const previousHash = await this.getMostRecentHash()
    const logWithoutHash = {
      data,
      meta: {
        timestamp: new Date(),
        previousHash,
      },
    }
    const hash = this.getHashForLog(logWithoutHash)
    return {
      ...logWithoutHash,
      hash,
    }
  }

  getHashForLog(log: LogWithoutHash<D>): string {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(log), 'utf8')
      .digest('hex')
  }

  getLoggedData(ensureHashConsistency: ?boolean): Promise<Array<D>> {
    const removeInconsistentLogs = (aggregator: LogAggregator, log: Log<D>): LogAggregator => {
      const { previousHash, validLogs } = aggregator
      const { hash, meta } = log
      return meta.previousHash === previousHash
        ? {
          previousHash: hash,
          validLogs: [...validLogs, log],
        }
        : aggregator
    }

    const initialLogAggregator = {
      previousHash: this.genesisHash,
      validLogs: [],
    }

    return this.getLogs()
      .then(logs => ensureHashConsistency
        ? logs
          .reduce(removeInconsistentLogs, initialLogAggregator)
          .validLogs
        : logs,
      )
      .then(logs => logs
        .map(log => log.data)
        .filter(Boolean),
      )
  }

  async getMostRecentHash(): Promise<string> {
    return this.mostRecentHash
      || this.getLogs(1)
        .then(logs => {
          const l = logs.length
          const hash = l
            ? logs[l - 1].hash
            : this.genesisHash
          return this.setMostRecentHash(hash)
        })
  }

  async log(data: D): Promise<string> {
    const log = await this.constructLogFromData(data)
    const logString = JSON.stringify(log)
    return this.store(logString)
      .then(this.setMostRecentHash.bind(this, log.hash))
  }

  setMostRecentHash(hash: string): string {
    this.mostRecentHash = hash
    return this.mostRecentHash
  }
}

export default Logger

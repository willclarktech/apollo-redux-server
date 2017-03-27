// @flow
import fs from 'fs'
import type {
  Action,
  Log,
  LogWithoutHash,
} from '../types/flow'
import {
  getHashForAction,
  getLogFileName,
  getMostRecentHash,
} from './helpers'

class Logger {
  stream: stream$Writable & { path?: string }
  mostRecentHash: string

  constructor(): void {
    this.refreshStream()
    this.mostRecentHash = getMostRecentHash()
  }

  refreshStream(): void {
    const fileName = getLogFileName()
    const newStreamRequired = !this.stream || this.stream.path !== fileName
    if (newStreamRequired) {
      if (this.stream) {
        this.stream.end()
      }
      this.stream = fs.createWriteStream(fileName, { flags: 'a' })
    }
  }

  populateActionWithMeta(action: Action): LogWithoutHash {
    return {
      action,
      meta: {
        timestamp: new Date(),
        previousHash: this.mostRecentHash,
      },
    }
  }

  logAction(action: Action): string {
    this.refreshStream()

    const actionWithMeta = this.populateActionWithMeta(action)
    const hash = getHashForAction(actionWithMeta)
    const actionToLog: Log = {
      ...actionWithMeta,
      hash,
    }

    this.stream.write(`${JSON.stringify(actionToLog)}\n`)
    this.mostRecentHash = hash
    return hash
  }
}

const logger = new Logger()

export default logger

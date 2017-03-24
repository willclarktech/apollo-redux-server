// @flow
import fs from 'fs'
import crypto from 'crypto'
import type {
  Action,
} from '../types/flow'
import { getLogFileName } from './helpers'

const getHashForAction = (action: Action): string =>
  crypto
    .createHash('sha256')
    .update(JSON.stringify(action))
    .digest('hex')

class Logger {
  stream: stream$Writable & { path?: string }
  mostRecentHash: string

  constructor(): void {
    this.refreshStream()
    this.mostRecentHash = 'xxx'
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

  populateActionWithMeta(action: Action): Object {
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
    const actionToLog = {
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

// @flow
import fs from 'fs'
import type {
  Action,
} from '../types/flow'
import { getLogFileName } from './helpers'

class Logger {
  stream: stream$Writable & { path?: string }

  constructor(): void {
    this.refreshStream()
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

  logAction(action: Action): boolean {
    this.refreshStream()
    return this.stream.write(`${JSON.stringify(action)}\n`)
  }
}

const logger = new Logger()

export default logger

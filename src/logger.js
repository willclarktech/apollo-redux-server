// @flow
import fs from 'fs'
import type {
  Action,
} from './types/flow'

export default class Logger {
  stream: stream$Writable
  constructor(fileName: string = 'actions.log'): void {
    this.stream =
      fs.createWriteStream(fileName, { flags: 'a' })
  }

  logAction(action: Action): boolean {
    return this.stream
      .write(`${JSON.stringify(action)}\n`)
  }
}

// @flow
import fs from 'fs'
import { flatten } from 'lodash'
import type {
  Action,
  Log,
} from '../types/flow'
import { constructActionToLog } from './helpers'

class LocalFileLogger {
  logPath: string
  stream: stream$Writable & { path?: string }
  genesisHash: string
  mostRecentHash: string

  constructor(): void {
    this.logPath = './logs/'
    const { GENESIS_HASH } = process.env
    if (typeof GENESIS_HASH !== 'string') {
      throw new Error('GENESIS_HASH not set in environment.')
    }
    this.genesisHash = GENESIS_HASH
    this.mostRecentHash = this.getMostRecentHash()

    this.refreshStream()
  }

  getLogFileName(): string {
    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    return `${this.logPath}actions_${today}.log`
  }

  async getLogs(): Promise<Array<Log>> {
    const logFiles = fs.readdirSync(this.logPath)
    return flatten(logFiles.map(this.getLogsFromFile.bind(this)))
  }

  getLogsFromFile(file: string): Array<Log> {
    return fs
      .readFileSync(`${this.logPath}${file}`, 'utf-8')
      .split('\n')
      .filter(action => !!action)
      .map(action => JSON.parse(action))
  }

  getMostRecentHash(): string {
    const logFiles = fs.readdirSync(this.logPath)
    const lastLogFile = logFiles[logFiles.length - 1]
    const actions = this.getLogsFromFile(lastLogFile)
    const lastAction = actions[actions.length - 1]
    return lastAction ? lastAction.hash : this.genesisHash
  }

  async logAction(action: Action): Promise<string> {
    const actionToLog: Log = constructActionToLog(action)(this.mostRecentHash)

    this.refreshStream()
    this.stream.write(`${JSON.stringify(actionToLog)}\n`)

    const { hash } = actionToLog
    this.mostRecentHash = hash
    return hash
  }

  refreshStream(): void {
    const fileName = this.getLogFileName()
    const newStreamRequired = !this.stream || this.stream.path !== fileName
    if (newStreamRequired) {
      if (this.stream) {
        this.stream.end()
      }
      this.stream = fs.createWriteStream(fileName, { flags: 'a' })
    }
  }
}

export default LocalFileLogger

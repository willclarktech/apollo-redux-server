// @flow
import fs from 'fs'
import crypto from 'crypto'
import { flatten } from 'lodash'
import type {
  Action,
  Log,
} from '../types/flow'

const { GENESIS_HASH } = process.env
if (typeof GENESIS_HASH !== 'string') {
  throw new Error('GENESIS_HASH not set')
}

export const LOG_PATH = './logs/'

export const getLogFileName = (): string => {
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  return `${LOG_PATH}actions_${today}.log`
}

const getLogsFromFile = (file: string): Array<Log> =>
  fs.readFileSync(`${LOG_PATH}${file}`, 'utf-8')
    .split('\n')
    .filter(action => !!action)
    .map(action => JSON.parse(action))

export const getLogs = (): Array<Log> => {
  const logFiles = fs.readdirSync(LOG_PATH)
  return flatten(logFiles.map(getLogsFromFile))
}

export const getMostRecentHash = (): string => {
  const logFiles = fs.readdirSync(LOG_PATH)
  const lastLogFile = logFiles[logFiles.length - 1]
  const actions = getLogsFromFile(lastLogFile)
  const lastAction = actions[actions.length - 1]
  return lastAction ? lastAction.hash : GENESIS_HASH
}

export const getHashForAction = (action: Action): string =>
  crypto
    .createHash('sha256')
    .update(JSON.stringify(action))
    .digest('hex')

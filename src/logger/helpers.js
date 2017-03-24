// @flow
import fs from 'fs'
import { flatten } from 'lodash'
import type { Action } from '../types/flow'

export const LOG_PATH = './logs/'

export const getLogFileName = (): string => {
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  return `${LOG_PATH}actions_${today}.log`
}

const getActionsFromFile = (file: string): Array<Action> =>
  fs.readFileSync(`${LOG_PATH}${file}`, 'utf-8')
    .split('\n')
    .filter(action => !!action)
    .map(action => JSON.parse(action))

export const getActionsFromLogs = (): Array<Action> => {
  const actionLogs = fs.readdirSync(LOG_PATH)
  return flatten(actionLogs.map(getActionsFromFile))
}

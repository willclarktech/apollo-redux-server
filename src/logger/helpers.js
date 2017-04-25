// @flow
import crypto from 'crypto'
import _get from 'lodash/get'
import type {
  Action,
  Log,
  LogWithoutHash,
} from '../types/flow'

const getHashForLog = (action: LogWithoutHash): string =>
  crypto
    .createHash('sha256')
    .update(JSON.stringify(action), 'utf8')
    .digest('hex')

const populateActionWithMeta =
  (action: Action) =>
  (previousHash: string): LogWithoutHash => ({
    action,
    meta: {
      timestamp: new Date(),
      previousHash,
    },
  })

export const constructActionToLog = (action: Action) => (previousHash: string): Log => {
  const logWithoutHash: LogWithoutHash = populateActionWithMeta(action)(previousHash)
  const hash: string = getHashForLog(logWithoutHash)
  return {
    ...logWithoutHash,
    hash,
  }
}

export const ensureExternalApiResponseShape =
  (path: string | Array<string>) =>
  <R>(response: R): R => {
    if (!_get(response, path, null)) {
      const pathString = typeof path === 'string'
        ? path
        : path.join('.')
      throw new Error(`External API response falsy at path: ${pathString}.`)
    }
    return response
  }

// @flow
import crypto from 'crypto'
import _get from 'lodash/get'
import type {
  Action,
  Log,
  LogWithoutHash,
} from '../types/flow'

const getHashForAction = (action: Action): string =>
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
  const actionWithMeta: LogWithoutHash = populateActionWithMeta(action)(previousHash)
  const hash: string = getHashForAction(actionWithMeta)
  return {
    ...actionWithMeta,
    hash,
  }
}

export const ensureExternalApiResponseShape =
  (path: string | Array<string>) =>
  (response: {} | Array<any>) => {
    if (!_get(response, path, null)) {
      const pathString = typeof path === 'string'
        ? path
        : path.join('.')
      throw new Error(`External API response falsy at path: ${pathString}`)
    }
    return response
  }

// @flow
import crypto from 'crypto'
import type {
  Action,
  LogWithoutHash,
} from '../types/flow'

export const getHashForAction = (action: Action): string =>
  crypto
    .createHash('sha256')
    .update(JSON.stringify(action))
    .digest('hex')

export const populateActionWithMeta =
  (action: Action) =>
  (previousHash: string): LogWithoutHash => ({
    action,
    meta: {
      timestamp: new Date(),
      previousHash,
    },
  })

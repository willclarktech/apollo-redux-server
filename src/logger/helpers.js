// @flow
import crypto from 'crypto'
import type {
  Action,
  Log,
  LogWithoutHash,
} from '../types/flow'

const getHashForAction = (action: Action): string =>
  crypto
    .createHash('sha256')
    .update(JSON.stringify(action))
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

  // eslint-disable-next-line import/prefer-default-export
export const constructActionToLog = (action: Action) => (previousHash: string): Log => {
  const actionWithMeta: LogWithoutHash = populateActionWithMeta(action)(previousHash)
  const hash: string = getHashForAction(actionWithMeta)
  return {
    ...actionWithMeta,
    hash,
  }
}

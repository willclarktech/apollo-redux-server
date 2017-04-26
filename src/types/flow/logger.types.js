// @flow
import type { ID } from './helper.types'
import type { Action } from './redux.types'

export type LogWithoutHash = {
  action: Action,
  meta: {
    timestamp: Date,
    previousHash: string,
  },
}

export type Log = LogWithoutHash & {
  hash: string,
}

export type LogAggregator = {|
  previousHash: string,
  validLogs: Array<Log>,
|}

export type TwitterGetStatusesResponse = Array<{
  id_str: ID,
  extended_entities: {
    media: Array<{
      ext_alt_text: string,
    }>,
  },
}>

export type TwitterPostStatusResponse = {
  created_at: string,
}

export type TwitterUploadMediaResponse = {
  media_id_string: string,
}

type TwitterGetResponse
  = TwitterGetStatusesResponse

type TwitterPostResponse
  = TwitterPostStatusResponse
  | TwitterUploadMediaResponse

type TwitterResponse
  = TwitterGetResponse
  | TwitterPostResponse

export type TwitterClient = {
  get: (path: string, params: {}) => Promise<TwitterGetResponse>,
  post: (path: string, params: {}) => Promise<TwitterPostResponse>,
  request: (path: string, config: {}, callback: Function) => Promise<TwitterResponse>,
  options: {
    media_base: string,
    request_options: {},
  },
}

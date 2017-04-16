import type Action from './redux.types'

export type LogWithoutHash = {|
  action: Action,
  meta: {
    timestamp: date,
    previousHash: string,
  },
|}

export type Log = LogWithoutHash & {|
  hash: string,
|}

export type LogAggregator = {|
  previousHash: string,
  validLogs: Array<Log>,
|}

export type TwitterClient = {
  post: (path: string, params: {}) => Promise<string>,
}

export type TwitterGetStatusesResponse = {
  extended_entities: {
    media: Array<{
      ext_alt_text: string,
    }>,
  },
}

export type TwitterPostStatusResponse = {
  created_at: string,
}

export type TwitterUploadMediaResponse = {
  media_id_string: string,
}

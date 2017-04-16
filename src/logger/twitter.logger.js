// @flow
import fs from 'fs'
import Client from 'twitter'
import _get from 'lodash/get'
import {
  constructActionToLog,
  ensureExternalApiResponseShape,
} from './helpers'
import type {
  Action,
  Log,
  TwitterClient,
  TwitterGetStatusesResponse,
  TwitterPostStatusResponse,
  TwitterUploadMediaResponse,
} from '../types/flow'

class TwitterLogger {
  genesisHash: string
  mostRecentHash: string
  baseImage: Buffer
  client: TwitterClient

  constructor(): void {
    const {
      GENESIS_HASH,
      TWITTER_ACCESS_TOKEN_KEY,
      TWITTER_ACCESS_TOKEN_SECRET,
      TWITTER_CONSUMER_KEY,
      TWITTER_CONSUMER_SECRET,
      TWITTER_BASE_IMAGE_LOCATION,
    } = process.env
    if (typeof GENESIS_HASH !== 'string') {
      throw new Error('GENESIS_HASH not set in .env file')
    }
    if (typeof TWITTER_BASE_IMAGE_LOCATION !== 'string') {
      throw new Error('TWITTER_BASE_IMAGE_LOCATION not set in .env file')
    }
    this.genesisHash = GENESIS_HASH
    this.mostRecentHash = this.getMostRecentHash()
    this.baseImage = fs.readFileSync(TWITTER_BASE_IMAGE_LOCATION)

    this.client = new Client({
      access_token_key: TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
      consumer_key: TWITTER_CONSUMER_KEY,
      consumer_secret: TWITTER_CONSUMER_SECRET,
    })
  }

  getMostRecentHash(): string {
    return this.genesisHash
  }

  setMostRecentHash(hash: string): string {
    this.mostRecentHash = hash
    return this.mostRecentHash
  }

  async getLogs(): Promise<Array<Log>> {
    const getAltTextFromTweetMedia = tweet =>
      _get(tweet, ['extended_entities', 'media', 0, 'ext_alt_text'], null)
    const getJSONLogs = (altText: ?string) => {
      if (!altText) {
        return null
      }
      try {
        return JSON.parse(altText)
      } catch (error) {
        return null
      }
    }

    const tweets = await this.getTweets()
    const logs = tweets
      .map(getAltTextFromTweetMedia)
      .map(getJSONLogs)
      .filter(Boolean)

    return logs
  }

  getTweets(): Promise<Array<TwitterGetStatusesResponse>> {
    const options = {
      screen_name: process.env.TWITTER_SCREEN_NAME,
      count: 200, // max
      trim_user: true,
      exclude_replies: true,
      include_ext_alt_text: true,
    }

    return this.client
      .get('statuses/user_timeline', options)
      .then(response => {
        if (!(response instanceof Array)) {
          throw new Error('External API response is not Array')
        }
        return response.length === 0
          ? response
          : ensureExternalApiResponseShape(['0', 'extended_entities'])(response)
      })
  }

  uploadMedia(media: Buffer): Promise<TwitterUploadMediaResponse> {
    return this.client
      .post('media/upload', { media })
      .then(ensureExternalApiResponseShape('media_id_string'))
  }

  setAltTextOnMedia(
    text: string,
    response: TwitterUploadMediaResponse,
  ): Promise<TwitterUploadMediaResponse> {
    const { options } = this.client
    const requestOptions = options.request_options

    const uri = `${options.media_base}/media/metadata/create.json`
    const update = {
      media_id: response.media_id_string,
      alt_text: { text },
    }
    const config = {
      ...requestOptions,
      method: 'post',
      body: JSON.stringify(update),
    }

    // TODO: switch to .post when fixed
    // See https://github.com/desmondmorris/node-twitter/issues/217
    return new Promise((resolve, reject) =>
      this.client
        .request(uri, config, (error, res) =>
          error
            ? reject(error)
            : res.statusCode === 200
              ? resolve(response)
              : reject(`${res.statusCode}: ${res.statusMessage}`),
        ),
      )
  }

  postStatusWithMedia({
    media_id_string: mediaIdString,
  }: TwitterUploadMediaResponse): Promise<TwitterPostStatusResponse> {
    const tweet = {
      media_ids: mediaIdString,
      status: 'lol jk',
      trim_user: true,
    }
    return this.client
      .post('statuses/update', tweet)
      .then(ensureExternalApiResponseShape('created_at'))
  }

  logAction(action: Action): Promise<string> {
    const actionToLog = constructActionToLog(action)(this.mostRecentHash)
    const actionString = JSON.stringify(actionToLog)

    return this.uploadMedia(this.baseImage)
      .then(this.setAltTextOnMedia.bind(this, actionString))
      .then(this.postStatusWithMedia.bind(this))
      .then(this.setMostRecentHash.bind(this, actionToLog.hash))
  }
}

export default TwitterLogger

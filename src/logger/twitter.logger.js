// @flow
import Client from 'twitter'
import { constructActionToLog } from './helpers'
import type {
  Action,
  Log,
  TwitterClient,
} from '../types/flow'

class TwitterLogger {
  genesisHash: string
  mostRecentHash: string
  client: TwitterClient

  constructor(): void {
    const {
      GENESIS_HASH,
      TWITTER_ACCESS_TOKEN_KEY,
      TWITTER_ACCESS_TOKEN_SECRET,
      TWITTER_CONSUMER_KEY,
      TWITTER_CONSUMER_SECRET,
    } = process.env
    if (typeof GENESIS_HASH !== 'string') {
      throw new Error('GENESIS_HASH not set in .env file')
    }
    this.genesisHash = GENESIS_HASH
    this.mostRecentHash = this.getMostRecentHash()

    this.client = new Client({
      access_token_key: TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
      consumer_key: TWITTER_CONSUMER_KEY,
      consumer_secret: TWITTER_CONSUMER_SECRET,
    })
  }

  getLogs(): Array<Log> {
    return []
  }

  getMostRecentHash(): string {
    return this.genesisHash
  }

  async logAction(action: Action): Promise<string> {
    const actionToLog: Log = constructActionToLog(action)(this.mostRecentHash)

    const tweet = {
      status: JSON.stringify(actionToLog),
    }
    await this.client.post('statuses/update', tweet)

    const { hash } = actionToLog
    this.mostRecentHash = hash
    return hash
  }
}

export default TwitterLogger

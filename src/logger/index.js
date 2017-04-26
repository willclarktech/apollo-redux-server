// @flow
import {
  LocalFileLogger,
  TwitterLogger,
} from 'blockchain-logger'

const {
  GENESIS_HASH,
  TWITTER_ACCESS_TOKEN_KEY,
  TWITTER_ACCESS_TOKEN_SECRET,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_BASE_IMAGE_LOCATION,
  TWITTER_SCREEN_NAME,
} = process.env

if (!GENESIS_HASH) {
  throw new Error('GENESIS_HASH not set in environment.')
}

const createLocalFileLogger = () => new LocalFileLogger({
  genesisHash: GENESIS_HASH,
  logPath: './logs/',
  logFilePrefix: 'actions',
})

const createTwitterLogger = () => {
  if (!TWITTER_ACCESS_TOKEN_KEY) {
    throw new Error('TWITTER_ACCESS_TOKEN_KEY not set in environment.')
  }
  if (!TWITTER_ACCESS_TOKEN_SECRET) {
    throw new Error('TWITTER_ACCESS_TOKEN_SECRET not set in environment.')
  }
  if (!TWITTER_CONSUMER_KEY) {
    throw new Error('TWITTER_CONSUMER_KEY not set in environment.')
  }
  if (!TWITTER_CONSUMER_SECRET) {
    throw new Error('TWITTER_CONSUMER_SECRET not set in environment.')
  }
  if (!TWITTER_BASE_IMAGE_LOCATION) {
    throw new Error('TWITTER_BASE_IMAGE_LOCATION not set in environment.')
  }
  if (!TWITTER_SCREEN_NAME) {
    throw new Error('TWITTER_SCREEN_NAME not set in environment.')
  }

  return new TwitterLogger({
    accessTokenKey: TWITTER_ACCESS_TOKEN_KEY,
    accessTokenSecret: TWITTER_ACCESS_TOKEN_SECRET,
    baseImageLocation: TWITTER_BASE_IMAGE_LOCATION,
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    genesisHash: GENESIS_HASH,
    screenName: TWITTER_SCREEN_NAME,
  })
}

const createLogger = () => {
  switch (process.env.LOGGER) {
    case 'twitter':
      return createTwitterLogger()
    case 'local':
      return createLocalFileLogger()
    default:
      throw new Error('LOGGER not set in environment. Must be `twitter` or `file`.')
  }
}

export default createLogger()

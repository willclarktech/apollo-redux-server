// @flow
import {
  LocalFileLogger,
  TwitterLogger,
} from 'blockchain-logger'

const {
  BITCOIN_PRIVATE_KEY,
  BLOCKCHAIN_PREFIX,
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

const basicOptions = {
  genesisHash: GENESIS_HASH,
}

const defaultOptions = BITCOIN_PRIVATE_KEY
  ? {
    ...basicOptions,
    blockchainOptions: {
      maxFee: 5000,
      prefix: BLOCKCHAIN_PREFIX,
      privateKey: BITCOIN_PRIVATE_KEY,
      testnet: BITCOIN_PRIVATE_KEY !== '1',
    },
  }
  : basicOptions

const createLocalFileLogger = () => new LocalFileLogger({
  ...defaultOptions,
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
    ...defaultOptions,
    accessTokenKey: TWITTER_ACCESS_TOKEN_KEY,
    accessTokenSecret: TWITTER_ACCESS_TOKEN_SECRET,
    baseImageLocation: TWITTER_BASE_IMAGE_LOCATION,
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
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
      throw new Error('LOGGER not set in environment. Must be `twitter` or `local`.')
  }
}

export default createLogger()

// @flow
// import LocalFileLogger from './localFile.logger'
import TwitterLogger from './twitter.logger'

const {
  GENESIS_HASH,
  TWITTER_ACCESS_TOKEN_KEY,
  TWITTER_ACCESS_TOKEN_SECRET,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_BASE_IMAGE_LOCATION,
  TWITTER_SCREEN_NAME,
} = process.env
if (typeof GENESIS_HASH !== 'string') {
  throw new Error('GENESIS_HASH not set in environment.')
}
if (typeof TWITTER_ACCESS_TOKEN_KEY !== 'string') {
  throw new Error('TWITTER_ACCESS_TOKEN_KEY not set in environment.')
}
if (typeof TWITTER_ACCESS_TOKEN_SECRET !== 'string') {
  throw new Error('TWITTER_ACCESS_TOKEN_SECRET not set in environment.')
}
if (typeof TWITTER_CONSUMER_KEY !== 'string') {
  throw new Error('TWITTER_CONSUMER_KEY not set in environment.')
}
if (typeof TWITTER_CONSUMER_SECRET !== 'string') {
  throw new Error('TWITTER_CONSUMER_SECRET not set in environment.')
}
if (typeof TWITTER_BASE_IMAGE_LOCATION !== 'string') {
  throw new Error('TWITTER_BASE_IMAGE_LOCATION not set in environment.')
}
if (typeof TWITTER_SCREEN_NAME !== 'string') {
  throw new Error('TWITTER_SCREEN_NAME not set in environment.')
}

// const logger = new LocalFileLogger({
//   genesisHash: GENESIS_HASH,
//   logPath: './logs/',
//   logFilePrefix: 'actions',
// })

const logger = new TwitterLogger({
  accessTokenKey: TWITTER_ACCESS_TOKEN_KEY,
  accessTokenSecret: TWITTER_ACCESS_TOKEN_SECRET,
  baseImageLocation: TWITTER_BASE_IMAGE_LOCATION,
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  genesisHash: GENESIS_HASH,
  screenName: TWITTER_SCREEN_NAME,
})

export default logger

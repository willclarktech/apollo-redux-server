// @flow
import qs from 'qs'
import jwt from 'jsonwebtoken'
import type {
  AuthHandlers,
  Context,
  CreateAuthorPrivateAction,
  ReduxStore,
} from '../types/flow'
import logger from '../logger'
import storePromise from '../redux/store'
import CONFIG from './server.config'
import {
  getGitHubAccessToken,
  getGitHubUser,
} from './requests'

const {
  GITHUB_CLIENT_ID,
  JWT_SECRET,
} = process.env

const {
  HOST,
  PORT,
  PATHS: {
    CLIENT,
    GITHUB_CALLBACK,
  },
} = CONFIG

function redirectToGitHub(ctx: Context): void {
  const query = {
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: `http://${HOST}:${PORT}${GITHUB_CALLBACK}`,
  }
  const queryString = qs.stringify(query)
  const url = `https://github.com/login/oauth/authorize?${queryString}`

  ctx.redirect(url)
}

type AuthorDetails = {
  authorId: string,
  name: string,
}

const createAuthorIfNecessary = (store: ReduxStore) => async ({
  authorId,
  name,
}: AuthorDetails): Promise<?Object> => {
  const { authors } = store.getState()
  const author = authors.get(authorId)

  if (!author) {
    const action: CreateAuthorPrivateAction = {
      type: 'CREATE_AUTHOR',
      authorId,
      name,
    }
    return logger
      .logAction(action)
      .then(() => store.dispatch(action))
  }
  return null
}

const constructRedirectUrlWithToken = ({ authorId, name }: AuthorDetails): string => {
  const token = jwt.sign(
    { id: authorId, name },
    JWT_SECRET,
    { expiresIn: '7d' },
  )

  const query = { token }
  const queryString = qs.stringify(query)

  return `${CLIENT}?${queryString}`
}

const createGitHubCallbackHandler = (store: ReduxStore) =>
async function handleGitHubCallback(ctx: Context): Promise<void> {
  const { code } = ctx.query
  if (!code) throw new Error('No code in context query.')
  const { data: {
    access_token,
  } } = await getGitHubAccessToken(code)
  const { data: {
    id,
    name,
  } } = await getGitHubUser(access_token)

  const authorId = `${id}`
  const authorDetails = { authorId, name }

  return createAuthorIfNecessary(store)(authorDetails)
    .then(() => {
      const url = constructRedirectUrlWithToken(authorDetails)
      ctx.redirect(url)
    })
    .catch(() => ctx.throw(503, 'Author could not be created.'))
}

const defineAuthFunctions = (store: ReduxStore): AuthHandlers => ({
  redirectToGitHub,
  handleGitHubCallback: createGitHubCallbackHandler(store),
})

const initializeAuth = (): Promise<AuthHandlers> =>
  storePromise
    .then(defineAuthFunctions)

export default initializeAuth

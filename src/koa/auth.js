// @flow
import type { Context } from 'koa'
import qs from 'qs'
import jwt from 'jsonwebtoken'
import type { CreateAuthorPrivateAction } from '../types/flow'
import { AUTHORS } from '../types/constants'
import logger from '../logger'
import store from '../redux/store'
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

export function redirectToGitHub(ctx: Context): void {
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

const createAuthorIfNecessary = ({ authorId, name }: AuthorDetails): void => {
  const author = store
    .getState()
    .get(AUTHORS)
    .get(authorId)

  if (!author) {
    const action: CreateAuthorPrivateAction = {
      type: 'CREATE_AUTHOR',
      authorId,
      name,
    }
    logger.logAction(action)
    store.dispatch(action)
  }
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

export async function handleGitHubCallback(ctx: Context): Promise<void> {
  const { code } = ctx.query
  const { data: { access_token } } = await getGitHubAccessToken(code)
  const { data: {
    id,
    name,
  } } = await getGitHubUser(access_token)

  const authorId = `${id}`
  const authorDetails = { authorId, name }

  createAuthorIfNecessary(authorDetails)

  const url = constructRedirectUrlWithToken(authorDetails)
  ctx.redirect(url)
}

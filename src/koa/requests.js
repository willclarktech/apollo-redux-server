// @flow
import axios from 'axios'

const client = {
  ...axios,
  defaults: {
    ...axios.defaults,
    headers: {
      ...axios.defaults.headers,
      common: {
        ...axios.defaults.headers.common,
        Accept: 'application/json',
      },
    },
  },
}

export const getGitHubAccessToken = (code: string) => {
  const {
    GITHUB_CLIENT_ID: client_id,
    GITHUB_CLIENT_SECRET: client_secret,
  } = process.env
  return client
    .post('https://github.com/login/oauth/access_token', {
      client_id,
      client_secret,
      code,
    })
}

export const getGitHubUser = (token: string) =>
  client
    .get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${token}`,
      },
    })

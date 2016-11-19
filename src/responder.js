import { find } from 'lodash'

const getUpvotePostResponse = ({ posts }) => action =>
  find(posts, { id: action.postId })

const getCreatePostResponse = ({ posts }) => () =>
  posts[posts.length - 1]

const responders = {
  UPVOTE_POST: getUpvotePostResponse,
  CREATE_POST: getCreatePostResponse,
}

export default state => action => {
  const responder = responders[action.type]
  return responder
    ? responder(state)(action)
    : null
}

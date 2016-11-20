import { find } from 'lodash'

const upvotePost = state => action => {
  const { postId: id } = action
  const post = find(state.posts, { id })
  if (!post) throw new Error(`Couldn’t find post with id ${id}`)
  post.votes += 1
  return state
}

const createPost = state => action => {
  const { authorId, title } = action
  state.posts.push({
    id: state.posts.length + 1,
    authorId,
    title,
    votes: 0,
  })
  return state
}

const reducers = {
  UPVOTE_POST: upvotePost,
  CREATE_POST: createPost,
}

export default initialState => (
  state = initialState,
  action,
) => {
  const reducer = reducers[action.type]
  return reducer
    ? reducer(state)(action)
    : state
}

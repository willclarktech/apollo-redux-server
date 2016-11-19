import { find } from 'lodash'

const INITIAL_STATE = {
  authors: [
    { id: 1, firstName: 'Tom', lastName: 'Coleman' },
    { id: 2, firstName: 'Sashko', lastName: 'Stubailo' },
  ],
  posts: [
    { id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2 },
    { id: 2, authorId: 2, title: 'GraphQL Rocks', votes: 3 },
    { id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1 },
  ],
}

const upvotePost = state => id => {
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

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPVOTE_POST':
      return upvotePost(state)(action.postId)
    case 'CREATE_POST':
      return createPost(state)(action)
    default:
      return state
  }
}

# apollo-redux-server

This project is a proof-of-concept for combining the apollo graphql server with a backend redux store _à la_ [this tutorial](http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html).

## Installation

```bash
npm install
cp .env.example .env
# Add your own env variables to .env
```

## Starting the server

```bash
npm start
```

This sets up a GraphQL endpoint for post requests to `localhost:3000/graphql`, and a GraphiQL interface you can navigate to at the same location.

By sending queries via GraphiQL you can see what’s in the redux store at initialisation time. It should match `INITIAL_STATE` from `src/redux/store.js`.

## Mutations

As you can see in `src/apollo/resolvers.js`, there is only one mutation, `dispatch`:

```js
Mutation: {
  dispatch(_: any, { action }: MutationParams, ctx: Context): any {
    validate(ctx)(action)
    authenticate(ctx)(action)

    logger.logAction(action)
    store.dispatch(action)

    return getMutationResponse(store.getState())(action)
  },
}
```

You can apply a mutation in GraphiQL like this:

```graphql
mutation DispatchAction($action: ActionInput!) {
  dispatch(action: $action) {
    id
    votes
  }
}

# query variables
{
  "action": {
    "type": "UPVOTE_POST",
    "postId": 1
  }
}
```

The pattern here is to use redux actions as a standard for GraphQL mutations. First of all we log the action to an append-only store, then we dispatch the action to the server’s redux store. Then we get the appropriate response from the updated store for the action type and send it back to the client.

## Isomorphic redux

> What’s the point of this?

One of the great things about GraphQL is the way it allows the client to specify the information it needs without knowing anything much about the server. But mutations are often built much like traditional REST API endpoints: the client has to know which handlers are available on the API, which arguments they require, and what shape to put the required data in.

With isomorphic redux, you can define your actions centrally for both client and server. Whenever the client store dispatches an action the server should know about, the client simply sends that action to the server, the server dispatches the action to its own store, and sends the relevant information about the updated store back to the client.

## Append-only log store

> I can’t use redux on the backend! What if my server crashes?

That’s where the logging comes in. Try applying a few mutations, then stop the server and restart it. Your app should be right back where it left off.

Every action that comes in is logged to an append-only store in JSON format. To return the app state to a given point in its history you only need to initialize a new redux store and run through all the actions up until the point you require:

```js
// from src/redux/reducer.js
export default (initialState: ?AppState) => (
  state: ?AppState = initialState,
  action: Action,
): AppState => {
  if (!state) {
    throw new Error('No initial state provided')
  }
  switch (action.type) {
    case 'UPVOTE_POST':
      return upvotePost(state)(action)
    // ...
    default:
      return state
  }
}

// from src/redux/store.js
const ACTIONS: Array<Action> = getActionsFromLogs()

const initializedState: AppState =
  ACTIONS.reduce(createReducer(), INITIAL_STATE)

const reducer: Reducer = createReducer(initializedState)

const store: ReduxStore = createStore(reducer)

export default store
```

**This way you get the benefits of immutable data on the back end as well as the front end.**

Benefits include:
- Time travel (apply fewer actions to go back in time)
- Backwards compatibility (run action history through new code to see if the same end state is reached)
- Mitigate the effects of bugs by fixing the code and running the history through the reducer to reach the correct result
- ...

In this proof-of-concept app, the logs are just stored in text files according to date. You could just as well use a table in a SQL database or a blockchain (e.g. use Bitcoin’s). Running `npm run filebeat` will forward the logs from these text files to an expected logstash service running on `localhost:5044` for storage in elasticsearch and display using kibana. As you can see in the `docker-compose.yml` file, I’ve used [Sébastien Pujadas’s excellent docker image](https://elk-docker.readthedocs.io/) to get that up and running.

## What’s up with all these higher-order functions?

I don’t know, it’s just something I’m trying out. It’s inspired by Elm, where all functions are curried.

// @flow
export type Author = {
  id: number,
  firstName: string,
  lastName: string,
}

export type Post = {
  id: number,
  authorId: number,
  title: string,
  votes: number,
}

// @flow
export type Author = {
  id: number,
  name: string,
}

export type Post = {
  id: number,
  authorId: number,
  title: string,
  votes: number,
}

export type Secret = {
  id: number,
  userId: number,
  content: string,
}

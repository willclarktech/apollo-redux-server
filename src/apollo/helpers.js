// eslint-disable-next-line import/prefer-default-export
export const convertMapIntoObjectWithId = ([id, v]) => ({
  ...v.toObject(),
  id,
})

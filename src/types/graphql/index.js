// @flow
import fs from 'fs'

const SCHEMAS = [
  'action.input',
  'post',
  'author',
  'secret',
  'root',
]

export default SCHEMAS
  .map(schema => fs.readFileSync(`${__dirname}/${schema}.graphql`, 'utf-8'))

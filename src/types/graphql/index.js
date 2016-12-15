// @flow
import fs from 'fs'

const SCHEMAS = [
  'domain',
  'input',
  'root',
]

export default SCHEMAS
  .map(schema => fs.readFileSync(`${__dirname}/${schema}.graphql`, 'utf-8'))

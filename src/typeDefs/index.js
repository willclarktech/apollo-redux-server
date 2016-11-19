import fs from 'fs'

export default ['action.input', 'post', 'author', 'root']
  .map(schema => fs.readFileSync(`${__dirname}/${schema}.graphql`, 'utf-8'))

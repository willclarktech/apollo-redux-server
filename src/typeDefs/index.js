import fs from 'fs'

export default ['actions', 'post', 'author', 'root']
  .map(schema => fs.readFileSync(`${__dirname}/${schema}.graphql`, 'utf-8'))

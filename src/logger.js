import fs from 'fs'

export default class Logger {
  constructor(fileName = 'actions.log') {
    this.stream =
      fs.createWriteStream(fileName, { flags: 'a' })
  }

  logAction(action) {
    this.stream
      .write(`${JSON.stringify(action)}\n`)
  }
}

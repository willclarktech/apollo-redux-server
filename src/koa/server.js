// @flow
import Koa from 'koa'
import morgan from 'koa-morgan'
import favicon from 'koa-favicon'
import cors from 'kcors'
import bodyParser from 'koa-bodyparser'
import jwt from 'koa-jwt'
import CONFIG from './server.config'
import initializeRouter from './router'

const { FAVICON_LOCATION, HOST, PORT } = CONFIG
const { JWT_SECRET, MORGAN_LOG_LEVEL } = process.env

const jwtOptions = {
  secret: JWT_SECRET,
  passthrough: true,
}

const initializeServer = router => {
  const app = new Koa()

  app.use(morgan(MORGAN_LOG_LEVEL))
  app.use(favicon(FAVICON_LOCATION))
  app.use(cors())
  app.use(bodyParser())
  app.use(jwt(jwtOptions))

  app.use(router.routes())
  app.use(router.allowedMethods())

  app.listen(PORT)
  console.info(`🏃🏃🏃 Server is running on ${HOST}:${PORT}`)
}

const run = () => initializeRouter().then(initializeServer)

export default run

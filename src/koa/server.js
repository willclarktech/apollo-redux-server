// @flow
import Koa from 'koa'
import morgan from 'koa-morgan'
import cors from 'kcors'
import bodyParser from 'koa-bodyparser'
import jwt from 'koa-jwt'
import CONFIG from './server.config'
import initialiseRouter from './router'

const { HOST, PORT } = CONFIG
const { JWT_SECRET, MORGAN_LOG_LEVEL } = process.env

const jwtOptions = {
  secret: JWT_SECRET,
  passthrough: true,
}

const setupServer = router => {
  const app = new Koa()

  app.use(morgan(MORGAN_LOG_LEVEL))
  app.use(cors())
  app.use(bodyParser())
  app.use(jwt(jwtOptions))

  app.use(router.routes())
  app.use(router.allowedMethods())

  app.listen(PORT)
  console.info(`🏃🏃🏃 Server is running on ${HOST}:${PORT}`)
}

const run = () => initialiseRouter().then(setupServer)

export default run

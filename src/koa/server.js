// @flow
import Koa from 'koa'
import morgan from 'koa-morgan'
import cors from 'kcors'
import bodyParser from 'koa-bodyparser'
import CONFIG from './server.config'
import router from './router'

const { HOST, PORT } = CONFIG
const { MORGAN_LOG_LEVEL } = process.env

const app = new Koa()

// TODO: remove this?
const corsOptions = {
  credentials: true,
}

app.use(morgan(MORGAN_LOG_LEVEL))
app.use(cors(corsOptions))
app.use(bodyParser())

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT)
console.info(`🏃🏃🏃 Server is running on ${HOST}:${PORT}`)

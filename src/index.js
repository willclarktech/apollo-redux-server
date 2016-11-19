import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import CONFIG from './server.config'
import router from './router'

const {
  PORT,
} = CONFIG

const app = new Koa()
app.use(bodyParser())

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT)
console.info(`🏃🏃🏃 Server is running on localhost:${PORT}`)

// @flow
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import passport from 'koa-passport'
import CONFIG from './server.config'
import router from './router'

const { HOST, PORT } = CONFIG

const app = new Koa()
app.use(bodyParser())

app.use(passport.initialize())

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT)
console.info(`🏃🏃🏃 Server is running on ${HOST}:${PORT}`)

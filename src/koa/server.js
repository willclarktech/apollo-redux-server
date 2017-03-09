// @flow
import Koa from 'koa'
import morgan from 'koa-morgan'
import cors from 'kcors'
import bodyParser from 'koa-bodyparser'
import convert from 'koa-convert'
import session from 'koa-generic-session'
import passport from 'koa-passport'
import CONFIG from './server.config'
import router from './router'

const { HOST, PORT } = CONFIG

const app = new Koa()
app.keys = [process.env.SESSION_SECRET]

const corsOptions = {
  credentials: true,
}

app.use(morgan('dev'))
app.use(cors(corsOptions))
app.use(bodyParser())
app.use(convert(session()))

app.use(passport.initialize())
app.use(passport.session())

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT)
console.info(`🏃🏃🏃 Server is running on ${HOST}:${PORT}`)

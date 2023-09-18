import { app } from "./app"
import {env } from './env'

app.get('/', async (request, reply) => {
  return { hello: 'world' }
})

app.listen({
  port: env.PORT,
  host: '0.0.0.0'
}).then(() => {
  console.log('🚀 HTTP Server Running!')
})


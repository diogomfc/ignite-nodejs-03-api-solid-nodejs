import { app } from "./app"

app.get('/', async (request, reply) => {
  return { hello: 'world' }
})

app.listen({
  port: 3333,
  host: '0.0.0.0'
}).then(() => {
  console.log('🚀 HTTP Server Running on port 3333')
})


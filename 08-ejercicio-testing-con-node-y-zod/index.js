import express, { request, response } from 'express'

const PORT = process.env.PORT ?? 1234
const app = express()

app.use((request, response, next) => {
  const timeString = new Date().toLocaleDateString()
  console.log(`[${timeString}] ${request.method} ${request.url}`)
  next()
})

app.get('/', (request, response) => {
  response.send(' <h1>Hello WOrd!<h1/>')
})

app.get('/health', (request, response) => {
  response.json({
    status: 'ok',
    uptime: process.uptime()
  })
})

app.listen(PORT, () => {
  console.log(`Servidor levantado en http://localhost:${PORT}`) 
})  
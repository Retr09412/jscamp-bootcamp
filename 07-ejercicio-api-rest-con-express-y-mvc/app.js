import express from 'express'
import {jobsRouter}  from './routes/jobs.js'
import { DEFAULTS } from './config.js'  
import { corsMiddleware } from './middlewares/cors.js'

const PORT = process.env.PORT ?? DEFAULTS.PORT
const app = express()

app.use(express.json());
app.use(corsMiddleware());
app.use('/jobs', jobsRouter)

app.listen(PORT, () => {
  console.log(`Servidor levantado en http://localhost:${PORT}`)
})

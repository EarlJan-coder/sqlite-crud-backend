import express from 'express'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './openapi.json' with { type: "json" }
import tasksRoutes from './routes/tasks.js'

const app = express()
const PORT = 3000

app.use(bodyParser.json())

app.use('/tasks', tasksRoutes)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }))

app.get("/", (req, res) => {
    console.log('[GET ROUTE]')
    res.json({
        "name":"Task API",
        "version":"1.0",
        "endpoints":["/tasks"],
    })
})

app.get("/health", (req, res) => {
    console.log('[HEALTH ROUTE]')
    res.json({
        "status":"ok"
    })
})

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`))
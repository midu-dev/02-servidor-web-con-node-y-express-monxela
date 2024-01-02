const express = require('express')
const path = require('path')
const { validateContact } = require('./schemas/contact')

const PORT = process.env.PORT ?? 1234

const app = express()

app.disable('x-powered-by')

app.use(express.json())

app.all('/', (req, res) => {
  const { method } = req
  if (method !== 'GET') {
    return res.status(405).end()
  }

  res.send('<h1>¡Hola mundo!</h1>')
})

app.use(express.static(path.join(__dirname, 'assets')))

app.all('/404', (req, res) => {
  const { method } = req
  if (method !== 'GET') {
    return res.status(405).end()
  }

  res.status(404).send('<h1>404</h1>')
})

app.all('/contacto', (req, res) => {
  const { method } = req
  if (method !== 'POST') {
    return res.status(405).end()
  }

  const result = validateContact(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  return res.status(201).json(req.body)
})

app.all('*', (req, res) => {
  res.status(404).send('<h1>404</h1>')
})

function startServer () {
  const server = app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
  return server
}

module.exports = {
  startServer
}

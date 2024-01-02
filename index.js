const http = require('node:http')
const fs = require('node:fs')
const { validateContact } = require('./schemas/contact')

const PORT = process.env.PORT ?? 1234
const logoPath = 'assets/logo.webp'

const processRequest = (req, res) => {
  const { method, url } = req

  switch (url) {
    case '/':
      if (method !== 'GET') {
        res.statusCode = 405
        return res.end()
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      return res.end('<h1>¡Hola mundo!</h1>')

    case '/logo.webp':
      if (method !== 'GET') {
        res.statusCode = 405
        return res.end()
      }

      return fs.readFile(logoPath, (err, data) => {
        if (err) {
          res.statusCode = 500
          return res.end('<h1>500 Internal Server Error</h1>')
        } else {
          res.setHeader('Content-Type', 'image/webp')
          return res.end(data)
        }
      })

    case '/404':
      if (method !== 'GET') {
        res.statusCode = 405
        return res.end()
      }

      res.statusCode = 404
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      return res.end('<h1>404</h1>')

    case '/contacto': {
      if (method !== 'POST') {
        res.statusCode = 405
        return res.end()
      }
      let body = ''

      req.on('data', chunk => {
        body += chunk.toString()
      })

      return req.on('end', () => {
        const contact = JSON.parse(body)
        const result = validateContact(contact)

        if (!result.success) {
          return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        res.statusCode = 201
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        return res.end(JSON.stringify(contact))
      })
    }

    default:
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      return res.end('<h1>404</h1>')
  }
}

function startServer () {
  const server = http.createServer(processRequest)

  return server.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}

module.exports = {
  startServer
}

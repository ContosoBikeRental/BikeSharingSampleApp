const express = require('express')
const next = require('next')
const url = require('url')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const baseApiHost = process.env.API_HOST

app.prepare()
  .then(() => {
    const server = express()

    server.get('/api/host', (req, res) => {
      var apiHost = url.format({
        protocol: req.protocol,
        hostname: getDevSpacePrefix(req.get('host')) + baseApiHost,
      });

      res.status(200).send({
        apiHost: apiHost
      });
    })

    server.get('/preview/:id', (req, res) => {
      return app.render(req, res, '/preview', { id: req.params.id })
    })

    server.get('/', (req, res) => {
      console.log("Serving index");
      return app.render(req, res, '/index', {})
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })

function getDevSpacePrefix(host) {
  var arr = host.split(".");
  if (arr.indexOf("s") >= 0) {
    return arr[0] + ".s."
  }

  return "";
}
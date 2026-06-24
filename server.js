// Arquivo de inicialização pro cPanel (Passenger).
// Sobe o Next.js (que já inclui o Payload via withPayload) na porta que o Passenger informar.
const { createServer } = require('http')
const next = require('next')

const port = parseInt(process.env.PORT || '3000', 10)
const app = next({ dev: false })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`> Site no ar na porta ${port}`)
  })
})

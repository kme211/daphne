const Daphne = require('..')
const path = require('path')

const app = new Daphne()
const port = 3000

app.use(app.static(path.join(__dirname, 'public')))

const logger = (req, res) => {
  console.log(`${res.statusCode} ${req.method} request for ${req.url}`)
}

const handleNotFound = (req, res) => {
  if (res.statusCode === 404) {
    res.render('not-found.html')
  }
}

app.use(logger)
app.use(handleNotFound)

app.get('/hello', (req, res) => {
  res.send('hola!')
})

app.get('/dog', (req, res) => {
  res.send('public/daphne.jpg')
})

app.get('/', (req, res) => {
  res.render('index.html')
})

app.listen(port, () => {
  console.log('Example app listening on port ' + port)
})
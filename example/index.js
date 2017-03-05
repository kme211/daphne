const Daphne = require('..')
const path = require('path')

// instantiation
const app = new Daphne()
const port = 3000

app.use(app.static(path.join(__dirname, 'public'))) // grabs everything from public folder and creates routes for all of them

const logger = (req, res) => {
  console.log(`${res.statusCode} ${req.method} request for ${req.url}`)
}

const handleNotFound = (req, res) => {
  if (res.statusCode === 404) {
    res.render('not-found.html') // route 404s to specific page
  }
}

// use middleware
app.use(logger)
app.use(handleNotFound)

// routes
app.get('/', (req, res) => {
  res.render('index.html')
})

app.get('/hello', (req, res) => {
  res.send('hola!') // sends plain text
})

app.get('/dog', (req, res) => {
  res.send('public/daphne.jpg')
})

// tell daphne to start listening for requests
// this should always be last
app.listen(port, () => {
  console.log('Example app listening on port ' + port)
})
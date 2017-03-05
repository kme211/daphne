const Daphne = require('..')
const path = require('path')

// instantiation
const app = new Daphne()
const port = 3000

// define static assets
app.use(app.static(path.join(__dirname, 'public')))

// define middleware
const logger = ({ method, url }, { statusCode }) => {
  console.log(`${statusCode} ${method} request for ${url}`)
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
const Daphne = require('..')
const path = require('path')

const app = new Daphne()
const port = 3000

app.use(app.static(path.join(__dirname, 'public')))

const logger = (req, res) => {
    console.log(`${res.statusCode} ${req.method} request for ${req.url}`)
}

app.use(logger)

app.get('/hello', (req, res) => {
    res.send('text', 'hola!')
})

app.get('/', (req, res) => {
    res.render('index.html')
})

app.listen(port, () => {
    console.log('Example app listening on port ' + port)
})
const Daphne = require('..')
const path = require('path')

const app = new Daphne()
const port = 3000

app.use(app.static(path.join(__dirname, 'public')))

const logger = (req, res) => {
    console.log(`${res.statusCode} ${req.method} request for ${req.url}`)
}

const handleNotFound = (req, res) => {
    if(res.statusCode === 404) {
        res.end('Oops, that file cannot be found')
    }   
}

app.use(logger)
app.use(handleNotFound)

app.get('/hello', (req, res) => {
    res.send('text', 'hola!')
})

app.get('/', (req, res) => {
    res.render('index.html')
})

app.listen(port, () => {
    console.log('Example app listening on port ' + port)
})
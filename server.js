const Daphne = require('./daphne')

const app = new Daphne()

app.use(app.static('public'))

app.get('/hello', (req, res) => {
    res.send('text', 'hola!')
})

app.get('/', (req, res) => {
    res.render('index.html')
})

app.listen()
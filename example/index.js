const Daphne = require('..')
const path = require('path')

const app = new Daphne()

app.use(app.static(path.join(__dirname, 'public')))

app.get('/hello', (req, res) => {
    res.send('text', 'hola!')
})

app.get('/', (req, res) => {
    res.render('index.html')
})

app.listen()
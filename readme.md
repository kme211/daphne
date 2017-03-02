# Daphne

### A simple web server built with Node.

## About

I am a junior web developer who realized that I shouldn't need to install Express just to 
get a development server up and running. I just wanted to see if I could make something 
myself that did what I needed it to--serve resources.

I named this project "Daphne" after my dog, a cute mutt who loves bringing me her toys.

## Usage

```
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
```
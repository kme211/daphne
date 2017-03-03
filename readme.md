# Daphne (WIP)

### A simple web server framework built with Node.

## About

It's like [Express](https://github.com/expressjs/express) but not as awesome or robust. 

I am a junior web developer who realized that I shouldn't need to install Express just to 
get a development server up and running. I just wanted to see if I could make something 
myself that did what I needed it to--serve resources. I don't plan on using this for production.

I named this project "Daphne" after my [dog](http://res.cloudinary.com/ddy54k4ks/image/upload/v1488487770/daphne/daph.jpg), a cute mutt who loves bringing me her toys.

## Usage

```
const app = new Daphne()
const port = 3000

app.use(app.static(path.join(__dirname, 'public')))

const logger = (req, res) => {
    console.log(`${res.statusCode} ${req.method} request for ${req.url}`)
}

const handleNotFound = (req, res) => {
    res.end('Oops, that file cannot be found')
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
```

const fs = require('fs')

const mimeTypes = {
    text: 'text/plain',
    html: 'text/html',
    json: 'application/json',
    css: 'text/css',
    js: 'application/javascript',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    bmp: 'image/bmp',
    webp: 'image/webp',
    xml: 'application/xml',
    pdf: 'application/pdf'
}

class Daphne {
    constructor() {
        const http = require('http')

        const server = http.createServer((req, res) => {
        })

        server.on('request', (message) => {
            console.log(`Request for resource: ${message.url}`)
        })

        this.server = server
    }

    listen(port = 3000, callback = () => {}) {
        this.server.listen(port, () => {
            console.log(`server listening on port ${port}`)
        })
    }

    get(route, func) {
        this.server.on('request', (request, response) => {
            if(request.url === route) {
                func(request, Object.assign({}, response, { 
                    send: this.send.bind(response),
                    render: this.render.bind(response)
                }))
            }
        })
    }

    send(type, data) {
        this.writeHead(200, { 'Content-Type': mimeTypes[type] })
        this.end(data)
    }

    render(template) {
        const response = this;
        response.writeHead(200, { 'Content-Type': mimeTypes.html })
        fs.readFile(`views/${template}`, (err, data) => {
            if(err) {
                if(err.code === 'ENOENT') {
                    console.log(`Template not found: ${err.path}`)
                    response.end('File not found.')
                } else {
                    console.log(err);
                    response.end('An error occurred.')
                }
            } else {
                response.end(data)
            }
        })
    }

    use(fn) {
        if(typeof fn === 'function') {

        } else if(Array.isArray(fn)) {
            fn.forEach(({ path, fn }) => {
                this.get('/' + path, fn)
            })
        }
    }

    static(dir) {
        const files = fs.readdirSync(dir)
        return files.map(file => {
            const extension = file.split('.').pop()
            const path = `${dir}/${file}`
            
            return {
                path,
                fn: (req, res) => {
                    console.log(`Request for static file: ${path}`)
                    fs.readFile(path, (err, data) => {
                        if(err) {
                            console.log(err)
                        } else {
                            res.send(extension, data)
                        }
                    })
                }
            }
        })
    }
}

module.exports = Daphne
const fs = require('fs')
const path = require('path')

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
        
        const appPath = process.argv[1]
        const parsedPath = path.parse(appPath)
        this.baseDirectory = parsedPath.ext !== '' ? parsedPath.dir : appPath

        const server = http.createServer((req, res) => {})

        server.on('request', (req, res) => {
            if(this.routes.indexOf(req.url) === -1) {
                res.statusCode = 404
            }
        })

        this.server = server
        
        this.routes = []
    }

    listen(port = 3000, callback = () => {}) {
        this.server.listen(port, () => {
            callback()
        })
    }

    get(route, func) {
        this.routes.push(route)
        this.server.on('request', (request, response) => {
            if(request.url === route) {
                func(request, Object.assign(response, { 
                    send: this.send.bind(this, response),
                    render: this.render.bind(this, response)
                }))
            }
        })
    }

    getPath(directory) {
        return path.join(this.baseDirectory, directory)
    }

    send(response, type, data) {
        response.writeHead(200, { 'Content-Type': mimeTypes[type] })
        response.end(data)
    }

    render(response, template) {
        response.writeHead(200, { 'Content-Type': mimeTypes.html })
        const templatePath = this.getPath(`views/${template}`)
        fs.readFile(templatePath, (err, data) => {
            if(err) {
                if(err.code === 'ENOENT') {
                    console.log(`Template not found: ${err.path}`)
                    response.statusCode = 404
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
            this.server.on('request', fn)
        } else if(Array.isArray(fn)) {
            fn.forEach(({ route, fn }) => {
                this.get(route, fn)
            })
        }
    }

    static(dir) {
        const files = fs.readdirSync(dir)
        return files.map(file => {
            const parsed = path.parse(`${dir}/${file}`)
            const filePath = path.format({
                root: this.baseDirectory,
                dir: parsed.dir,
                base: parsed.base
            })
            const extension = parsed.ext.slice(1)
            const route = filePath.replace(this.baseDirectory, '').split(path.sep).join('/')
            
            return {
                route,
                fn: (req, res) => {
                    if(!fs.existsSync(filePath)) {
                        res.statusCode = 404
                    } else {
                        fs.createReadStream(filePath).pipe(res)
                    }
                }
            }
        })
    }
}

module.exports = Daphne
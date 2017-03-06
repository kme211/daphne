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

const validTypes = Object.keys(mimeTypes)

const isValidType = (type) => {
  return validTypes.indexOf(type) > -1
}

class Daphne {
  constructor() {
    const http = require('http')

    const appPath = process.argv[1]
    const parsedPath = path.parse(appPath)
    this.baseDirectory = parsedPath.ext !== '' ? parsedPath.dir : appPath

    const server = http.createServer((req, res) => {})

    server.on('request', (req, res) => {
      Object.assign(res, {
        send: this.send.bind(this, res),
        render: this.render.bind(this, res)
      })
      if (this.routes.indexOf(req.url) === -1) {
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
      if (request.url === route) {
        func(request, response)
      }
    })
  }

  getPath(directory) {
    return path.join(this.baseDirectory, directory)
  }

  send(response, filePath) {
    let regEx = /\.\w{3,4}$/
    const extensionMatches = filePath.match(regEx)
    let type = extensionMatches ? extensionMatches[0].slice(1) : 'text'
    if(!isValidType(type)) {
      let error = new Error(`Daphne: type ${type} is not recognized as a valid type`)
      return console.log(error.stack)
    }
    response.writeHead(200, { 'Content-Type': mimeTypes[type] })
    if(type === 'text') {
       response.end(filePath)
    } else {
      filePath = path.join(this.baseDirectory, filePath)
      fs.createReadStream(filePath).pipe(response)
    }
  }

  render(response, template, locals) {
    response.writeHead(200, { 'Content-Type': mimeTypes.html })
    const templatePath = this.getPath(`views/${template}`)

    if (!fs.existsSync(templatePath)) {
      response.statusCode = 404
    } else {
      fs.createReadStream(templatePath, 'utf-8').pipe(response)
    }
  }

  use(fn) {
    if (typeof fn === 'function') {
      this.server.on('request', fn)
    } else if (Array.isArray(fn)) {
      fn.forEach(({ route, fn }) => {
        this.get(route, fn)
      })
    }
  }

  static(dir) {
    const baseDirectory = this.baseDirectory
    function getFiles(dir, dirPath, files = []) {
      const contents = fs.readdirSync(dir)
      contents.forEach(resource => {
        const resourcePath = path.join(baseDirectory, dirPath, resource)
        const stats = fs.lstatSync(resourcePath)
        if(stats.isFile()) {
          const filePath = path.join(baseDirectory, dirPath, resource)
          files.push(filePath)
        } else if(stats.isDirectory()) {
          const newDirPath = path.join(dirPath, resource)
          getFiles(resourcePath, newDirPath, files)
        }
      })
      return files
    }
    const files = getFiles(dir, dir.replace(baseDirectory, ''))
    return files.map(filePath => {
      const route = filePath.replace(this.baseDirectory, '').split(path.sep).join('/')
      return {
        route,
        fn: (req, res) => {
          this.send(res, route)
        }
      }
    })
  }
}

module.exports = Daphne
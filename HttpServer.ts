import http from 'http'

export default class HttpServer {

  server?: http.Server
  config: HttpServerConfig = {}
  listener: ((request: http.IncomingMessage, data: string, response: http.ServerResponse) => void)[] = []

  constructor(config?: HttpServerConfig) {
    this.config = config || this.config
  }
  
  async init(): Promise<void> {
    this.server = http.createServer((request, response) => {
        let url = request.url
  
        let data = ''

        request.on('data', data => {
          data += data
        })

        request.on('end', () => {
          for (let listener of this.listener) {
            listener(request, data, response)
          }
        })
      }
    )

    return new Promise<void>((resolve, reject) => {
      if (this.server != undefined) {
        this.server.listen(this.config.port, () => {
          resolve()
        })
      }
    })
  }

  async end() {
    if (this.server != undefined) {
      this.server.close()
    }
  }
}

export interface HttpServerConfig {
  port?: number
}
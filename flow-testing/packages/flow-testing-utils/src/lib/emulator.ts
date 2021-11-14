import { setAccessNode } from './utils'
import { spawn } from 'child_process'

class Emulator {
  private static readonly DEFAULT_HTTP_PORT = 8080
  private static readonly DEFAULT_GRPC_PORT = 3569
  private emulator: ReturnType<typeof spawn> | undefined = undefined

  async connect(httpPort = Emulator.DEFAULT_HTTP_PORT) {
    setAccessNode(`http://localhost:${httpPort}`)
  }

  async start(httpPort = Emulator.DEFAULT_HTTP_PORT) {
    if (!this.emulator) {
      const grpcPort =
        Emulator.DEFAULT_GRPC_PORT + (httpPort - Emulator.DEFAULT_HTTP_PORT)
      this.emulator = await new Promise((resolve, reject) => {
        setAccessNode(`http://localhost:${httpPort}`)
        const proc = spawn('flow', [
          'emulator',
          '-v',
          '--http-port',
          `${httpPort}`,
          '--port',
          `${grpcPort}`,
        ])
        proc.on('close', () => resolve(proc))
        proc.on('error', (err) => reject(err))
      })
    }
  }

  async stop() {
    if (this.emulator) {
      return new Promise((resolve) => {
        this.emulator!.kill()
        setTimeout(() => {
          this.emulator = undefined
          resolve(undefined)
        }, 50)
      })
    }
    throw new Error('Emulator is not online.')
  }
}

export const emulator = new Emulator()

import type { HttpContext } from '@adonisjs/core/http'
import { join } from 'node:path'
import fs from 'node:fs/promises'
import mime from 'mime-types'

export default class StaticController {
  async serve({ request, response }: HttpContext) {
    // Decodifica el path para evitar errores con %20, etc.
    const rawPath = request.param('*').join('/')
    const fileName = decodeURIComponent(rawPath)
    const filePath = join(import.meta.dirname, '../../Cartas', fileName)

    try {
      await fs.access(filePath)

      const fileContent = await fs.readFile(filePath)
      const mimeType = mime.lookup(filePath) || 'application/octet-stream'

      response.header('Content-Type', mimeType)
      response.header('Cache-Control', 'public, max-age=2592000')
      response.header('Last-Modified', (await fs.stat(filePath)).mtime.toUTCString())

      return response.send(fileContent)
    } catch (error) {
      return response.status(404).send({ message: `Archivo no encontrado: ${fileName}` })
    }
  }
}

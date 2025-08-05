// app/controllers/cards_controller.ts
import Card from '#models/card'
import type { HttpContext } from '@adonisjs/core/http'

export default class CardsController {
  async getByName({ params, response }: HttpContext) {
    const card = await Card.findBy('name', params.name)
    if (!card) return response.notFound({ error: 'Carta no encontrada' })
    return card // Devuelve el objeto completo: {id, name, number, url}
  }

  async index() {
    return await Card.all()
  }
}

import GameService from '#services/game_service'
import Room from '#models/room'
import Game from '#models/game'
import type { HttpContext } from '@adonisjs/core/http'

export default class GameController {
  async startFromRoom({ user, params, response }: HttpContext) {
    if (!user) {
      return response.unauthorized({ message: 'No autenticado' })
    }
    const hostId = user.id
    const roomId = params.roomId
    const room = await Room.findOrFail(roomId)
    if (room.hostId !== hostId) {
      return response.unauthorized({ message: 'Solo el anfitrión puede iniciar el juego' })
    }
    try {
      const game = await GameService.startGameFromRoom(room)
      return response.created(game)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  async flipCard({ user, params, response }: HttpContext) {
    if (!user) {
      return response.unauthorized({ error: 'No autenticado' })
    }
    const hostId = user.id
    const gameId = params.gameId
    try {
      const card = await GameService.flipNextCard(gameId, hostId)
      return response.ok({ card })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  async markCard({ params, request, response }: HttpContext) {
    try {
      const gamePlayerId = params.gamePlayerId
      const { card } = request.only(['card'])
      const result = await GameService.markCard(gamePlayerId, card)
      return response.ok(result)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  async validateWinner({ params, response }: HttpContext) {
    try {
      const gamePlayerId = params.gamePlayerId
      const result = await GameService.validateWinner(gamePlayerId)
      return response.ok(result)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  async state({ params, response }: HttpContext) {
    try {
      const gameId = params.gameId
      const state = await GameService.getGameState(gameId)
      return response.ok(state)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  async getGameForRoom({ params, response }: HttpContext) {
    try {
      const game = await Game.query()
        .where('room_id', params.roomId)
        .orderBy('created_at', 'desc')
        .first()
      if (!game) {
        return response.notFound({ error: 'No existe juego para esta sala' })
      }
      return response.ok({ gameId: game.id })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  async endGame({ user, params, response }: HttpContext) {
    if (!user) {
      return response.unauthorized({ message: 'No autenticado' })
    }
    const hostId = user.id
    const gameId = params.gameId
    try {
      const game = await Game.findOrFail(gameId)
      if (game.hostId !== hostId) {
        return response.unauthorized({ message: 'Solo el anfitrión puede terminar la partida' })
      }
      game.status = 'finished'
      await game.save()
      return response.ok({ message: 'Partida finalizada' })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  async leaveGame({ user, params, response }: HttpContext) {
    if (!user) {
      return response.unauthorized({ error: 'No autenticado' })
    }
    const userId = user.id
    const gameId = params.gameId
    try {
      await GameService.leaveGame(gameId, userId)
      return response.ok({ left: true })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
}

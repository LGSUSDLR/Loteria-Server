import GameService from '#services/game_service'
import Room from '#models/room'
import Game from '#models/game'
import type { HttpContext } from '@adonisjs/core/http'

type UserResponseDto = {
  id: string
  name: string
  email: string
}

export default class GameController {
  // Inicia un juego desde una room (solo el host puede hacerlo)

  
  async startFromRoom({ auth, params, response }: any) {
    try {
      const hostId = auth.user!.id
      const roomId = params.roomId
      const room = await Room.findOrFail(roomId)
      if (room.hostId !== hostId) {
        return response.unauthorized({ message: 'Solo el anfitrión puede iniciar el juego' })
      }
      const game = await GameService.startGameFromRoom(room)
      return response.created(game)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

async flipCard(ctx: HttpContext) {
  const user = ctx.user as UserResponseDto | undefined

  if (!user) {
    return ctx.response.unauthorized({ error: 'No autenticado' })
  }

  try {
    const gameId = ctx.params.gameId
    const card = await GameService.flipNextCard(gameId, user.id)
    return ctx.response.ok({ card })
  } catch (error) {
    return ctx.response.badRequest({ error: error.message })
  }
}


  async markCard({ params, request, response }: any) {
    try {
      const gamePlayerId = params.gamePlayerId
      const { card } = request.only(['card'])
      const result = await GameService.markCard(gamePlayerId, card)
      return response.ok(result)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  async validateWinner({ params, response }: any) {
    try {
      const gamePlayerId = params.gamePlayerId
      const result = await GameService.validateWinner(gamePlayerId)
      return response.ok(result)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

async state({ params, response }: any) {
  try {
    const gameId = params.gameId
    console.log('Consultando estado del juego para:', gameId) // 👈 LOG ÚTIL
    const state = await GameService.getGameState(gameId)
    return response.ok(state)
  } catch (error) {
    console.error('ERROR GAME STATE:', error) // 👈 LOG ÚTIL
    return response.badRequest({ error: error.message })
  }
}


  // NUEVO: Obtener gameId a partir de roomId
  async getGameForRoom({ params, response }: any) {
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

async endGame(ctx: any) {
  try {
    const hostId = ctx.user.id;   // <-- Cambiado
    const gameId = ctx.params.gameId; // <-- Cambiado
    const game = await Game.findOrFail(gameId)
    if (game.hostId !== hostId) {
      return ctx.response.unauthorized({ message: 'Solo el anfitrión puede terminar la partida' })
    }
    game.status = 'finished'
    await game.save()
    return ctx.response.ok({ message: 'Partida finalizada' })
  } catch (error) {
    return ctx.response.badRequest({ error: error.message })
  }
}

}

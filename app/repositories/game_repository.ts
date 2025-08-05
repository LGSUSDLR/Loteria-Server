// app/repositories/game_repository.ts
import Game from '#models/game'
import GameCard from '#models/game_card'
import GamePlayer from '#models/game_player'
import GameMark from '#models/game_mark'

export default class GameRepository {
  static async getById(id: string) {
    return Game.findOrFail(id)
  }

  static async getCards(gameId: string) {
    return GameCard.query().where('game_id', gameId)
  }

  static async getPlayers(gameId: string) {
    return GamePlayer.query().where('game_id', gameId)
  }

  static async getMarks(gamePlayerId: string) {
    return GameMark.query().where('game_player_id', gamePlayerId)
  }

  static async getPlayerByUser(gameId: string, userId: string) {
    return GamePlayer.query().where({ gameId, userId }).firstOrFail()
  }
}

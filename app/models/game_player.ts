// app/models/game_player.ts
import { BaseModel, column, beforeCreate } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid'

export default class GamePlayer extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare gameId: string

  @column()
  declare userId: string

  @column()
  declare card: string 

  @column()
  declare isWinner: boolean

  @column()
  declare isBanned: boolean


  @beforeCreate()
  static assignUuid(gamePlayer: GamePlayer) {
    gamePlayer.id = uuidv4()
  }
}
    
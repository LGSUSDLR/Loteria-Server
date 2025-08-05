import { BaseModel, column, beforeCreate } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid'

export default class GameCard extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare gameId: string

  @column()
  declare gamePlayerId: string

  @column()
  declare card: string 

  @beforeCreate()
  static assignUuid(gameCard: GameCard) {
    gameCard.id = uuidv4()
  }
}

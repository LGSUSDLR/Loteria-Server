// app/models/game.ts
import { BaseModel, column, beforeCreate } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'

export default class Game extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare roomId: string // Relaciona el game con la room de la que nació

  @column()
  declare hostId: string

  @column()
  declare status: 'playing' | 'finished'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @beforeCreate()
  static assignUuid(game: Game) {
    game.id = uuidv4()
  }
}

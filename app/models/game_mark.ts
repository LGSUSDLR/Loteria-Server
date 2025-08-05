// app/models/game_mark.ts
import { BaseModel, column, beforeCreate } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'

export default class GameMark extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare gamePlayerId: string

  @column()
  declare card: string 

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(gameMark: GameMark) {
    gameMark.id = uuidv4()
  }
}

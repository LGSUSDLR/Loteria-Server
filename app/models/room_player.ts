import { BaseModel, column, beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'
import Room from '#models/room'
import User from '#models/user'

export default class RoomPlayer extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare roomId: string

  @column()
  declare userId: string

  @column.dateTime({ autoCreate: true })
  declare joinedAt: DateTime

  @belongsTo(() => Room)
  declare room: any

  @belongsTo(() => User)
  declare user: any

  @beforeCreate()
  static assignUuid(roomPlayer: RoomPlayer) {
    roomPlayer.id = uuidv4()
  }
}

import { BaseModel, column, beforeCreate, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'
import RoomPlayer from '#models/room_player'

export default class Room extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare hostId: string

  @column()
  declare status: 'waiting' | 'playing' | 'finished'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => RoomPlayer)
  declare players: any // <- así, o incluso sin tipo

  @beforeCreate()
  static assignUuid(room: Room) {
    room.id = uuidv4()
  }
}

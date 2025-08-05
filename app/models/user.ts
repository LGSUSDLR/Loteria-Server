import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, beforeSave, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import hash from '@adonisjs/core/services/hash'
import { v4 as uuidv4 } from 'uuid'

// IMPORTANTE: Importa el modelo de AccessToken del propio AdonisJS Auth
import AccessToken from '#models/access_token'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare wins: number

  @column()
  declare losses: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // RELACIÓN obligatoria para access tokens:
  @hasMany(() => AccessToken, {
    foreignKey: 'userId', // Cambia si tu columna es diferente (user_id)
  })
  declare accessTokens: HasMany<typeof AccessToken>

  @beforeCreate()
  static assignUuid(user: User) {
    user.id = uuidv4()
  }

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }
}

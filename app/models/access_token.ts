import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AccessToken extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare type: string

  @column()
  declare name: string

  @column()
  declare token: string

  @column()
  declare expiresAt: Date

  @column()
  declare createdAt: Date

  @column()
  declare updatedAt: Date
}

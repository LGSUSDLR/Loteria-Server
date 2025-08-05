import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Card extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public name!: string     

  @column()
  public number!: number   

  @column()
  public url!: string     
}

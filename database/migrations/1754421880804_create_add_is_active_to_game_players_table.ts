
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  public async up () {
    this.schema.alterTable('game_players', (table) => {
      table.boolean('is_active').defaultTo(true)
    })
  }

  public async down () {
    this.schema.alterTable('game_players', (table) => {
      table.dropColumn('is_active')
    })
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'game_marks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('game_player_id').notNullable().references('id').inTable('game_players').onDelete('CASCADE')
      table.string('card').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'game_cards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('game_id').notNullable().references('id').inTable('games').onDelete('CASCADE')
      table.uuid('game_player_id').nullable().references('id').inTable('game_players').onDelete('CASCADE')
      table.string('card').notNullable() // Nombre o identificador de la carta volteada
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

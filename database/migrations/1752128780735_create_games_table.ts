import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'games'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('room_id').notNullable().references('id').inTable('rooms').onDelete('CASCADE')
      table.uuid('host_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.enum('status', ['playing', 'finished']).defaultTo('playing')
      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

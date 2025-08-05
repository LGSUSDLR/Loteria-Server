import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  public async up () {
    this.schema.alterTable('game_marks', (table) => {
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.alterTable('game_marks', (table) => {
      table.dropColumn('created_at')
      table.dropColumn('updated_at')
    })
  }
}

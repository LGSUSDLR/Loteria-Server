import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()        // PK autoincremental
      table.string('name', 100).notNullable() // Nombre interno: el_gallo, etc.
      table.integer('number').notNullable()   // Número de la carta
      table.string('url', 255).notNullable()  // URL de la imagen
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

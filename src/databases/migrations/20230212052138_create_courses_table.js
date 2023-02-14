/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('courses', (table) => {
    table.bigIncrements('id').primary();
    table.string('title').notNullable();
    table.bigInteger('course_category_id').references('id').inTable('course_categories').unsigned();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('courses')
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('Notes_Tags', function(table) {
    table.integer('note_id').unsigned().references('id').inTable('Notes');
    table.integer('tag_id').unsigned().references('id').inTable('Tags');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('Notes_Tags');
};

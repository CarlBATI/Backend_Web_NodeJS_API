/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('Notes_Sources', function(table) {
        table.integer('note_id').unsigned().references('id').inTable('Notes');
        table.integer('source_id').unsigned().references('id').inTable('Sources');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('Notes_Sources');
};

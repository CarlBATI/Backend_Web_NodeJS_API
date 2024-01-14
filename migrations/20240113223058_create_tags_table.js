/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('Tags', function(table) {
        table.increments('id');
        table.string('name', 25).notNullable().unique();
        table.integer('color_id').unsigned().references('id').inTable('Colors');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('Tags');
};

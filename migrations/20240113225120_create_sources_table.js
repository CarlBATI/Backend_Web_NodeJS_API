/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('Sources', function(table) {
        table.increments('id');
        table.string('url').notNullable();
        table.string('title').notNullable();
        table.string('description');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('last_checked_at');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('Sources');
};

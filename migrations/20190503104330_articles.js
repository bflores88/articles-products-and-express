exports.up = function(knex, Promise) {
  return knex.schema.createTable('articles', (table) => {
    table.increments();
    table.string('title', 255).notNullable();
    table.string('author', 255).notNullable();
    table.text('body').notNullable();
    table.string('urlTitle', 255).notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('articles');
};
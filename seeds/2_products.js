
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('products').del()
    .then(function () {
      // Inserts seed entries
      return knex('products').insert([
        {name: 'Three-legged Cat Keychains', price: 5.99, inventory: 105},
        {name: 'Limited-Edition Vic DevLeague Bobble-Head', price: 20.00, inventory: 4},
        {name: 'Theater Popcorn - Large Bag', price: 10.00, inventory: 500}
      ]);
    });
};

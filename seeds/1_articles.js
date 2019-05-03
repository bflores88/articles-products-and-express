
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('articles').del()
    .then(function () {
      // Inserts seed entries
      return knex('articles').insert([
        {title: 'My Fat Cat', author: "I don't have a cat.", body: 'If I had a cat, it would be a fat cat.  Just kidding.  It would be a healthy cat.', urlTitle: "My%20Fat%20Cat"},
        {title: 'Uncommon Typos', author: "Everyone", body: 'Uncommon typos exist in the world, such as "breverages" and "DrevLeague."  Be sure to spell check and not be like Mr. Seventeen.', urlTitle: 'Uncommon%20Typos'},
        {title: 'Pretty Rocks', author: "I like rocks", body: "My favorite rocks are gemstones. I like rose quarts, which is a pretty light pink rock.  I also like quarts, which looks clear when it is cut.", urlTitle: 'Pretty%20Rocks'}
      ]);
    });
};

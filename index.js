const knex = require('./database');

knex.select().from('articles')
      .then((articleObject) => {

        console.log(articleObject);
        process.exit();
      })
      .catch((err) => {
        throw err;
      })
const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
const knex = require('../database');

let error = false;
let deleted = false;
let deletedID;

router
  .route('/')
  .get((req, res) => {
    knex('products')
      .orderBy('id', 'asc')
      .then((productsObject) => {
        let context = { products: productsObject };

        if (deleted) {
          context.deleteMessage = `You've successfully deleted Product ID ${deletedID}!!`;
          deleted = false;
          deletedID = '';

          return res.render('layouts/products/index', context);
        }

        context.deleteMessage = ``;
        return res.render('layouts/products/index', context);
      })
      .catch((err) => {
        return res.redirect(302, 'layouts/500');
      });
  })
  .post((req, res) => {
    if (!checkInputKeys(req.body)) {
      error = true;
      return res.redirect(302, '/products/new');
    }

    error = false;

    knex('products')
      .returning()
      .insert({
        name: req.body.name,
        price: parseFloat(req.body.price).toFixed(2),
        inventory: req.body.inventory,
      })
      .then((returnResult) => {
        return res.redirect(302, '/products');
      })
      .catch((err) => {
        return res.redirect(302, 'layouts/500');
      });
  });

router.route('/new').get((req, res) => {
  let context = '';

  if (error) {
    context = {
      errorTitle: 'ERROR - Missing Information',
      errorBody: 'Please make sure all fields are filled out before clicking submit.',
    };
  }

  error = false;
  return res.render('layouts/products/new', context);
});

router
  .route('/:id')
  .get((req, res) => {
    knex('products')
      .where('id', req.params.id)
      .then((productObject) => {
        let context = productObject[0];
        return res.render('layouts/products/product', context);
      })
      .catch((err) => {
        return res.redirect(302, 'layouts/500');
      });
  })
  .put((req, res) => {
    if (!checkInputKeys(req.body)) {
      error = true;
      return res.redirect(302, `/products/${req.params.id}/edit`);
    }

    error = false;

    knex('products')
      .returning('id')
      .where('id', req.params.id)
      .update({
        name: req.body.name,
        price: parseFloat(req.body.price).toFixed(2),
        inventory: req.body.inventory,
      })
      .then((returnID) => {
        return res.redirect(302, `/products/${returnID}`);
      })
      .catch((err) => {
        return res.redirect(302, 'layouts/500');
      });
  })
  .delete((req, res) => {
    knex('products')
      .where('id', req.params.id)
      .then((productObject) => {
        if (productObject.length === 0) {
          error = true;
          return res.redirect(302, `/products/${req.params.id}`);
        }

        error = false;
        deleted = true;
        deletedID = req.params.id;
        return knex('products')
          .returning()
          .where('id', req.params.id)
          .del()
          .then((returnResult) => {
            return res.redirect(302, '/products');
          });
      })
      .catch((err) => {
        return res.redirect(302, 'layouts/500');
      });
  });

router.route('/:id/edit').get((req, res) => {
  knex('products')
    .where('id', req.params.id)
    .then((productBody) => {
      let context = productBody[0];

      if (error) {
        error = false;
        context.errorTitle = 'ERROR - Missing Information';
        context.errorBody = 'Please make sure all fields are filled out before clicking submit.';

        return res.render(`layouts/products/edit`, context);
      } else {
        error = false;
        context = productBody[0];
        context.errorTitle = '';
        context.errorBody = '';

        return res.render(`layouts/products/edit`, context);
      }
    });
});

function checkInputKeys(responseObject) {
  if (
    responseObject.hasOwnProperty('name') &&
    responseObject.hasOwnProperty('price') &&
    responseObject.hasOwnProperty('inventory')
  ) {
    if (responseObject.name === '' || responseObject.price === '' || responseObject.inventory === '') {
      return false;
    } else {
      return true;
    }
  }
  return false;
}

module.exports = router;

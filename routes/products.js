const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
const products = require('../db/products.js');
const knex = require('../database');

let error = false;
let deleted = false;
let deletedID;

router
  .route('/')
  .get((req, res) => {

    knex('products').orderBy('id', 'asc')
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
  })
  .post((req, res) => {
    if (!checkInputKeys(req.body)) {
      error = true;
      return res.redirect(302, '/products/new');
    }

    error = false;
    products.addProduct(req.body);
    res.redirect(302, '/products');
    return;
  });

router.route('/new').get((req, res) => {
  let context = '';

  if (error) {
    context = {
      errorTitle: 'ERROR - Missing Information',
      errorBody: 'Please make sure all fields are filled out before clicking submit.',
    };
  }

  res.render('layouts/products/new', context);
  error = false;
});

router
  .route('/:id')
  .get((req, res) => {
    let context = products.findProductByID(req.params.id);

    res.render('layouts/products/product', context);
    return;
  })
  .put((req, res) => {
    if (!checkInputKeys(req.body)) {
      error = true;
      res.redirect(302, `/products/${req.params.id}/edit`);
      return;
    }

    error = false;
    products.editProduct(req.params.id, req.body);
    res.redirect(302, `/products/${req.params.id}`);
    return;
  })
  .delete((req, res) => {
    if (!products.checkID(req.params.id)) {
      error = true;
      res.redirect(302, `/products/${req.params.id}`);
      return;
    }

    error = false;
    products.deleteProduct(req.params.id);
    deleted = true;
    deletedID = req.params.id;

    res.redirect(302, '/products');
    return;
  });

router.route('/:id/edit').get((req, res) => {
  let context = products.findProductByID(req.params.id);

  if (error) {
    context.errorTitle = 'ERROR - Missing Information';
    context.errorBody = 'Please make sure all fields are filled out before clicking submit.';
    error = false;
 
    res.render(`layouts/products/edit`, context);
    return;
  } else {
    error = false;
    context = products.findProductByID(req.params.id);
    context.errorTitle = '';
    context.errorBody = '';
   
    res.render(`layouts/products/edit`, context);
    return;
  }
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

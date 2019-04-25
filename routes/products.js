const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
const products = require('../db/products.js');

router
  .route('/')
  .get((req, res) => {
    

    let context = {products: products.all()}

    res.status(200);
    res.render('layouts/products/index', context)
    return;
  })
  .post((req, res) => {
    if (!checkInputKeys(req.body)) {
      res.send(`{ "success": false }`);
      res.redirect(400, '/products/new');
      return;
    }

    products.addProduct(req.body);

    res.send(`{ "success": true }`);
    // res.render('/layouts/products');
    return;
  });

router
  .route('/:id')
  .get((req, res) => {

    let context = products.findProductByID(req.params.id)

    res.status(200);
    res.render('layouts/products/product', context)
    return;
  })
  .put((req, res) => {
    console.log(req.params.id);
    if (products.checkID(Number(req.params.id)) === false) {
      res.send(`{ "success": false }`);
      console.log('failedprodcutID');
      // res.redirect(400, '/products/:id')
      return;
    }

    products.editProduct(req.params.id, req.body);

    res.send(`{ "success": true }`);
    return;
  })
  .delete((req, res) => {
    console.log(req.params.id)

    if (!products.checkID(req.params.id)) {
      res.send(`{ "success": false }`);
      console.log('failedProductID');
      // res.redirect(400, '/products/:id')
      return;
    }

    products.deleteProduct(req.params.id);

    res.send(`{ "success": true }`);
    return;
  });

function checkInputKeys(responseObject) {
  if (
    responseObject.hasOwnProperty('name') &&
    responseObject.hasOwnProperty('price') &&
    responseObject.hasOwnProperty('inventory')
  ) {
    return true;
  }
  return false;
}

function checkForID(responseObject) {
  if (responseObject.hasOwnProperty('id')) {
    return true;
  }
  return false;
}

module.exports = router;

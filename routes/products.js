const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
const products = require('../db/products.js');

router
  .route('/')
  .get((req, res) => {
    let context = { products: products.getAllProducts() };

    res.status(200);
    res.render('layouts/products/index', context);
    return;
  })
  .post((req, res) => {
    if (!checkInputKeys(req.body)) {
      res.redirect(200, '/products/new');
      return;
    }

    products.addProduct(req.body);

    let context = { products: products.getAllProducts() };

    res.status(200);
    res.render('layouts/products/index', context);
    return;
  });

router.route('/new')
.get((req, res) => {

  res.status(200);
  res.render('layouts/products/new')
})

router
  .route('/:id')
  .get((req, res) => {
    let context = products.findProductByID(req.params.id);

    res.status(200);
    res.render('layouts/products/product', context);
    return;
  })
  .put((req, res) => {
    if (products.checkID(Number(req.params.id)) === false) {

      res.status(200);
      res.render('layouts/products/edit');
      return;
    }

    products.editProduct(req.params.id, req.body);
    let context = products.findProductByID(req.params.id);

    res.status(200);
    res.render('layouts/products/product', context);
    return;
  })
  .delete((req, res) => {
    if (products.checkID(req.params.id)) {
      res.status(200);
      res.render('layouts/products/new');
      return;
    }

    products.deleteProduct(req.params.id);

    let context = { products: products.all() };

    res.status(200);
    res.render('layouts/products/index', context);
    return;
  });

router.route('/:id/edit').get((req, res) => {
  let context = products.findProductByID(req.params.id);

  res.status(200);
  res.render('layouts/products/edit', context);
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

module.exports = router;

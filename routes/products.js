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
      let context = {
        errorTitle: 'Error - Missing Input',
        errorBody: 'Please ensure all fields are inputted before submitting.',
      };
      
      res.redirect(302, '/products/new');
      return;
    }

    products.addProduct(req.body);

    let context = { products: products.getAllProducts() };

    res.redirect(302, '/products');
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
    if (!checkInputKeys(req.body)) {
      let getProduct = products.findProductByID(req.params.id);
      getProduct.errorTitle = "Error - Missing Input";
      getProduct.errorBody = "Please ensure all fields are inputted before submitting.";

      let context = getProduct;

      res.redirect(302, 'layouts/products/edit');
      return;
    }

    products.editProduct(req.params.id, req.body);
    let context = products.findProductByID(req.params.id);

    res.status(200);
    res.render('layouts/products/product', context);
    return;
  })
  .delete((req, res) => {
    if (!products.checkID(req.params.id)) {
      let context = {
        errorTitle: 'Error - This Product ID Does Not Exist!',
        errorBody: 'You currently do not have a product with this ID.',
      };

      res.status(200);
      res.render('layouts/products/new', context);
      return;
    }

    const deletedID = req.params.id;

    products.deleteProduct(req.params.id);

    let context = { products: products.getAllProducts(), deleteMessage: `You've successfully deleted Product ID ${deletedID}!!` };

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
    if(!responseObject.name || !responseObject.price || !responseObject.inventory){
      return false;
    } else {
      return true;
    }
  }
  return false;
}

module.exports = router;

const express = require('express');
const router = express.Router();
const products = require('../db/products.js')


router.route('/')
  .get((req, res) => {
    res.send(products.all());
    return;
  })
  .post((req, res) => {
    if(!checkInputKeys(req.body)){
      res.send(`{ "success": false }`);
      res.redirect(400, '/products/new')
      return;
    }

    // products.addProduct(req.body);

    res.send(`{ "success": true }`);
    // res.redirect('/products');
    return;
  })
  .put((req, res) => {
    if(!checkForID(req.body)){
      console.log('failedID')
      res.send(`{ "success": false }`);
      // res.redirect(400, '/products/:id')
      return;
    }

    if(!products.checkID){
      res.send(`{ "success": false }`);
      console.log('failedprodcutID')
      // res.redirect(400, '/products/:id')
      return;
    }
    products.editProduct(req.body);

  
    // console.log(products.all());

    res.send(`{ "success": true }`);
    return;
  })
  .delete((req, res) => {
    if(!checkForID(req.body)){
      console.log('failedID')
      res.send(`{ "success": false }`);
      // res.redirect(400, '/products/:id')
      return;
    }

    if(!products.checkID){
      res.send(`{ "success": false }`);
      console.log('failedprodcutID')
      // res.redirect(400, '/products/:id')
      return;
    }

    products.deleteProduct(req.body.id);

    res.send(`{ "success": true }`);
    return;
  })

function checkInputKeys (responseObject) {
  if(responseObject.hasOwnProperty('name') && responseObject.hasOwnProperty('price') && responseObject.hasOwnProperty('inventory')){
    return true;
  }
  return false;
}

function checkForID (responseObject) {
  if(responseObject.hasOwnProperty('id')){
    return true;
  }
  return false;
}




module.exports = router;
const express = require('express');
const router = express.Router();

let productArray = [];
let lastID = 0;


router.route('/')
  .post((req, res) => {
    if(!checkInputKeys(req.body)){
      res.send(`{ "success": false }`);
      return
    }



  })

function checkInputKeys (responseObject) {
  if(responseObject.hasOwnProperty('name') && responseObject.hasOwnProperty('price') && responseObject.hasOwnProperty('inventory')){
    return true;
  }
  return false;
}

function createID () {
  let newID = lastID + 1;
  lastID = newID;
  return newID;
}

function createProductData (responseObject) {
  let newProduct = {};
  newProduct.id = createID();
  newProduct.name = responseObject.name;
  newProduct.price = responseObject.price;
  newProduct.inventory = responseObject.number

  productArray.push(newProduct);
  return;
}



module.exports = router;
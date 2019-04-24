const express = require('express');
const router = express.Router();
const articles = require('../db/articles.js');

router
  .route('/')
  .get((req, res) => {
    res.send(articles.all());
    return;
  })
  .post((req, res) => {
    if (!checkInputKeys(req.body)) {
      res.send(`{ "success": false }`);
      // res.redirect(400, '/articles/new')
      return;
    }

    if (articles.checkArticleExists(req.body.title)) {
      res.send(`{ "success": false }`);
      console.log('this title already exists!');
      // res.redirect(400, '/products/:id')
      return;
    }

    articles.addArticle(req.body);

    res.send(`{ "success": true }`);
    // res.redirect('/articles');
    return;
  })
  .put((req, res) => {
    if (!checkForTitle(req.body)) {
      console.log('failedID');
      res.send(`{ "success": false }`);
      // res.redirect(400, '/products/:id') need to update
      return;
    }

    if (!articles.findArticleByTitle) {
      res.send(`{ "success": false }`);
      console.log('title does not exist!');
      // res.redirect(400, '/products/:id')
      return;
    }

    articles.editArticle(req.body);

    // console.log(products.all());

    res.send(`{ "success": true }`);
    return;
  })
  .delete((req, res) => {
    if (!checkForID(req.body)) {
      console.log('failedID');
      res.send(`{ "success": false }`);
      // res.redirect(400, '/products/:id')
      return;
    }

    if (!products.checkID) {
      res.send(`{ "success": false }`);
      console.log('failedprodcutID');
      // res.redirect(400, '/products/:id')
      return;
    }

    products.deleteProduct(req.body.id);

    res.send(`{ "success": true }`);
    return;
  });

function checkInputKeys(responseObject) {
  if (
    responseObject.hasOwnProperty('title') &&
    responseObject.hasOwnProperty('body') &&
    responseObject.hasOwnProperty('author')
  ) {
    return true;
  }
  return false;
}

function checkForTitle(responseObject) {
  if (responseObject.hasOwnProperty('title')) {
    return true;
  }
  return false;
}

module.exports = router;

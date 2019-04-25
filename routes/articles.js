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
  });

router
  .route('/:title')
  .put((req, res) => {
    if (!checkForTitle(req.body)) {
      console.log('failedID');
      res.send(`{ "success": false }`);
      // res.redirect(400, '/products/:id') need to update
      return;
    }

    if (!articles.findArticleByTitle(req.params.title)) {
      res.send(`{ "success": false }`);
      console.log('title does not exist!');
      // res.redirect(400, '/products/:id')
      return;
    }

    articles.editArticle(req.params.title, req.body);

    // console.log(products.all());

    res.send(`{ "success": true }`);
    return;
  })
  .delete((req, res) => {
    if (!articles.findArticleByTitle(req.params.title)) {
      res.send(`{ "success": false }`);
      console.log('title does not exist!');
      // res.redirect(400, '/products/:id')
      return;
    }

    articles.deleteArticle(req.params.title, req.body.title);

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

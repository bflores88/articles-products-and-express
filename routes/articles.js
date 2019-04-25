const express = require('express');
const router = express.Router();
const articles = require('../db/articles.js');

router
  .route('/')
  .get((req, res) => {

    let context = {article: articles.all()};

    res.status(200);
    res.render('layouts/articles/index', context);
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

router.route('/new')
  .get((req, res) => {

    res.status(200);
    res.render('layouts/articles/new');
    return;
  })

router
  .route('/:title')
  .get((req, res) => {

    let context = articles.findArticleByTitle(req.params.title);

    res.render('layouts/articles/article', context)
    return
  })
  .put((req, res) => {
    if (!checkForTitle(req.body)) {
      console.log('failedID');
      res.send(`{ "success": false }`);
      return;
    }

    if (!articles.findArticleByTitle(req.params.title)) {
      res.send(`{ "success": false }`);
      console.log('title does not exist!');
      return;
    }

    let context = articles.editArticle(req.params.title, req.body);

    res.status(200);
    res.render('layouts/articles/article', context)
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

router.route('/:title/edit')
  .get((req, res) => {
    let context = articles.findArticleByTitle(req.params.title);
    
    res.status(200);
    res.render('layouts/articles/edit', context)
  })

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

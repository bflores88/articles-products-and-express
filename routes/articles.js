const express = require('express');
const router = express.Router();
const articles = require('../db/articles.js');

let error = false;
let duplicate = false;
let deleted = false;
let deletedArticle;

router
  .route('/')
  .get((req, res) => {
    let context = { article: articles.getAllArticles() };
    if (deleted) {
      context = { article: articles.getAllArticles() };
      context.deleteMessage = `You've successfully deleted ${deletedArticle}!!`;
      deleted = false;
      deletedArticle = '';

      res.render('layouts/articles/index', context);
    } else {
      deleted = false;
      context = { article: articles.getAllArticles() };
      context.deleteMessage = ``;

      res.render('layouts/articles/index', context);
      return;
    }
  })
  .post((req, res) => {
    if (!checkInputKeys(req.body)) {
      error = true;

      res.redirect(302, '/articles/new');
      return;
    }

    if (articles.checkArticleExists(req.body.title)) {
      duplicate = true;

      res.redirect(302, '/articles/new');
      return;
    }

    articles.addArticle(req.body);

    res.redirect(302, '/articles');
    return;
  });

router.route('/new').get((req, res) => {
  if (error) {
    error = false;
    let context = {
      errorTitle: 'ERROR - Missing Input',
      errorBody: 'Please ensure all fields are inputted before submitting.',
    };

    res.render('layouts/articles/new', context);
    return;
  } else if (duplicate) {
    duplicate = false;
    let context = {
      errorTitle: 'ERROR - Duplicate Title',
      errorBody: 'Please use a new, unique title.',
    };

    res.render('layouts/articles/new', context);
    return;
  } else {
    res.render('layouts/articles/new');
    return;
  }
});

router
  .route('/:title')
  .get((req, res) => {
    let context = articles.findArticleByTitle(req.params.title);

    res.render('layouts/articles/article', context);
    return;
  })
  .put((req, res) => {
    if (!checkInputKeys(req.body)) {
      error = true;

      res.redirect(`articles/${req.params.title}`);
      return;
    }

    let editedArticle = articles.editArticle(req.params.title, req.body);

    res.redirect(302, `articles/${editedArticle.title}`);
    return;
  })
  .delete((req, res) => {
    if (!articles.findArticleByTitle(req.params.title)) {
      res.redirect(302, `/articles/${req.params.title}/edit`);
      return;
    }

    deleted = true;
    deletedArticle = req.params.title;

    articles.deleteArticle(req.params.title, req.body.title);

    res.redirect(302, '/articles');
    return;
  });

router.route('/:title/edit').get((req, res) => {
  let context = articles.findArticleByTitle(req.params.title);

  if (error) {
    context.errorTitle = 'ERROR = Missing Information';
    context.errorBody = 'Please ensure all fields are inputted before submitting.';
    error = false;

    res.render('layouts/articles/edit', context);
    return;
  } else {
    context = articles.findArticleByTitle(req.params.title);

    res.render('layouts/articles/edit', context);
    return;
  }
});

function checkInputKeys(responseObject) {
  if (
    responseObject.hasOwnProperty('title') &&
    responseObject.hasOwnProperty('body') &&
    responseObject.hasOwnProperty('author')
  ) {
    if (!responseObject.title || !responseObject.body || !responseObject.author) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

module.exports = router;

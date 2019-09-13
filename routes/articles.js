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
      deleted = false;
      context.deleteMessage = `You've successfully deleted ${deletedArticle}!!`;
      deletedArticle = '';
    } else {
      deleted = false;
      context.deleteMessage = ``;
    }
    return res.render('layouts/articles/index', context);
  })
  .post((req, res) => {
    if (!checkInputKeys(req.body)) {
      error = true;

      return res.redirect(302, '/articles/new');
    }

    if (articles.checkArticleExists(req.body.title)) {
      duplicate = true;

      return res.redirect(302, '/articles/new');
    }

    articles.addArticle(req.body);

    return res.redirect(302, '/articles');
  });

router.route('/new').get((req, res) => {
  if (error) {
    error = false;
    let context = {
      errorTitle: 'ERROR - Missing Input',
      errorBody: 'Please ensure all fields are inputted before submitting.',
    };

    return res.render('layouts/articles/new', context);
  } else if (duplicate) {
    duplicate = false;
    let context = {
      errorTitle: 'ERROR - Duplicate Title',
      errorBody: 'Please use a new, unique title.',
    };

    return res.render('layouts/articles/new', context);
  } else {
    return res.render('layouts/articles/new');
  }
});

router
  .route('/:title')
  .get((req, res) => {
    error = false;
    let context = articles.findArticleByTitle(req.params.title);
    return res.render('layouts/articles/article', context);
  })
  .put((req, res) => {
    if (!checkInputKeys(req.body)) {
      error = true;

      return res.redirect(302, `/articles/${req.params.title}/edit`);
    }

    error = false;
    let editedArticle = articles.editArticle(req.params.title, req.body);

    return res.redirect(302, `/articles/${editedArticle.urlTitle}`);
  })
  .delete((req, res) => {
    if (!articles.findArticleByTitle(req.params.title)) {
      return res.redirect(302, `/articles/${req.params.title}/edit`);
    }

    deleted = true;
    deletedArticle = req.params.title;

    articles.deleteArticle(req.params.title, req.body.title);

    return res.redirect(302, '/articles');
  });

router.route('/:title/edit').get((req, res) => {
  let context = articles.findArticleByTitle(req.params.title);

  if (error) {
    error = false;
    context.errorTitle = 'ERROR - Missing Information';
    context.errorBody = 'Please ensure all fields are inputted before submitting.';
  } else {
    error = false;
    context.errorTitle = '';
    context.errorBody = '';
  }
  return res.render('layouts/articles/edit', context);
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

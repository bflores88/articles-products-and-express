const express = require('express');
const router = express.Router();
const articles = require('../db/articles.js');

router
  .route('/')
  .get((req, res) => {
    let context = { article: articles.getAllArticles() };

    res.status(200);
    res.render('layouts/articles/index', context);
    return;
  })
  .post((req, res) => {
    if (!checkInputKeys(req.body)) {
      let context = {
        errorTitle: 'Error - Missing Input',
        errorBody: 'Please ensure all fields are inputted before submitting.',
      };

      res.status(200);
      res.render('layouts/articles/new', context);
      return;
    }

    if (articles.checkArticleExists(req.body.title)) {
      let context = {
        errorTitle: 'Error - Duplicate Title',
        errorBody: 'You already have an article with this title.',
      };

      res.status(200);
      res.render('layouts/articles/new', context);
      return;
    }

    articles.addArticle(req.body);

    let context = { article: articles.getAllArticles() };

    res.status(200);
    res.render('layouts/articles/index', context);
    return;
  });

router.route('/new').get((req, res) => {
  res.status(200);
  res.render('layouts/articles/new');
  return;
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
      let thisArticle = articles.findArticleByTitle(req.body.title);
      thisArticle.errorTitle = 'ERROR - Missing Input';
      thisArticle.errorBody = 'Please ensure all fields are inputted before submitting.';
      let context = thisArticle;

      res.status(200);
      res.render('layouts/articles/edit', context);
      return;
    }

    if (!articles.findArticleByTitle(req.params.title)) {
      let context = {
        errorTitle: 'Error - This Title Does Not Exist!',
        errorBody: 'You currently do not have an article with this title.',
      };

      res.status(200);
      res.render('layouts/articles/new', context);
      return;
    }

    let context = articles.editArticle(req.params.title, req.body);

    res.status(200);
    res.render('layouts/articles/article', context);
    return;
  })
  .delete((req, res) => {
    if (!articles.findArticleByTitle(req.params.title)) {
      let context = {
        errorTitle: 'Error - This Title Does Not Exist!',
        errorBody: 'You currently do not have an article with this title.',
      };

      res.status(200);
      res.render('layouts/articles/new', context);
      return;
    }

    const title = req.params.title;

    let context = { article: articles.getAllArticles(), deleteMessage: `You've succesesfuly deleted ${title}!!` };

    articles.deleteArticle(req.params.title, req.body.title);

    res.status(200);
    res.render('layouts/articles/index', context);
    return;
  });

router.route('/:title/edit').get((req, res) => {
  let context = articles.findArticleByTitle(req.params.title);

  res.status(200);
  res.render('layouts/articles/edit', context);
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

function checkForTitle(responseObject) {
  if (responseObject.hasOwnProperty('title')) {
    return true;
  }
  return false;
}

module.exports = router;

const express = require('express');
const router = express.Router();
const knex = require('../database');

let error = false;
let duplicate = false;
let doesNotExist = false;
let deleted = false;
let deletedArticle;

router
  .route('/')
  .get((req, res) => {
    knex('articles')
      .orderBy('updated_at', 'desc')
      .then((articleObject) => {
        return articleObject;
      })
      .then((result) => {
        let context = { article: result };

        if (deleted) {
          context = { article: result };
          context.deleteMessage = `You've successfully deleted ${deletedArticle}!!`;
          deleted = false;
          deletedArticle = '';
        } else {
          deleted = false;
          context = { article: result };
          context.deleteMessage = ``;
        }

        return res.render('layouts/articles/index', context);
      })
      .catch((err) => {
        return res.redirect(302, 'layouts/500');
      });
  })
  .post((req, res) => {
    if (!checkInputKeys(req.body)) {
      error = true;

      return res.redirect(302, '/articles/new');
    }

    knex('articles')
      .where('title', req.body.title)
      .then((result) => {
        if (result.length !== 0) {
          duplicate = true;
          return res.redirect(302, '/articles/new');
        }

        return knex('articles')
          .returning('title')
          .insert({
            title: req.body.title,
            author: req.body.author,
            body: req.body.body,
            urlTitle: encodeURIComponent(req.body.title),
          })
          .then((returnedTitle) => {
            return res.redirect(302, '/articles');
          });
      })
      .catch((err) => {
        return res.redirect(302, 'layouts/500');
      });
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
  } else if (doesNotExist) {
    doesNotExist = false;
    let context = {
      errorTitle: 'ERROR - Article Does Not Exist!',
      errorBody: 'Please look up a valid article or create new article.',
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

    knex('articles')
      .where('title', req.params.title)
      .then((articleObject) => {
        if (articleObject.length === 0) {
          doesNotExist = true;

          return res.redirect(302, '/articles/new');
        }

        let context = articleObject[0];
        return res.render('layouts/articles/article', context);
      })
      .catch((err) => {
        return res.redirect(302, 'layouts/500');
      });
  })
  .put((req, res) => {
    if (!checkInputKeys(req.body)) {
      error = true;

      return res.redirect(302, `/articles/${req.params.title}/edit`);
    }

    error = false;

    knex('articles')
      .where('title', req.params.title)
      .returning('urlTitle')
      .update({
        title: req.body.title,
        author: req.body.author,
        body: req.body.body,
      })
      .then((urlTitle) => {
        return res.redirect(302, `/articles/${urlTitle}`);
      })
      .catch((err) => {
        return res.redirect(302, 'layouts/500');
      });
  })
  .delete((req, res) => {
    knex('articles')
      .where('title', req.params.title)
      .then((articleObject) => {
        if (articleObject.length === 0) {
          doesNotExist = true;
          return res.redirect(302, '/articles/new');
        }

        let article = articleObject[0];
        deleted = true;
        deletedArticle = article.title;

        return knex('articles')
          .returning('title')
          .where('title', article.title)
          .del()
          .then((title) => {
            return res.redirect(302, '/articles');
          });
      })
      .catch((err) => {
        return res.redirect(302, 'layouts/500');
      });
  });

router.route('/:title/edit').get((req, res) => {
  knex('articles')
    .where('title', req.params.title)
    .then((articleObject) => {
      let context = articleObject;

      if (error) {
        error = false;
        context = articleObject[0];
        context.errorTitle = 'ERROR - Missing Information';
        context.errorBody = 'Please ensure all fields are inputted before submitting.';
        return res.render('layouts/articles/edit', context);
      } else {
        error = false;
        context = articleObject[0];
        context.errorTitle = '';
        context.errorBody = '';
        return res.render('layouts/articles/edit', context);
      }
    })
    .catch((err) => {
      return res.redirect(302, 'layouts/500');
    });
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

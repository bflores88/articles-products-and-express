const articles = [];

function all() {
  return articles;
}

function createURLTitle(title) {
  let newTitle = encodeURIComponent(title);
  return newTitle;
}

function checkArticleExists(inputTitle){
  for(let i=0; i<articles.length; i++){
    let current = articles[i];
    if(current.title === inputTitle){
      return true
    }
  }
  return false;
}

function findArticleByTitle(inputTitle) {
  let article = {};
  for(let i=0; i<articles.length; i++){
    let current = articles[i];
    if(current.title === inputTitle){
      article = current
    }
  }

  if(article === {}){
    return false;
  }

  return article;
}

function addArticle(responseObject) {
  let newArticle = {};
  newArticle.urlTitle = createURLTitle(responseObject.title);
  newArticle.title = responseObject.title;
  newArticle.body = responseObject.body;
  newArticle.author = responseObject.author;

  articles.push(newArticle);
  return;
}

function editArticle(title, responseObject) {
  let articleEdit = findArticleByTitle(title);

  for (let key in responseObject) {
    articleEdit[key] = responseObject[key];
  }

  let newURLTitle = createURLTitle(responseObject.title);
  articleEdit.urlTitle = newURLTitle;

  return articleEdit;
}

function deleteArticle (inputURLTitle) {
  let articleDelete = findArticleByTitle(inputURLTitle);
  let deleteIndex = articles.indexOf(articleDelete);
  articles.splice(deleteIndex, 1);
  return;
}

module.exports = {
  all: all,
  checkArticleExists: checkArticleExists,
  findArticleByTitle: findArticleByTitle,
  addArticle: addArticle,
  editArticle: editArticle,
  deleteArticle: deleteArticle
};

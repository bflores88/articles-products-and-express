let articles = [];

function all() {
  return articles;
}

function createURLTitle(title) {
  let newTitle = title.split(' ').join('%');
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

function editArticle(responseObject) {
  let articleEdit = findArticleByTitle(responseObject.title);

  for (let key in responseObject) {
    articleEdit[key] = responseObject[key];
  }

  return;
}

function deleteArticle (inputTitle) {
  let articleDelete = findArticleByTitle(inputTitle);
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

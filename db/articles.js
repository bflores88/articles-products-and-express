let articles = [];

function all() {
  return articles;
}

function createURLTitle(title) {
  let newTitle = title.split(' ').join('%');
  return newTitle;
}

// function checkID(num) {
//   if (validIDs.indexOf(num) === -1) {
//     return false;
//   }
//   return true;
// }

function findArticleByTitle(inputTitle) {
  let article = {};
  for(let i=0; i<articles.length; i++){
    let current = articles[i];
    if(current.title === inputTitle){
      article = current
    }
  }
  return article;
}

function addArticle(responseObject) {
  let newArticle = {};
  newArticle.urlTitle = createURLTitle();
  newArticle.title = responseObject.title;
  newArticle.body = responseObject.body;
  newArticle.author = responseObject.author;

  articles.push(newArticle);
  return;
}

function editArticle(responseObject) {
  let articleEdit = findArticleByTitle(responseObject.id);

  for (let key in responseObject) {
    articleEdit[key] = responseObject[key];
  }

  return;
}

function deleteProduct (id) {
  let productDelete = findProductByID(id);
  let productDeleteIndex = products.indexOf(productDelete);
  products.splice(productDeleteIndex, 1);
  return;
}

module.exports = {
  all: all,
  addArticle: addArticle,
  checkID: checkID,
  editArticle: editArticle,
  deleteProduct: deleteProduct
};

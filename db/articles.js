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

// function findProductByID(inputID) {
//   let product = {};
//   for(let i=0; i<products.length; i++){
//     let current = products[i];
//     if(current.id === Number(inputID)){
//       product = current
//     }
//   }
//   return product;
// }

function article(responseObject) {
  let newProduct = {};
  newArticle.urlTitle = createURLTitle();
  newArticle.title = responseObject.title;
  newArticle.body = responseObject.body;
  newArticle.author = responseObject.author;

  articles.push(newArticle);
  return;
}

function editProduct(responseObject) {
  let productEdit = findProductByID(responseObject.id);

  for (let key in responseObject) {
    productEdit[key] = responseObject[key];
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
  addProduct: addProduct,
  checkID: checkID,
  editProduct: editProduct,
  deleteProduct: deleteProduct
};

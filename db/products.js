const products = [];
const validIDs = [];
let lastID = 0;

function getAllProducts() {
  return products;
}

function createID() {
  let newID = lastID + 1;
  lastID = newID;
  validIDs.push(newID);
  return newID;
}

function checkID(num) {
  return (validIDs.indexOf(num) === -1);
}

function findProductByID(inputID) {
  let product = {};
  for(let i=0; i<products.length; i++){
    let current = products[i];
    if(current.id === Number(inputID)){
      product = current
    }
  }
  return product;
}

function addProduct(responseObject) {
  let newProduct = {};
  newProduct.id = createID();
  newProduct.name = responseObject.name;
  newProduct.price = Number(responseObject.price).toFixed(2).toLocaleString('en');
  newProduct.inventory = responseObject.inventory;

  products.push(newProduct);
  return;
}

function editProduct(id, responseObject) {
  let product = findProductByID(id);

  for (let key in responseObject) {
    product[key] = responseObject[key];
  }

  return;
}

function deleteProduct (id) {
  let product = findProductByID(id);
  let productIndex = products.indexOf(product);
  products.splice(productIndex, 1);
  return;
}

module.exports = {
  getAllProducts,
  findProductByID,
  addProduct,
  checkID,
  editProduct,
  deleteProduct
};

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
  newProduct.price = responseObject.price;
  newProduct.inventory = responseObject.inventory;

  products.push(newProduct);
  return;
}

function editProduct(id, responseObject) {
  let productEdit = findProductByID(id);

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
  getAllProducts,
  findProductByID,
  addProduct,
  checkID,
  editProduct,
  deleteProduct
};

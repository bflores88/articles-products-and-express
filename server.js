const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;

const articles = require(`./routes/articles.js`);
const products = require(`./routes/products.js`);

app.use(express.static('public'));

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use('/products', products);

app.use('/articles', articles);


app.get('/', (req, res) => {
  res.send('hello world');
});



const server = app.listen(PORT, () => {
  console.log(`Express app is running at port ${PORT}`);
})
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;

const articles = require(`./routes/articles.js`);
const products = require(`./routes/products.js`);

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine', '.hbs');


app.use(express.static('public'))

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use('/products', products);
app.use('/products/:id', products);

app.use('/articles', articles);


app.get('/', (req, res) => {
  res.render('layouts/home');
});

app.use( (req, res) => {
  res.status(404);
  res.render('layouts/404');
})

const server = app.listen(PORT, () => {
  console.log(`Express app is running at port ${PORT}`);
})
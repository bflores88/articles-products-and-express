const express = require('express');
const exphbs = require('express-handlebars');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const PORT = 3000;

const articles = require(`./routes/articles.js`);
const products = require(`./routes/products.js`);

app.engine(
  '.hbs',
  exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
  }),
);
app.set('view engine', '.hbs');

app.use(methodOverride('_method'));
app.use(express.static('public'));

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use((req, res, next) => {
  let currentDate = new Date().toDateString();
  let logFile = currentDate.split(' ').join('_');

  fs.appendFile(
    `./logs/${logFile}.log`,
    '\n' + `${req.method}_${req.url}_${new Date().toUTCString()}`,
    'utf8',
    (err) => {
      if (err) throw err;
      return true;
    },
  );
  next();
});

app.use('/products', products);
app.use('/products/:id', products);
app.use('/products/:id/edit', products);
app.use('/products/new', products);

app.use('/articles', articles);
app.use('/articles/:title', articles);
app.use('/articles/:title/edit', articles);
app.use('/articles/new', articles);

app.get('/', (req, res) => {
  res.render('layouts/home');
});

app.use((req, res) => {
  res.status(404);
  res.render('layouts/404');
});

const server = app.listen(PORT, () => {
  console.log(`Express app is running at port ${PORT}`);
});

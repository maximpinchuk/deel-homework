const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const routes = require('./routes');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);
app.use('/', routes);
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send(err.message);
});

module.exports = app;

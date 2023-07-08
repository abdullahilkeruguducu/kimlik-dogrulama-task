const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());

mongoose
  .connect('mongodb://127.0.0.1/kimlik-dogrulama-db')
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.error('MongoDB Connection Error', err);
  });

app.use('/', authRoutes);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

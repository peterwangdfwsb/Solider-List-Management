const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const fileUpload = require('express-fileupload');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

// ROUTES
app.use('/api/users', users);

// UPLOAD IMAGE
app.use(express.static('./public'));
app.use(fileUpload());
app.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  const file = req.files.image;
  file.mv(`${__dirname}/public/uploads/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});


// DATABASE CONNECTED
const db = 'mongodb+srv://peter:abc@ustsvdemo.t5qj9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose
  .connect(db, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true
  })
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Magic happens on port ' + PORT)}
);


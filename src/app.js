const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const routes = require('./routes');
const { sequelize } = require('./models');

dotenv.config();

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('App is working'));

app.use('/api', routes);

// SERVER
const options = {
  key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
};

const PORT = process.env.PORT || 3000;

https.createServer(options, app).listen(PORT);

// app.listen(4200, () => {
//   // console.log('Server running on port 4200');
//   sequelize.authenticate().then(() => {
//     console.log('Nos hemos conectado a la base de datos!!!!!');
//   });
// }); // ONLY FOR DEV

app.listen(4200, () => {
  console.log('Server running on port 4200');

  sequelize.sync({ alter: true })
    .then(() => {
      console.log('Database & tables created!');
    });
});

module.exports = {
  app,
};

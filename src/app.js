const dotenv = require('dotenv');
const express = require('express');
const routes = require('./routes');

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('App is working'));

app.use('/api', routes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = {
  app,
};

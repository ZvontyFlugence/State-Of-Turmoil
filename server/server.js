require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const port = 3030;

const db = require('./db');

db.connect(err => {
  if (err) {
    console.log('MongoDB Connection Failed!', err);
    process.exit(1);
  } else {
    app.listen(port, () =>
      console.log(`State of Turmoil API connected to MongoDB, listening on port ${port}`)
    );
  }
});

// TODO: Set up node-cron to begin scheduling elections

const authController = require('./controllers/authController');
const compController = require('./controllers/compController');
const mapController = require('./controllers/mapController');
const regionController = require('./controllers/regionController');
const shoutsController = require('./controllers/shoutsController');
const statsController = require('./controllers/statsController');
const userController = require('./controllers/userController');

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/auth', authController);
app.use('/companies', compController);
app.use('/map', mapController);
app.use('/regions', regionController);
app.use('/shouts', shoutsController);
app.use('/stats', statsController);
app.use('/user', userController);
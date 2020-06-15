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

const authController = require('./controllers/authController');
const userController = require('./controllers/userController');

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/auth', authController);
app.use('/user', userController);

app.get('/regions', async (req, res) => {
  const regions = db.getDB().collection('regions');
  let list = await regions.find({}).toArray();
  
  if (list) {
    const countries = db.getDB().collection('countries');
    let region_list = await Promise.all(list.map(async region => {
      let owner = await countries.findOne({ _id: region.owner });
      return { ...region, owner };
    }));
    return res.status(200).json({ regions: region_list });
  }
  return res.status(500).json({ error: 'Something went wrong' });
});

app.post('/region', async (req, res) => {
  const regions = db.getDB().collection('regions');
  const num_regions = await regions.estimatedDocumentCount();

  let borders = [];
  for (const path of req.body.borders) {
    borders.push({ lat: path[0], lng: path[1] });
  }

  const doc = {
    _id: num_regions + 1,
    ...req.body,
    borders,
  };

  let result = await regions.insertOne(doc);

  return res.status(200).json({ ok: true, added: result.name });
});
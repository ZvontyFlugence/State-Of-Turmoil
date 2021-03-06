const MongoClient = require('mongodb').MongoClient;
// const ObjectID = require('mongodb').ObjectID;

const dbName = 'SOT_TEST';
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const options = { useNewUrlParser: true, useUnifiedTopology: true };

const state = {
  db: null,
};

const connect = callback => {
  if (state.db) {
    callback();
  } else {
    MongoClient.connect(mongoURI, options, (err, client) => {
      if (err) {
        callback(err);
      } else {
        state.db = client.db(dbName);
        callback();
      }
    });
  }
}

const getDB = () => {
  return state.db;
}

module.exports = { connect, getDB };

const MongoClient = require('mongodb').MongoClient;

var state = {
  database: null
}

exports.connect = (url, done) => {
  if (state.database) { return done(); }

  MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
    if (error) { return done(error) }
    state.database = client.db('platforme');
    done();
  });
}

exports.get = () => {
  return state.database;
}

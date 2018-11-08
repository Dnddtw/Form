const database = require('../mongodb.js');
const ObjectID = require('mongodb').ObjectID;

exports.all = (callback) => {
    database.get().collection('platforme').find().toArray((error, documents) => {
        callback(error, documents);
    });
}

exports.findById = (id, callback) => {
    database.get().collection('platforme').findOne({ _id: ObjectID(id) }, (error, documents) => {
        callback(error, documents);
    });
}

exports.create = (entry, callback) => {
    entry._id = ObjectID();
    database.get().collection('platforme').insert(entry, (error, result) => {
        console.log(entry);
        callback(error, result);
    });
}

exports.update = (id, data, callback) => {
	database.get().collection('platforme').updateOne(
    	{ _id: ObjectID(id) },
    	{ $set: data},
    	(error, result) => {
      		callback(error, result);
    	}
    );
}

exports.delete = (id, callback) => {
	database.get().collection('platforme').deleteOne(
	    { _id: ObjectID(id) },
	    (error, result) => {
	      callback(error, result);
	    }
	);
}
var Platforme = require('../models/platforme.js');

exports.all = (request, response) => {
    Platforme.all((error, documents) => {
        if (error) {
            console.log(error);
            return responseStatus(500);
        }

        response.send(documents);
    })
};

exports.findById = (request, response) => {
    console.log(request.params.id);
    Platforme.findById(request.params.id, (error, documents) => {
        if (error) {
            console.log(error);
            return response.sendStatus(500);
        }

        response.send(documents);
    });
}

exports.create = (request, response) => {
	var entry = request.body;

	Platforme.create(entry, (error, result) => {
		if (error) {
            console.log(error);
            return response.sendStatus(500);
        }

        console.log(entry);
        // response.send(result);
	});
}

exports.update = (request, response) => {
    console.log(' ');
    console.log(' ');
    console.log(request.body);
    console.log(' ');
    console.log(' ');
	Platforme.update(request.params.id, request.body, (error, result) => {
		if (error) {
	        console.log(error);
	        return response.sendStatus(500);
	      }
	      response.sendStatus(200);
	})
}

exports.delete = (request, response) => {
	Platforme.delete(request.params.id, (error, result) => {
		if (error) {
			console.log(error);
			return response.sendStatus(500);
		}
		response.sendStatus(200);
	});
}
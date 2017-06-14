'use strict';

const service = require('.././services');


function isAuth (req, res, next) {
	console.log('Entre : > ' + req.headers.authorization);
	if (!req.headers.authorization) {
		return res.status(403).send({
			msg : 'No estas autorizado para acceder al recurso'
		});
	}

	const token = req.headers.authorization;
	


	service.decodedToken(token)
	.then(response => {
		console.log('entre');
		req.user = response;
		next();
	})
	.catch((response) => {
		res.status(response.status);
	});
}

module.exports = isAuth;
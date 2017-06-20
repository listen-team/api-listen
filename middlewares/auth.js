'use strict';

const service = require('.././services');


function isAuth (req, res, next) {
	if (!req.headers.authorization) {
		return res.status(403).send({
			msg : 'No estas autorizado para acceder al recurso'
		});
	}

	const token = req.headers.authorization;
	
	service.decodedToken(token)
	.then(response => {
		req.user = response;
		next();
	})
	.catch((response) => {
		res.status(500).send({msg : 'Error carajo'});
	});
}

module.exports = isAuth;
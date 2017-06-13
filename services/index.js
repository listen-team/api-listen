'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('.././config');

function createToken (user) {
	const payload = {
		sub : user.dni,
		iat : moment().unix(),
		exp : moment().add(14, 'days').unix(),
	};

	console.log('Estoy creanto un token');

	return jwt.encode(payload, config.SECRET_TOKEN);
}


function decodeToken (token) {
	const decoded = new Promise((resolve, reject) => {
		try {
			const payload = jwt.decode(token, config.SECRET_TOKEN);

			if (payload.exp <= moment().unix()) {
				// 
			}
		} catch(e) {
			reject({
				status : 500,
				msg : 'Token invalido'
			});
		}
	});
}	

module.exports = createToken
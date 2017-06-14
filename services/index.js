'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('.././config');

/*
* Método para generar token de autenticación
*/
function createToken (user) {
	const payload = {
		sub : user.correo,
		iat : moment().unix(),
		exp : moment().add(14, 'days').unix(),
	};

	console.log('Estoy creanto un token');

	return jwt.encode(payload, config.SECRET_TOKEN);
}

/*
* Funcion para decodificar un token
*/
function decodedToken (token) {
	const decoded = new Promise((resolve, reject) => {
		try {
			const payload = jwt.decode(token, config.SECRET_TOKEN);

			if (payload.exp <= moment().unix()) {
				reject({
					status : 401,
					msg : 'El token ha expirado'
				});
			}
			resolve(payload.sub);
		} catch(error) {
			reject({
				status : 500,
				msg : 'Token invalido'
			});
		}
	});
	console.log(decoded);
	return decoded;
}	

module.exports = {
	createToken,
	decodedToken
}
'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('.././config');
const nodemailer = require('nodemailer');

/*
* Método para generar token de autenticación
*/
function createToken (user) {
	const payload = {
		sub : user.correo,
		iat : moment().unix(),
		exp : moment().add(14, 'days').unix(),
	};
	console.log('Creando el token para el usuario ' + user.correo);
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
	return decoded;
}	

/**
 * Funcion para enviar correo de verificacion
 * @param {json} user - Objeto usuario en formato json.
 */
function sendMail(user) {
	let transporter = nodemailer.createTransport({
		service : 'gmail',
		secure : false,
		port : 25,
		auth : {
			user : 'team.listen.developer@gmail.com',
			pass : config.passEmail
		},
		tls : {
			rejectUnauthorized : false
		}
	});

	let HelperOptions = {
		from : '<team.listen.developer@gmail.com>',
		to : user.correo,
		subject : 'Verify account Listen',
		html : '<h2>Hola, '+ user.nombre + ' ' + user.apellido + ':</h2>'+
				'<p>Haz clic en este enlace para verificar tu dirección de correo electrónico.</p>'+
				'https://enlacedeprueba.com'+
				'<p>Si no has emitido esta solicitud, ignora este mensaje.</p>'+
				'<p>Gracias.</p>'+
				'<p>El equipo de listen.</p>'
	};
	transporter.sendMail(HelperOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
	});

}

module.exports = {
	createToken,
	decodedToken,
	sendMail
}
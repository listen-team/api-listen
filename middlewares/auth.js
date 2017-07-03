'use strict';

const service = require('.././services');
const firebase = require('firebase');
const db = firebase.database();
// Referencia al objeto usuario de la base de datos
const refUsuario = db.ref().child('usuario');


function isAuth (req, res, next) {
	if (!req.headers.authorization) {
		return res.status(403).send({
			msg : 'No estas autorizado para acceder al recurso'
		});
	}

	const token = req.headers.authorization;
	
	service.decodedToken(token)
	.then(response => {
		refUsuario.once('value', (snap) => {
			let lista = snap.val();
			let objUsuario = null;
			
			for(let key in lista){
				if (lista[key].correo == response) {
					objUsuario = snap.child(key).val();
			//		console.log(objUsuario);
					break;
				}
			}
			req.user = response;
			req.token = token;
			// Enviar objeto json serializado
			req.robjUsuario = objUsuario;
			next();
		});
	})
	.catch((response) => {
		res.status(500).send(response);
	});
}

module.exports = isAuth;
'use strict';

const firebase = require('firebase');
const config = require('.././config');

// conecta a la base de datos de firebase
/*firebase.initializeApp({
	serviceAccount : '.././database/Listen-a11cf4bc17e5.json',
	databaseURL : config.url
});*/

const db = firebase.database();
//const refUsuario = db.ref().child('usuario');


/*
* Metodo para crear usuarios
*/
function crearUsuario(req, res){
	let objUsuario = {
		email : req.body.email,
		password : req.body.password
	};

	db.ref().createUser(objUsuario, (error) => {
		if (error) {
			res.status(500).send({
				msg : error.code
			});
		}else{
			res.status(200).send({
				msg : 'El usuario ha sido registrdo'
			});
		}
	});

}


module.exports = {
	crearUsuario
}

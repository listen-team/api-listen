'use strict';

const firebase = require('firebase');
const db = firebase.database();
const refUsuario = db.ref().child('usuario');
const service = require('.././services');


/*
* Metodo para crear usuario de firebase
*/
function createUser(req, res){
	let dni = req.body.dni;
	let email = req.body.email;
	let password = req.body.password;
	let apellido = req.body.apellido;
	let nombre = req.body.nombre;
	let genero = req.body.genero;
	let tipoUsuario = req.body.tipoUsuario;
	let fecNac = req.body.fecNac;

	let user = {
		dni : dni,
		correo : email,
		contrasena : password,
		apellido : apellido,
		nombre: nombre,
		genero: genero,
		tipoUsuario : tipoUsuario,
		fecNac : fecNac
	};

	let promise = new Promise((resolve, reject) => {
		firebase.auth().createUserWithEmailAndPassword(email, password)
		.then((result) => {
			if (dni != null) {
				let refObjeto = refUsuario.child(''+dni);
				refObjeto.set(user);
			}
			resolve({
				correo : user.correo,
				token : service.createToken(user),
				msg : `Se registro el usuario ${email}`
			});
		})
		.catch((error) => {
			if (error) {
				reject({
					dni : dni,
					email: email,
					errorCode : error.code,
					errorMessage : error.message
				});
			}
		});
	});

	promise.then((response) => {
		res.status(200).send(response);	
	}, (error) => {
		res.status(500).send(error);
	});	
}

/*
* Metodo para iniciar sesión con firebase
*/
function loginWithFirebase (req, res) {
	let user = {
		correo : req.body.email,
		contrasena : req.body.password
	};

	let promise = new Promise((resolve, reject) => {
		firebase.auth().signInWithEmailAndPassword(user.correo, user.contrasena)
		.then((result) => {
			resolve({
				msg : `Ha iniciado sesion el usuario ${user.correo}`,
				token : service.createToken(user.correo)
			});
		})
		.catch((error) => {
		  	if (error) {
				reject({
					'email': user.correo,
					'errorCode' : error.code,
					'errorMessage' : error.message
				});
			}
		});
	});

	promise.then((response) => {
		res.status(200).send(response);	
	}, (error) => {
		res.status(500).send(error);
	});	
}


/*
* Metodo para cerrar sesión en firebase
**/
function logoutWithFirebase (req, res) {
	let email = req.body.email;

	let promise = new Promise((resolve, reject) => {
		firebase.auth().signOut()
		.then((result) => {
			resolve({
				'msg' : 'Ha cerrado sesión'
			});
		})
		.catch((error) => {
			if (error) {
				reject({
					'msg' : 'Error al cerrar sesión'
				});
			}
		});
	});

	promise.then((response) => {
		res.status(200).send(response);	
	}, (error) => {
		res.status(500).send(error);
	});	
}

function sendPasswordResetEmail (req, res) {
	let email = req.body.email;

	let promise = new Promise((resolve, reject) => {
		firebase.auth().sendPasswordResetEmail(email)
		.then((result) => {
			resolve({
				'msg' : `Se envio el correo de restablecimiento de contraseña a ${email}`
			});
		})
		.catch((error) => {
			if (error) {
				reject({
					'email': email,
					'errorCode' : error.code,
					'errorMessage' : error.message
				});
			}
		});
	});

	promise.then((response) => {
		res.status(200).send(response);	
	}, (error) => {
		res.status(500).send(error);
	});	
}

module.exports = {
	createUser,
	loginWithFirebase,
	logoutWithFirebase,
	sendPasswordResetEmail
}

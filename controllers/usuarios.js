'use strict';

const firebase = require('firebase');
const db = firebase.database();
const refUsuario = db.ref().child('usuario');
const service = require('.././services');
const objResponse = require('.././models/modelResponse');

/**
 * Metodo para crear usuario de firebase
 * @param {http | https} req - Peticion
 * @param {http | https} res  - Respuesta
 */
function createUser(req, res){
	let nuevoUsuario = refUsuario.push();
	let key  = nuevoUsuario.toString().split('/usuario/')[1];
//Pina Records - YefriLactala
	let nombre = req.body.nombre;
	let apellido  = req.body.apellido;
	let correo = req.body.correo;
	let contrasena = req.body.contrasena;
	let fecha_nacimiento = req.body.fecha_nacimiento;
	let condicion = req.body.condicion;
	let codigoVerificacion = Math.round((Math.random()*(999999 - 100000) + 100000));

 
	let user = {
		nombre : nombre,
		apellido : apellido,
		correo : correo,
		contrasena : contrasena,
		fecha_nacimiento: fecha_nacimiento,
		condicion : condicion,
		codigoVerificacion : codigoVerificacion,
		estadoVerifiacion : false
	};
// fin de Pina Records
	let promise = new Promise((resolve, reject) => {
		firebase.auth().createUserWithEmailAndPassword(correo, contrasena)
		.then((result) => {
			///////
			/*firebase.auth().onAuthStateChanged(function(user) {
			  user.sendEmailVerification();
			});*/
			service.sendMail(user);
			///////
			nuevoUsuario.set(user);

			resolve(objResponse.modelResponse(
				service.createToken(user),
				null,
				null,
				true,
				`Se registro el usuario ${key}`,
				1,
				user
			));
		})
		.catch((error) => {
			if (error) {
				reject(objResponse.modelResponse(
					null,
					error.code,
					error.message,
					false,
					`Error al crear el usuario ${user.apellido} ${user.nombre}`,
					0,
					user
				));
			}
		});
	});

	promise.then((response) => {
		res.status(200).send(response);	
	}, (error) => {
		res.status(500).send(error);
	});	
}

/**
 * Metodo para iniciar sesión con firebase
 * @param {http | https} req - Peticion
 * @param {http | https} res  - Respuesta
 */
function loginWithFirebase (req, res) {
	let user = {
		correo : req.body.email,
		contrasena : req.body.password
	};

	let promise = new Promise((resolve, reject) => {
		firebase.auth().signInWithEmailAndPassword(user.correo, user.contrasena)
		.then((result) => {
			resolve(objResponse.modelResponse(
				service.createToken(user.correo),
				null,
				null,
				true,
				`Ha iniciado sesión el usuario ${user.correo}`,
				1,
				user.correo
			));
		})
		.catch((error) => {
		  	if (error) {
				reject(objResponse.modelResponse(
					null,
					error.code,
					error.message,
					false,
					`Error al iniciar sesión con el usuario ${user.correo}`,
					0,
					user.correo
				));
			}
		});
	});

	promise.then((response) => {
		res.status(200).send(response);	
	}, (error) => {
		res.status(500).send(error);
	});
}


/**
 * Metodo para cerrar sesión con una cuenta de Listen
 * @param {http | https} req - Peticion
 * @param {http | https} res  - Respuesta
 */
function logoutWithFirebase (req, res) {
	let email = req.body.email;

	let promise = new Promise((resolve, reject) => {
		firebase.auth().signOut()
		.then((result) => {
			resolve(objResponse.modelResponse(

			));

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

function verificacionEmail(req,res){
	
	const email = req.body.email;
	const codigoVerificacion = req.body.codigoVerificacion;
	
	refUsuario.on('value',(snap)=>{
		let listaCorreo = snap.val();
		let objUsuario;
		let key;


		//declaro un for para recorrer los valores que traigo
		for(let llave in listaCorreo){
			console.log(llave);
			if(listaCorreo[llave].correo == email){
				key = llave;
				objUsuario = listaCorreo[llave];
				console.log(objUsuario);
				break;
			}
		}
		console.log(objUsuario);
		if(objUsuario !== undefined){
			if(objUsuario.codigoVerificacion == codigoVerificacion){
				//actualizacion
				let refUpdate = refUsuario.child(''+key);
				let obj = {
					estadoVerifiacion : true
				};

				refUpdate.update(obj);

				res.status(200).send(objResponse.modelResponse(
					null,null,null,true,"Verificacion Exitosa",1,objUsuario
				));
			}else{
				res.status(404).send({msg : "el codigo de verificacion es incorrecto"});
			}
		}else{
			res.status(404).send({msg : "No Existe el correo"});
		}

	});	
}


function iniciarSesion (req, res) {
	let user = {
		correo : req.body.email,
		contrasena : req.body.password
	};
	
	let promise = new Promise((resolve, reject) => {
		firebase.auth().signInWithEmailAndPassword(user.correo, user.contrasena)
		.then((result) => {
			resolve({
				msg : `Ha iniciado sesion el usuario ${user.correo}`,
				token : service.createToken(req.body.email)
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

module.exports = {
	createUser,
	loginWithFirebase,
	logoutWithFirebase,
	sendPasswordResetEmail,
	iniciarSesion,
	verificacionEmail
}

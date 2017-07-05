'use strict';

const firebase = require('firebase');
const db = firebase.database();
// Referencia al objeto usuario de la base de datos
const refUsuario = db.ref().child('usuario');
// Importa el modulo services
const service = require('.././services');
// Importa el objeto response
const objResponse = require('.././models/modelResponse');
const refUsuariosSeguidos = db.ref().child('usuario_seguidos');
//  Referencia al objeto usuarioxcategoria de la base de datos
const refUsuarioCategoria = db.ref().child('usuarioxcategoria');
const refCategoria = db.ref().child('categoria');
const refIdea = db.ref().child('idea');
const refSeguirIdea = db.ref().child('ideas_seguidas');
const refLikesIdeas =db.ref().child('like_idea');

// Metodo para crear usuario
function createUser(req, res){
	console.log('Request >>> http://localhost:3002/api/user');
	let nombre = req.body.nombre;
	let apellido  = req.body.apellido;
	let correo = req.body.correo;
	let contrasena = req.body.contrasena;
	let fecha_nacimiento = req.body.fecha_nacimiento;
	let condicion = req.body.condicion;
	let codigoVerificacion = Math.round((Math.random()*(999999 - 100000) + 100000));
	// id del usuario
	let iduser = nombre.split(" ")[0]+apellido.split(" ")[0];
	let nuevoUsuario = refUsuario.child(iduser.toLowerCase());
	let key  = nuevoUsuario.toString().split('/usuario/')[1];
 
	let user = {
		nombre : nombre,
		apellido : apellido,
		correo : correo,
		contrasena : contrasena,
		fecha_nacimiento: fecha_nacimiento,
		condicion : condicion,
		codigoVerificacion : codigoVerificacion,
		estadoVerifiacion : false,
		username : key
	};

	let promise = new Promise((resolve, reject) => {
		firebase.auth().createUserWithEmailAndPassword(correo, contrasena)
		.then((result) => {
			service.sendMail(user);
			nuevoUsuario.set(user);
			resolve(objResponse.modelResponse(
				null,
				null,
				null,
				true,
				`Se registro el usuario ${key}`,
				1,
				"ok"
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
					"error"
				));
			}
		});
	});

	promise.then((response) => {
		res.send(response);	
	}, (error) => {
		res.send(error);
	});	
}

function loginWithGoogle(require,response){
	let user = {
		correo : require.body.email,
		contrasena : require.body.contrasena
	};

	let promise = new Promise((resolve,reject)=>{
			if(!firebase.auth().curentUser){
				let provider = new firebase.auth.GoogleAuthProvider(user.correo,user.contrasena);
					provider.addScope('https://www.googleapis.com/auth/plus.login');
				firebase.auth().signInWithRedirect(provider)
				.then((result)=>{
					//obtengo los valores que a mi me interesan:	
					resolve(objResponse.modelResponse(service.createToken(user.correo),null,null,true,`Ha iniciado sesión en GOOGLE el usuario ${user.correo}`,1,user.correo));
				}).catch((error)=>{
					if(error){
						reject(objResponse.modelResponse(null,error.errorCode,error.message,false,`Error al iniciar sesión en GOOGLE con el usuario ${user.correo}`,1,user.correo));
					}
					//error de credenciales
					let credential = error.credential;
					//verificamos si el error fue de credenciales 
					if(errorCode === 'auth/account-exists-with-different-credential'){
						console.log("Es el mismo USUARIO  ===> " + errorCode);
						reject(objResponse.modelResponse(null,error.errorCode,error.message,false,`Error al iniciar sesión en GOOGLE con el usuario ${user.correo}`,1,user.correo));
					}
				});
				
		}else{
				firebase.auth().signOut();
			}	
	});

	promise.then((response) => {
		response.status(200).send(response);	
	}, (error) => {
		response.status(500).send(error);
	});	
}

// Método parar iniciar sesión con firebase
function loginWithFirebase (req, res) {
	console.log('Request >>> http://localhost:3002/api/login')
	let user = {
		correo : req.body.email,
		contrasena : req.body.password
	};

	let promise = new Promise((resolve, reject) => {
		firebase.auth().signInWithEmailAndPassword(user.correo, user.contrasena)
		.then((result) => {
			resolve(objResponse.modelResponse(
				service.createToken(user),null,null,true,`Ha iniciado sesión el usuario ${user.correo}`,1,user.correo
			));
		})
		.catch((error) => {
		  	if (error.code == 'auth/user-not-found') {
				reject(objResponse.modelResponse('',error.code,error.message,false,`El usuario ${user.correo} no se encuentra registrado`,0,'error'
				));
			}else if(error.code == 'auth/wrong-password'){
				reject(objResponse.modelResponse('',error.code,error.message,false,`La contraseña del usuario ${user.correo} es incorrecta`,0,'error'
				));
			}else{
				reject(objResponse.modelResponse('',error.code,error.message,false,`Error al iniciar sesion con el usuario ${user.correo}`,0,'error'
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

// Metodo para cerra sesion
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

// Metodo para restablecer contraseña
function sendPasswordResetEmail (req, res) {
	console.log('Request >>> http://localhost:3002/api/senResetPassword');
	let email = req.body.email;

	let promise = new Promise((resolve, reject) => {
		firebase.auth().sendPasswordResetEmail(email)
		.then((result) => {
			resolve(objResponse.modelResponse('', null, null, true, `Se envio el correo de restablecimiento de contraseña a ${email}`, 1, 'ok' ));
		})
		.catch((error) => {
			if(error.code == 'auth/user-not-found'){
				reject(objResponse.modelResponse('', error.code, error.message, false, `El usuario ${email} no se encuentra registrado`, 0, 'error'));
			}else{
				reject(objResponse.modelResponse('', error.code, error.message, false, `Error al enviar correo de restablecimiento a ${email}`, 0, 'error'));
			}
		});
	});

	promise.then((response) => {
		res.status(200).send(response);	
	}, (error) => {
		res.status(500).send(error);
	});	
}

// Método para verificar el email
function verificacionEmail(req,res){
	console.log('Request >>> http://localhost:3002/api/verificarEmail');
	const email = req.body.email;
	const codigoVerificacion = req.body.codigoVerificacion;

	refUsuario.once('value',(snap)=>{
		let listaCorreo = snap.val();
		let objUsuario;
		let key;

		for(let llave in listaCorreo){
			if(listaCorreo[llave].correo == email){
				key = llave;
				objUsuario = listaCorreo[llave];
				break;
			}
		}

		if(objUsuario !== undefined){
			if(objUsuario.codigoVerificacion == codigoVerificacion){
				//actualizacion
				let refUpdate = refUsuario.child(''+key);
				let obj = {
					estadoVerifiacion : true
				};

				refUpdate.update(obj);

				return res.send(objResponse.modelResponse(
					'',null,null,true,"Verificacion Exitosa",1,'ok'
				));
			}else{
				return res.send(objResponse.modelResponse('', 'CODIGO_INCORRECTO', 'El código de verificación es incorrecto', 
				false, "El código de verificación es incorrecto", 0, "error"));
			}
		}else{
			return res.send(objResponse.modelResponse('', 'CORREO_INVALIDO', 'No existe el correo', 
				false, "El correo ingresado no esta registrado", 0, "error"));
		}

	});	
}

// Flata terminar este metodo
function seguidoresPorUsuario(req, res) {
	/*let correo  = req.user;
	let nombreReferencia = correo.replace('@', '').replace('.', '');
	let nuevoSeguidor = refUsuariosSeguidos.child(nombreReferencia);
	//let key = nuevoSeguidor.toString().split('/usuario_seguidos/')[1];
	
	let token = req.token;
	let jsonPersonaSeguida = {
		usuario : {
			email : correo
			//nombre : req.body.nombre,
			//apellido : req.body.apellido,
			//foto : req.body.foto
		}		
	}
	nuevoSeguidor.update(jsonPersonaSeguida);

	const refSiguiendo = db.ref().child('usuario_seguidos').child(nombreReferencia).child('siguiendo');
	let nuevo_Seguidor = refSiguiendo.push();

	let objnuevo_Seguidor = {
		nombre : req.body.nombre,
		apellido : req.body.apellido
	};

	/////
	//const refUsuariosSeguidos = db.ref().child('usuario_seguidos');
	//const refSiguiendo = refUsuariosSeguidos.child(key).child('siguiendo');
	////////
	nuevo_Seguidor.update(objnuevo_Seguidor);
	


	

	
	res.send({msg : 'Seguidor creado', data : jsonPersonaSeguida, lista : objnuevo_Seguidor});
*/
}

// Método para seguir usuario
function seguirPersona(req, res) {
	console.log('Request >>> http://localhost:3002/api/seguirPersona');
	let correo2 = req.body.usuarioAseguir;
	let usuario = req.robjUsuario;
	
	if(correo2 !== usuario.correo){
		refUsuario.once('value', (snap) => {
			let lista = snap.val();
			// El usuario a seguir es el usuario 2
			let usuario2 = null;
			
			for(let key in lista){
				if (lista[key].correo == correo2) {
					usuario2 = snap.child(key).val();
					break;
				}
			}
			
			if(usuario2 !== null){
				let foto = usuario2.foto === undefined  || usuario2.foto === null ? '' : usuario2.foto;
				let dni = usuario2.dni === undefined  || usuario2.dni == null ? '' : usuario2.dni;
				let crearPersona = refUsuariosSeguidos.child(usuario.username).child(usuario2.username);
				let nuevoPersonaASeguir = {
					nombre : usuario2.nombre,
					apellido : usuario2.apellido,
					correo : usuario2.correo,
					contrasena : usuario2.contrasena,
					fecha_nacimiento: usuario2.fecha_nacimiento,
					username : usuario2.username,
					foto,
					dni
				}; 
				crearPersona.set(nuevoPersonaASeguir);
				res.send(objResponse.modelResponse('', null, null, true, `El usuario ${usuario.username} sigue a ${usuario2.username}`, 1, 'ok'));
			}else if(usuario2 === null){
				res.send(objResponse.modelResponse('', 'NOT_FOUND_USER', 'Usuario no registrado', false, `El usuario ${correo2} no existe`, 0, 'error'));
			}else{
				res.send(objResponse.modelResponse('', 'ERROR', 'Error al seguir usuario', false, `Error cuando el  usuario ${usuario.username} sigue a ${correo2}`, 0, 'error'));
			}
		});	
	}else{
		res.send(objResponse.modelResponse('', 'SAME_USERS', 'Usuarios iguales', false, `El usuario ${usuario.correo} no se puede seguir a si mismo `, 0, 'error'));
	}
}

// Método para seguir categoría
function seguirCategoria(req, res) {
	console.log('Request >>> http://localhost:3002/api/seguirCategoria');
	let usuario = req.robjUsuario;
	let categoria = req.body.idCategoria === null || req.body.idCategoria === undefined ? '' : req.body.idCategoria;
	
	if (categoria !== '') {
		refCategoria.once('value', (snap) => {
			let objCategoria = null;

			for(let key in snap.val()){
				if(key === categoria){
					objCategoria = snap.val()[key];
					break;
				}
			}

			if(objCategoria !== null){
				let crearCategoria  = refUsuarioCategoria.child(usuario.username).child(categoria);
				let nuevaCategoria = {
					tipo : objCategoria.tipo
				}
				crearCategoria.set(nuevaCategoria);
				res.send(objResponse.modelResponse('', '', '', true, `El usuario ${usuario.username} esta siguiendo la categoría ${categoria}`, 1, 'ok'));
			}else if(objCategoria === null){
				res.send(objResponse.modelResponse('', 'NOT_FUND', 'Categoria no encontrada', false, `La categoria ${categoria} no existe`,0, 'error'));
			}else{
				res.send(objResponse.modelResponse('', 'ERROR', 'Error al seguir categoria', false, `Error cuando el usuario ${usuario.username} intento seguir la categoría ${categoria}`, 0, 'error'));	
			}

		});
	}else{
		res.send(objResponse.modelResponse('', 'EMPTY_VALUE', 'El id de la categoria esta vacío', false, `No ha ingresado el id de la categoria a seguir`, 0, 'error'));
	}
}

// Método para seguir idea
function seguirIdea(req, res) {
	console.log('Request >>> http://localhost:3002/api/seguirIdea');
	let usuario = req.robjUsuario;
	let idIdea = req.body.idIdea === null || req.body.idIdea === undefined ? '' : req.body.idIdea;

	if (idIdea !== '') {
		refIdea.once('value',  (snap) => {
			let idea = null;

			for(let key in snap.val()){
				if (key === idIdea) {
					idea = snap.val()[key];
					break;
				}
			}

			if (idea !== null) {
				let crearIdea = refSeguirIdea.child(usuario.username).child(idIdea);

				let nuevaIdea = {
					nombre : idea.nombre,
					descripcion : idea.descripcion,
					beneficios: idea.beneficios,
					disposicionesFinales: idea.disposicionesFinales,
					efectos: idea.efectos,
					fechaElaboracion: idea.fechaElaboracion,
					formulaLegal: idea.formulaLegal,
					motivos: idea.motivos,
					imagen : idea.imagen,
					likes : idea.likes,
					contribuidores : idea.contribuidores,
					creador : {
						username : idea.creador.username,
						nombre : idea.creador.nombre,	
						apellido : idea.creador.apellido,
						foto : idea.creador.foto
					},
					categoria : idea.categoria,
				}
				crearIdea.set(nuevaIdea);
				res.send(objResponse.modelResponse('','','',true, `El usuario ${usuario.username} esta siguiendo la idea ${idIdea}`, 1, 'ok'));
			}else if(idea === null){
				res.send(objResponse.modelResponse('', 'NOT_FOUND', 'Idea no encontrada', false, `La idea ${idIdea} no existe`, 0, 'error'));
			}else{
				res.send(objResponse.modelResponse('', 'ERROR', 'Error al seguir idea', false, `Error cuando el usuario ${usuario.username} intento seguir la idea ${idIdea}`, 0, 'error'));	
			}
		});
	}else{
		res.send(objResponse.modelResponse('', 'EMPTY_VALUE', 'El id de la idea esta vacío', false, `No ha ingresado el id de la idea a seguir`, 0, 'error'));
	}
}

// Método para dar like a una idea
function darLike(req, res) {
	console.log('Request >>> http://localhost:3002/api/darlike');
	let idIdea = req.body.idIdea === null || req.body.idIdea === undefined ? '' : req.body.idIdea;
	
	if (idIdea !== '') {
		refIdea.once('value', (snap) => {
			let idea = null;
			for(let key in snap.val()){
				if(idIdea === key){
					idea = snap.val()[key];
					break;
				}
			}

			if (idea !== null) {
				let sumarLike = idea.likes + 1;

				let refLike = refIdea.child(''+idIdea);
				let obj = {
					likes : sumarLike
				};	

				refLike.update(obj);
				res.send(objResponse.modelResponse('','','',true, `Se dio like a la idea ${idIdea}`, 1, 'ok'));
			}else if(idea === null){
				res.send(objResponse.modelResponse('', 'NOT_FOUND', 'Idea no encontrada', false, `No existe la idea ${idIdea}`, 0, 'error'));
			}else{
				res.send(objResponse.modelResponse('', 'ERROR', 'Error al dar like a la idea', false, 'Error al like a la idea', 0, 'error'))
			}
		});	
	}else{
		res.send(objResponse.modelResponse('', 'EMPTY_VALUE', 'No se encontró el campo idIdea', false, 'No ha ingresado el id de3 la idea', 0, 'error'));
	}
}

// Método para contribuir con una idea
function contribuirIdea(req, res){
	console.log('Request >>> http://localhost:3002/api/contribuirIdea');
	let usuario = req.robjUsuario;
	let idIdea = req.body.idIdea === null || req.body.idIdea === undefined ? '' : req.body.idIdea;

	if(idIdea !== ''){
		refIdea.once('value', (snap) => {
			let idea = null;
			for(let key in snap.val()){
				if(key === idIdea){
					idea = snap.val()[key];
				}
			}
			if(idea !== null){
				if(idea.creador.username !== usuario.username){
					refUsuariosSeguidos.once('value', (snap) => {
						let sigueAlCreador = false;
						for(let key in snap.val()){
							if(key === usuario.username){
								for(let clave in snap.val()[key]){
									if(clave === idea.creador.username){
										sigueAlCreador = true;
										break;
									}
								}
							}
						}	
						let contribuidor = {
							username : usuario.username,
							nombre : usuario.nombre,
							apellido : usuario.apellido,
							correo : usuario.correo,
							foto : usuario.foto === null || usuario.foto === undefined ? '' : usuario.foto,
							sigueAlCreador
						}

						let agregarContribuidor = refIdea.child(''+idIdea).child('contribuidores').child(''+usuario.username);
						agregarContribuidor.update(contribuidor);
						res.send(objResponse.modelResponse('','','',true,`El usuario ${usuario.username} está contribuyendo con la idea ${idIdea}`, 1, 'ok'));
					});
				}else{
					res.send(objResponse.modelResponse('', 'EQUAL_USERNAME', 'Usuario iguales', false,`El usuario ${usuario.username} no puede contribuir con su propia idea`, 0, 'error'));
				}
			}else if(idea === null){
				res.send(objResponse.modelResponse('', 'NOT_FOUND', 'Idea no encontrada', false, `La idea con el id ${idIdea} no existe`, 0, 'error'));
			}else{
				res.send(objResponse.modelResponse('', 'ERROR', 'Error contriuyendo idea', false, `Error al contribuir la idea ${idIdea}`, 0, 'error'));
			}
		});
	}else{
		res.send(objResponse.modelResponse('', 'EMPTY_VALUE', 'Id de la idea vacío', false, 'Ingresar el id de la idea a contribuir', 0, 'error'));
	}
}

module.exports = {
	createUser,
	loginWithFirebase,
	logoutWithFirebase,
	sendPasswordResetEmail,
	loginWithGoogle,
	verificacionEmail,
	seguidoresPorUsuario,
	seguirPersona,
	seguirCategoria,
	seguirIdea,
	darLike,
	contribuirIdea
}

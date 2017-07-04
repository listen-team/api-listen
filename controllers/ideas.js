'use strict';

const firebase = require('firebase');
const config = require('.././config');
const db = firebase.database();
const refIdea = db.ref().child('idea');
const refUser = db.ref().child('usuario');
const idea = require('.././models/modelIdea');
const modelIdea = require('.././models/modelResponse');
const refUsuarioCategoria = db.ref().child('usuarioxcategoria');
const service = require('.././services');
const response = require('.././models/modelResponse');


/**
 * Metodo para listar ideas
 * @param {http | https} req - Peticion
 * @param {http | https} res  - Respuesta
 */
function listarIdeas (req, res) {
	let data = idea.listaDeIdeas();
	res.status(200).send(modelIdea.modelResponse(
			null,
			null,
			null,
			true, 
			`Se listaron las ideas`, 
			data.length, 
			data)
	);
}

/**
 * Metodo para crear una idea
 * @param {http | https} req - Peticion
 * @param {http | https} res  - Respuesta
 */
function crearIdea (req, res) {
	let crearIdea = refIdea.push();
	let key = crearIdea.toString().split('/idea/')[1];
	let usuario = req.robjUsuario;

	let nuevaIdea = {
		nombre : req.body.nombre === null || req.body.nombre === undefined ? '' : req.body.nombre,
		descripcion : req.body.descripcion === null || req.body.descripcion === undefined ? '' : req.body.descripcion,
		beneficios: req.body.beneficios === null || req.body.beneficios === undefined ? '' : req.body.beneficios,
		disposicionesFinales: req.body.disposicionesFinales === null || req.body.disposicionesFinales === undefined ? '' : req.body.disposicionesFinales,
		efectos: req.body.efectos === null || req.body.efectos === undefined ? '' : req.body.efectos,
		fechaElaboracion: service.getDate(),
		formulaLegal: req.body.formulaLegal === null || req.body.formulaLegal === undefined ? '' : req.body.formulaLegal,
		motivos: req.body.motivos === null || req.body.motivos === undefined ? '' : req.body.motivos,
		imagen : req.body.imagen === null || req.body.imagen === undefined ? '' : req.body.imagen,
		likes : 0,
		contribuidores : '',
		creador : {
			username : usuario.username,
			nombre : usuario.nombre,	
			apellido : usuario.apellido,
			foto : usuario.foto === null || usuario.foto === undefined ? '' : usuario.foto
		},
		categoria : req.body.categoria === null || req.body.categoria === undefined ? '' : req.body.categoria,
	}

	crearIdea.set(nuevaIdea);
	res.send(response.modelResponse('', '', '', true, `Se registro la idea ${key}`, 1, 'ok'));
}

function ideasPorCategoriaDelUsuario(req, res) {
	let email = req.user;
	let token = req.token;

	refUsuarioCategoria.on('value', (snap) => {
		let lista = snap.val();
		let user = null;
		let keyUser =null;

		for(let key in lista){
			console.log(lista[key].correo + ' < > '+ email);
			if (lista[key].correo == email) {
				user = lista[key];
				keyUser = key;
				console.log(user);
				break;
			}
		}
		
		console.log(user == null);
		console.log("user", user);
		if(user != null){
			refIdea.on('value', (snap) => {
				let listaIdea = snap.val();
				let ideasDelUsuario = [];
				///
				let nombres = ['','Yefrin Laura','Alonso Moreno','Bruno Landacay','Eduardo Leandro','Luis Acosta'];
				let cantidadUsuarios  = ['',50,45,80,102,87];
				let cantidadContribuyentes  = ['',98,14,50,6,98];
				let sigue = [true,true,true,false,true, false, false];
				let contador = 0;
				let fotos = ['', 
					'https://randomuser.me/api/portraits/men/0.jpg',
					'https://avatars0.githubusercontent.com/u/17907355?v=3&s=400',
					'https://randomuser.me/api/portraits/men/2.jpg',
					'https://randomuser.me/api/portraits/men/3.jpg',
					'https://randomuser.me/api/portraits/men/4.jpg',
					'https://randomuser.me/api/portraits/men/5.jpg'];
				let arrayNombre = ['hola','Reduccion del peaje','Libros Virtuales','Reduccion medio pasaje','Matrimonio homosexual','Reduccion pension cibertec'];
				
				for(let key in listaIdea){
					contador++
					if (listaIdea[key].categoria == user.categoria) {
						let ideaUsu = {
							id : key,
							nombre :arrayNombre[listaIdea[key].numero],
							descripcion : listaIdea[key].descripcion,
							imagen : ['https://randomuser.me/api/portraits/women/10.jpg','https://randomuser.me/api/portraits/women/2.jpg','https://randomuser.me/api/portraits/women/6.jpg','https://randomuser.me/api/portraits/women/9.jpg'],
							like : 40,
							cantContrib : cantidadContribuyentes[listaIdea[key].numero],
							idCreador : cantidadUsuarios[listaIdea[key].numero],
							nombreCreador : nombres[listaIdea[key].numero],
							fotoCreador : fotos[listaIdea[key].numero],
							fotoContribuidor : ['https://randomuser.me/api/portraits/women/10.jpg','https://randomuser.me/api/portraits/women/2.jpg','https://randomuser.me/api/portraits/women/6.jpg','https://randomuser.me/api/portraits/women/9.jpg'],
							sigueAlCreador : sigue[listaIdea[key].numero]
						}
						//ideasDelUsuario.push(listaIdea[key]);	
						ideasDelUsuario.push(ideaUsu);	
						console.log(user + ' <> ' + contador);
					}
				}		

				res.status(200).send(modelIdea.modelResponse(token, null, null, true, 'Se listaron las ideas del usuario', ideasDelUsuario.length, ideasDelUsuario));

			});
		}else{
			res.status(404).send(modelIdea.modelResponse(token,null,null,false, 'El usuario no sigue a ninguna categoria', 0, email));
		}
	});
}

function ideasSeguidas(req, res){

}


module.exports = {
	listarIdeas,
	crearIdea,
	ideasPorCategoriaDelUsuario
};


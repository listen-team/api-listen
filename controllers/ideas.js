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
const refUsuariosSeguidos = db.ref().child('usuario_seguidos');


// Método para listar ideas
function listarIdeas (req, res) {
	console.log('Request >>> http://localhost:3002/api/idea');

	refIdea.once('value', (snap) => {
		let arrayIdeas = [];
		for(let key in snap.val()){
			/////////////////
			let arrayContribuidores = [];
			for(let clave in snap.val()[key].contribuidores){
				let contribuidor = {
					apellido : snap.val()[key].contribuidores[clave].apellido,
					correo : snap.val()[key].contribuidores[clave].correo,
					foto : snap.val()[key].contribuidores[clave].foto,
					nombre : snap.val()[key].contribuidores[clave].nombre,
					sigueAlCreador : snap.val()[key].contribuidores[clave].sigueAlCreador,
					username : snap.val()[key].contribuidores[clave].username
				}
				arrayContribuidores.push(contribuidor);
			}
			
			////////////////
			let objetoIdea = {
				beneficios: snap.val()[key].beneficios,
				categoria: snap.val()[key].categoria,
				contribuidores: arrayContribuidores,
				creador: snap.val()[key].creador,
				descripcion: snap.val()[key].descripcion,
				disposicionesFinales: snap.val()[key].disposicionesFinales,
				efectos: snap.val()[key].efectos,
				fechaElaboracion: snap.val()[key].fechaElaboracion,
				formulaLegal: snap.val()[key].formulaLegal,
				imagen: snap.val()[key].imagen,
				likes: snap.val()[key].likes,
				motivos: snap.val()[key].motivos,
				nombre: snap.val()[key].nombre
			};
			arrayIdeas.push(objetoIdea);
		}
		let data = idea.listaDeIdeas();
		res.status(200).send(modelIdea.modelResponse('','','',true, `Se listaron las ideas`, data.length, arrayIdeas));
	});
}

// Método para crear ideas
function crearIdea (req, res) {
	console.log('Request >>> http://localhost:3002/api/idea');
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
			correo : usuario.correo,
			foto : usuario.foto === null || usuario.foto === undefined ? '' : usuario.foto
		},
		categoria : req.body.categoria === null || req.body.categoria === undefined ? '' : req.body.categoria,
	}

	crearIdea.set(nuevaIdea);
	res.send(response.modelResponse('', '', '', true, `Se registro la idea ${key}`, 1, 'ok'));
}

// Método para listar ideas según las categoría q sigue el usuario
function ideasPorCategoriaDelUsuario(req, res) {
	console.log('Request >>> http://localhost:3002/api/ideasxusuario');
	let usuario = req.robjUsuario;
	refUsuarioCategoria.once('value', (snap) => {
		let arrayCategorias = [], array2 = [];
		for(let key in snap.val()){
			if(key === usuario.username){
				arrayCategorias.push(snap.val()[key])
			}
		}
		
		for(let key in arrayCategorias){
			for(let key2 in arrayCategorias[key]){
				array2.push(arrayCategorias[key][key2].tipo);
			}
		}
		
		if(array2.length === 0){
			res.send(response.modelResponse('', '', '', true, 'El usuario no sigue ninguna categoria', 0, array2));
		}else{
			refIdea.once('value', (snap) => {
				let arrayIdeas = [];

				for(let key in snap.val()){
					for(let clave in array2){
						if(snap.val()[key].categoria === array2[clave]){
							let verificarSiSigue = refUsuarioCategoria.child(''+usuario.username).child(''+snap.val()[key].creador.username) .toString().split('/'+usuario.username+'/')[1];
							let sigueAlCreador = verificarSiSigue === null || verificarSiSigue === undefined ? false : true;
							
							let arrayFotos = [];

							for(let clv in snap.val()[key].contribuidores){
								arrayFotos.push(snap.val()[key].contribuidores[clv].foto);
							}

							let objetoIdea = {
								id : key,
								nombre : snap.val()[key].nombre,
								descripcion : snap.val()[key].descripcion,
								imagen : snap.val()[key].imagen,
								likes : snap.val()[key].likes,
								cantContrib : snap.val()[key].contribuidores.length === null || snap.val()[key].contribuidores.length === undefined ? 0 : snap.val()[key].contribuidores.length,
								idCreador : usuario.username,
								correoCreador : usuario.correo,
								nombreCreador : `${usuario.nombre.split(' ')[0]} ${usuario.apellido.split(' ')[0]}`,
								fotoCreador : snap.val()[key].creador.foto,
								fotoContribuidor : arrayFotos,
								sigueAlCreador
							}

							arrayIdeas.push(objetoIdea);
							break;
						}
					}
				}
				res.send(response.modelResponse('', '', '', true, `Lista de ideas según las categorias que sigue el usuario ${usuario.username}`, arrayIdeas.length, arrayIdeas));
			});
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

